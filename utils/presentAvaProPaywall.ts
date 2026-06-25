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
 * Signed-in: routes to /pro where direct RevenueCat purchases are enabled.
 */
export async function presentAvaProPaywall(
  options: PresentAvaProPaywallOptions,
): Promise<void> {
  if (FREE_LAUNCH) return;

  if (Platform.OS !== "ios") {
    Alert.alert("AVA Pro", "Subscriptions are available on the iOS app.");
    return;
  }

  router.push("/pro" as Href);
}
