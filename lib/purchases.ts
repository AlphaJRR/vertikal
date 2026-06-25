import { Platform } from "react-native";
import type {
  CustomerInfo,
  PurchasesOffering,
  PurchasesOfferings,
  PurchasesPackage,
  PurchasesStoreProduct,
} from "react-native-purchases";

export type {
  CustomerInfo,
  PurchasesOffering,
  PurchasesOfferings,
  PurchasesPackage,
  PurchasesStoreProduct,
};

/** RevenueCat entitlement identifier — maps to AVA Pro access. */
export const REVENUECAT_ENTITLEMENT_PRO = "pro";

/** Shown in UI; must match RevenueCat entitlement display name in dashboard. */
export const ENTITLEMENT_DISPLAY_NAME = "ALPHA Creators Pro";

/** AVA Pro product IDs — must match App Store Connect + RevenueCat. */
export const FOUNDING_PRODUCT_IDS = {
  monthly: "AvaCreatorPro",
  annual: "yearly",
} as const;

/** RevenueCat dashboard default offering identifier. */
export const DEFAULT_OFFERING_ID = "default";

export type PaywallPlanErrorCode =
  | "api_key_missing"
  | "module_unavailable"
  | "not_configured"
  | "offerings_fetch_failed"
  | "no_offering"
  | "store_products_unavailable";

export type PaywallPlanError = {
  code: PaywallPlanErrorCode;
  message: string;
  detail?: string;
};

export type PaywallPlanLoadResult = {
  monthlyPkg: PurchasesPackage | null;
  annualPkg: PurchasesPackage | null;
  monthlyProduct: PurchasesStoreProduct | null;
  annualProduct: PurchasesStoreProduct | null;
  error: PaywallPlanError | null;
};

/** RevenueCat PURCHASE_CANCELLED_ERROR — avoid static import of native module. */
const PURCHASE_CANCELLED_ERROR_CODE = 1;

type PurchasesModule = typeof import("react-native-purchases");

let purchasesModule: PurchasesModule | null = null;
let purchasesLoadPromise: Promise<PurchasesModule | null> | null = null;
let configured = false;

async function getPurchasesModule(): Promise<PurchasesModule | null> {
  if (Platform.OS !== "ios") return null;

  if (purchasesModule) return purchasesModule;

  if (!purchasesLoadPromise) {
    purchasesLoadPromise = import("react-native-purchases")
      .then((mod) => {
        purchasesModule = mod;
        return mod;
      })
      .catch((error) => {
        console.error("[purchases] failed to load react-native-purchases:", error);
        return null;
      });
  }

  return purchasesLoadPromise;
}

function getIosApiKey(): string | undefined {
  return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
}

export function isPurchasesSupported(): boolean {
  return Platform.OS === "ios" && Boolean(getIosApiKey());
}

export function isPurchasesConfigured(): boolean {
  return configured;
}

function formatRevenueCatError(error: unknown): string {
  if (typeof error === "object" && error != null) {
    const parts: string[] = [];
    if ("code" in error) parts.push(`RC code ${String(error.code)}`);
    if ("message" in error && error.message) {
      parts.push(String(error.message));
    }
    if (parts.length > 0) return parts.join(": ");
  }
  if (error instanceof Error) return error.message;
  return String(error);
}

export function hasProEntitlement(info: CustomerInfo): boolean {
  return info.entitlements.active[REVENUECAT_ENTITLEMENT_PRO] != null;
}

export async function initPurchases(userId?: string | null): Promise<void> {
  if (Platform.OS !== "ios") return;

  const apiKey = getIosApiKey();
  if (!apiKey) {
    console.warn("[purchases] EXPO_PUBLIC_REVENUECAT_IOS_API_KEY not set");
    return;
  }

  const mod = await getPurchasesModule();
  if (!mod) return;

  const Purchases = mod.default;
  const { LOG_LEVEL } = mod;

  try {
    if (!configured) {
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
      }
      Purchases.configure({
        apiKey,
        appUserID: userId ?? undefined,
      });
      configured = true;
      return;
    }

    if (userId) {
      await Purchases.logIn(userId);
    }
  } catch (error) {
    console.error("[purchases] initPurchases failed:", error);
  }
}

export async function logOutPurchases(): Promise<void> {
  if (!configured || Platform.OS !== "ios") return;

  const mod = await getPurchasesModule();
  if (!mod) return;

  try {
    await mod.default.logOut();
  } catch (error) {
    console.error("[purchases] logOutPurchases failed:", error);
  }
}

export async function getOfferings(): Promise<PurchasesOfferings | null> {
  if (!isPurchasesSupported()) return null;

  if (!configured) {
    console.warn("[purchases] getOfferings called before configure — running initPurchases");
    await initPurchases(null);
    if (!configured) return null;
  }

  const mod = await getPurchasesModule();
  if (!mod) return null;

  try {
    return await mod.default.getOfferings();
  } catch (error) {
    console.error("[purchases] getOfferings failed:", error);
    return null;
  }
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!isPurchasesSupported()) return null;

  const mod = await getPurchasesModule();
  if (!mod) return null;

  try {
    return await mod.default.getCustomerInfo();
  } catch (error) {
    console.error("[purchases] getCustomerInfo failed:", error);
    return null;
  }
}

export function resolveCurrentOffering(
  offerings: PurchasesOfferings,
): PurchasesOffering | null {
  if (offerings.current) return offerings.current;
  if (offerings.all[DEFAULT_OFFERING_ID]) {
    return offerings.all[DEFAULT_OFFERING_ID];
  }

  for (const offering of Object.values(offerings.all)) {
    if (offering.availablePackages.length > 0) return offering;
  }

  const allOfferings = Object.values(offerings.all);
  return allOfferings[0] ?? null;
}

function findPackageInOffering(
  offering: PurchasesOffering,
  productId: string,
): PurchasesPackage | null {
  for (const pkg of offering.availablePackages) {
    if (pkg.product.identifier === productId) {
      return pkg;
    }
  }
  return null;
}

export function findPackageByProductId(
  offerings: PurchasesOfferings,
  productId: string,
): PurchasesPackage | null {
  const offering = resolveCurrentOffering(offerings);
  if (!offering) return null;
  return findPackageInOffering(offering, productId);
}

export function getFoundingPackagesFromOffering(offering: PurchasesOffering): {
  monthly: PurchasesPackage | null;
  annual: PurchasesPackage | null;
} {
  return {
    monthly:
      offering.monthly ??
      findPackageInOffering(offering, FOUNDING_PRODUCT_IDS.monthly),
    annual:
      offering.annual ??
      findPackageInOffering(offering, FOUNDING_PRODUCT_IDS.annual),
  };
}

export function getFoundingPackages(offerings: PurchasesOfferings): {
  monthly: PurchasesPackage | null;
  annual: PurchasesPackage | null;
} {
  const offering = resolveCurrentOffering(offerings);
  if (!offering) return { monthly: null, annual: null };
  return getFoundingPackagesFromOffering(offering);
}

export async function getFoundingStoreProducts(): Promise<{
  monthly: PurchasesStoreProduct | null;
  annual: PurchasesStoreProduct | null;
}> {
  if (!isPurchasesSupported()) {
    return { monthly: null, annual: null };
  }

  const mod = await getPurchasesModule();
  if (!mod) return { monthly: null, annual: null };

  try {
    const products = await mod.default.getProducts([
      FOUNDING_PRODUCT_IDS.monthly,
      FOUNDING_PRODUCT_IDS.annual,
    ]);
    return {
      monthly:
        products.find((p) => p.identifier === FOUNDING_PRODUCT_IDS.monthly) ??
        null,
      annual:
        products.find((p) => p.identifier === FOUNDING_PRODUCT_IDS.annual) ??
        null,
    };
  } catch (error) {
    console.error("[purchases] getFoundingStoreProducts failed:", error);
    return { monthly: null, annual: null };
  }
}

export async function loadPaywallPlans(): Promise<PaywallPlanLoadResult> {
  const empty: PaywallPlanLoadResult = {
    monthlyPkg: null,
    annualPkg: null,
    monthlyProduct: null,
    annualProduct: null,
    error: null,
  };

  if (!isPurchasesSupported()) {
    return {
      ...empty,
      error: {
        code: "api_key_missing",
        message: "In-app purchases are not configured on this build.",
        detail: "EXPO_PUBLIC_REVENUECAT_IOS_API_KEY missing from bundle",
      },
    };
  }

  if (!configured) {
    await initPurchases(null);
    if (!configured) {
      return {
        ...empty,
        error: {
          code: "not_configured",
          message: "Could not initialize the subscription service.",
        },
      };
    }
  }

  const mod = await getPurchasesModule();
  if (!mod) {
    return {
      ...empty,
      error: {
        code: "module_unavailable",
        message: "Subscription module unavailable on this device.",
      },
    };
  }

  let offerings: PurchasesOfferings | null = null;
  let offeringsErrorDetail: string | undefined;

  try {
    offerings = await mod.default.getOfferings();
    const resolved = offerings ? resolveCurrentOffering(offerings) : null;
    console.log("[purchases] offerings snapshot", {
      hasCurrent: Boolean(offerings?.current),
      resolvedId: resolved?.identifier ?? null,
      offeringKeys: offerings ? Object.keys(offerings.all) : [],
      packageCount: resolved?.availablePackages.length ?? 0,
    });
  } catch (error) {
    offeringsErrorDetail = formatRevenueCatError(error);
    console.error("[purchases] getOfferings failed:", error);
  }

  if (offerings) {
    const resolved = resolveCurrentOffering(offerings);
    if (resolved) {
      const founding = getFoundingPackagesFromOffering(resolved);
      if (founding.monthly || founding.annual) {
        return {
          monthlyPkg: founding.monthly,
          annualPkg: founding.annual,
          monthlyProduct: null,
          annualProduct: null,
          error: null,
        };
      }
    }
  }

  const storeProducts = await getFoundingStoreProducts();
  if (storeProducts.monthly || storeProducts.annual) {
    console.log("[purchases] StoreKit product fallback", {
      monthly: storeProducts.monthly?.identifier ?? null,
      annual: storeProducts.annual?.identifier ?? null,
    });
    return {
      monthlyPkg: null,
      annualPkg: null,
      monthlyProduct: storeProducts.monthly,
      annualProduct: storeProducts.annual,
      error: null,
    };
  }

  if (!offerings) {
    return {
      ...empty,
      error: {
        code: "offerings_fetch_failed",
        message: "Could not load subscription options.",
        detail: offeringsErrorDetail,
      },
    };
  }

  const offeringKeys = Object.keys(offerings.all);
  return {
    ...empty,
    error: {
      code: "no_offering",
      message: "Subscriptions are not available right now. Try again later.",
      detail: [
        `offerings=${offeringKeys.join(",") || "none"}`,
        `current=${offerings.current?.identifier ?? "null"}`,
        offeringsErrorDetail,
      ]
        .filter(Boolean)
        .join(" · "),
    },
  };
}

/** Resolve monthly / yearly (annual) / lifetime from current offering (RevenueCat package types). */
export function getOfferingPackagesByType(offerings: PurchasesOfferings): {
  monthly: PurchasesPackage | null;
  yearly: PurchasesPackage | null;
  lifetime: PurchasesPackage | null;
} {
  const current = resolveCurrentOffering(offerings);
  if (!current) {
    return { monthly: null, yearly: null, lifetime: null };
  }

  let monthly: PurchasesPackage | null = null;
  let yearly: PurchasesPackage | null = null;
  let lifetime: PurchasesPackage | null = null;

  for (const pkg of current.availablePackages) {
    const type = pkg.packageType;
    if (type === "MONTHLY" && !monthly) monthly = pkg;
    else if (type === "ANNUAL" && !yearly) yearly = pkg;
    else if (type === "LIFETIME" && !lifetime) lifetime = pkg;
  }

  const founding = getFoundingPackages(offerings);
  return {
    monthly: monthly ?? founding.monthly,
    yearly: yearly ?? founding.annual,
    lifetime,
  };
}

export type PaywallPresentationResult =
  | "purchased"
  | "restored"
  | "cancelled"
  | "not_presented"
  | "error";

/** Hosted RevenueCat Paywall UI is disabled because react-native-purchases-ui is not installed. */
export async function presentRevenueCatPaywall(): Promise<PaywallPresentationResult> {
  return "not_presented";
}

/** Present paywall only when `pro` entitlement is inactive. */
export async function presentRevenueCatPaywallIfNeeded(): Promise<PaywallPresentationResult> {
  return "not_presented";
}

/** RevenueCat Customer Center — manage / cancel subscription in-app. */
export async function presentCustomerCenter(): Promise<boolean> {
  return false;
}

export function formatPackagePrice(pkg: PurchasesPackage | null): string | null {
  if (!pkg) return null;
  return pkg.product.priceString;
}

export function isUserCancelledPurchase(error: unknown): boolean {
  if (
    typeof error === "object" &&
    error != null &&
    "code" in error &&
    error.code === PURCHASE_CANCELLED_ERROR_CODE
  ) {
    return true;
  }
  return false;
}

export async function purchasePackage(
  pkg: PurchasesPackage,
): Promise<CustomerInfo> {
  const mod = await getPurchasesModule();
  if (!mod) {
    throw new Error("Purchases module unavailable");
  }

  const { customerInfo } = await mod.default.purchasePackage(pkg);
  return customerInfo;
}

export async function purchaseStoreProduct(
  product: PurchasesStoreProduct,
): Promise<CustomerInfo> {
  const mod = await getPurchasesModule();
  if (!mod) {
    throw new Error("Purchases module unavailable");
  }

  const { customerInfo } = await mod.default.purchaseStoreProduct(product);
  return customerInfo;
}

export async function restorePurchases(): Promise<CustomerInfo> {
  const mod = await getPurchasesModule();
  if (!mod) {
    throw new Error("Purchases module unavailable");
  }

  return mod.default.restorePurchases();
}

export function addCustomerInfoListener(
  listener: (info: CustomerInfo) => void,
): () => void {
  if (!isPurchasesSupported()) {
    return () => {};
  }

  let removed = false;
  let nativeRemove: (() => void) | undefined;

  void getPurchasesModule()
    .then((mod) => {
      if (!mod || removed) return;

      try {
        const Purchases = mod.default;
        Purchases.addCustomerInfoUpdateListener(listener);
        nativeRemove = () => {
          Purchases.removeCustomerInfoUpdateListener(listener);
        };
      } catch (error) {
        console.error("[purchases] addCustomerInfoListener failed:", error);
      }
    })
    .catch((error) => {
      console.error("[purchases] addCustomerInfoListener load failed:", error);
    });

  return () => {
    removed = true;
    nativeRemove?.();
  };
}
