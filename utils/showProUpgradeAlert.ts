import { FREE_LAUNCH } from "../constants/proAccess";
import { presentAvaProPaywall } from "./presentAvaProPaywall";

type UpgradeContext = "lesson" | "tool" | "feature";

/**
 * Intercept locked-content taps — opens RevenueCat paywall via presentAvaProPaywall.
 */
export function showProUpgradeAlert(
  isSignedIn: boolean,
  _context: UpgradeContext = "tool",
  onActivated?: () => void,
): void {
  if (FREE_LAUNCH) return;
  void presentAvaProPaywall({
    isSignedIn,
    source: "locked_content",
    onActivated,
  });
}
