import { Alert, Platform } from "react-native";
import { router, type Href } from "expo-router";
import { FREE_LAUNCH } from "../constants/proAccess";

export type AvaProPaywallSource = "home_modal" | "locked_content" | "account";

export interface PresentAvaProPaywallOptions {
  isSignedIn: boolean;
  source?: AvaProPaywallSource;
  onActivated?: () => void;
}

/**
 * Single entry point for AVA Pro purchase flow.
 * Pre-auth: routes to /pro so users can browse plans and pricing.
 * Signed-in: presents RevenueCat hosted paywall (purchase enabled).
 */
export async function presentAvaProPaywall(
  options: PresentAvaProPaywallOptions,
): Promise<void> {
  if (FREE_LAUNCH) return;

  if (Platform.OS !== "ios") {
    Alert.alert("AVA Pro", "Subscriptions are available on the iOS app.");
    return;
  }

  if (!options.isSignedIn) {
    router.push("/pro" as Href);
    return;
  }

  try {
    const purchases = await import("../lib/purchases");
    const result = await purchases.presentRevenueCatPaywall();
    if (result === "purchased" || result === "restored") {
      options.onActivated?.();
      Alert.alert("Welcome to AVA Pro", "Your subscription is active.");
    } else if (result === "error") {
      Alert.alert(
        "Subscriptions unavailable",
        "Could not load subscription options. Try again later.",
      );
    }
  } catch (error) {
    console.error("[presentAvaProPaywall] failed:", error);
    Alert.alert(
      "Subscriptions unavailable",
      "Could not load subscription options.",
    );
  }
}
