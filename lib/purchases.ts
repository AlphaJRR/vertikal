import { Platform } from "react-native";
import Purchases, {
  type CustomerInfo,
  type PurchasesOfferings,
  type PurchasesPackage,
  LOG_LEVEL,
  PURCHASES_ERROR_CODE,
} from "react-native-purchases";

/** RevenueCat entitlement identifier — maps to AVA Pro access. */
export const REVENUECAT_ENTITLEMENT_PRO = "pro";

/** Founding member product IDs (Phase 2). */
export const FOUNDING_PRODUCT_IDS = {
  monthly: "ava_pro_monthly",
  annual: "ava_pro_annual",
} as const;

/** Standard pricing product IDs (Phase 3). */
export const STANDARD_PRODUCT_IDS = {
  monthly: "ava_pro_monthly_standard",
  annual: "ava_pro_annual_standard",
} as const;

let configured = false;

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

  try {
    await Purchases.logOut();
  } catch (error) {
    console.error("[purchases] logOutPurchases failed:", error);
  }
}

export async function getOfferings(): Promise<PurchasesOfferings | null> {
  if (!isPurchasesSupported()) return null;

  try {
    return await Purchases.getOfferings();
  } catch (error) {
    console.error("[purchases] getOfferings failed:", error);
    return null;
  }
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!isPurchasesSupported()) return null;

  try {
    return await Purchases.getCustomerInfo();
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

export function formatPackagePrice(pkg: PurchasesPackage | null): string | null {
  if (!pkg) return null;
  return pkg.product.priceString;
}

export function isUserCancelledPurchase(error: unknown): boolean {
  if (
    typeof error === "object" &&
    error != null &&
    "code" in error &&
    error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR
  ) {
    return true;
  }
  return false;
}

export async function purchasePackage(
  pkg: PurchasesPackage,
): Promise<CustomerInfo> {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return customerInfo;
}

export async function restorePurchases(): Promise<CustomerInfo> {
  return Purchases.restorePurchases();
}

export function addCustomerInfoListener(
  listener: (info: CustomerInfo) => void,
): () => void {
  if (!isPurchasesSupported()) {
    return () => {};
  }

  try {
    Purchases.addCustomerInfoUpdateListener(listener);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  } catch (error) {
    console.error("[purchases] addCustomerInfoListener failed:", error);
    return () => {};
  }
}
