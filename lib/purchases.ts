import { Platform } from "react-native";
import type {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";

export type { CustomerInfo, PurchasesOfferings, PurchasesPackage };

/** RevenueCat entitlement identifier — maps to AVA Pro access. */
export const REVENUECAT_ENTITLEMENT_PRO = "pro";

/** Shown in UI; must match RevenueCat entitlement display name in dashboard. */
export const ENTITLEMENT_DISPLAY_NAME = "ALPHA Creators Pro";

/** AVA Pro product IDs — must match App Store Connect + RevenueCat. */
export const FOUNDING_PRODUCT_IDS = {
  monthly: "AvaCreatorPro",
  annual: "yearly",
} as const;

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

export function findPackageByProductId(
  offerings: PurchasesOfferings,
  productId: string,
): PurchasesPackage | null {
  const current = offerings.current;
  if (!current) return null;

  for (const pkg of current.availablePackages) {
    if (pkg.product.identifier === productId) {
      return pkg;
    }
  }

  return null;
}

export function getFoundingPackages(offerings: PurchasesOfferings): {
  monthly: PurchasesPackage | null;
  annual: PurchasesPackage | null;
} {
  return {
    monthly: findPackageByProductId(offerings, FOUNDING_PRODUCT_IDS.monthly),
    annual: findPackageByProductId(offerings, FOUNDING_PRODUCT_IDS.annual),
  };
}

/** Resolve monthly / yearly (annual) / lifetime from current offering (RevenueCat package types). */
export function getOfferingPackagesByType(offerings: PurchasesOfferings): {
  monthly: PurchasesPackage | null;
  yearly: PurchasesPackage | null;
  lifetime: PurchasesPackage | null;
} {
  const current = offerings.current;
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
