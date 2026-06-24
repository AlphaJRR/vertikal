import AsyncStorage from "@react-native-async-storage/async-storage";
import { HOME_PAYWALL_DISMISS_COOLDOWN_MS } from "../constants/paywall";

const DISMISS_KEY = "@ava/home_paywall_dismissed_at";

/** In-memory — home upsell shows at most once per cold app session. */
let shownThisSession = false;

export function markHomePaywallShownThisSession(): void {
  shownThisSession = true;
}

export function wasHomePaywallShownThisSession(): boolean {
  return shownThisSession;
}

export async function markHomePaywallDismissed(): Promise<void> {
  shownThisSession = true;
  try {
    await AsyncStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch (error) {
    console.error("[homePaywallPrefs] markHomePaywallDismissed failed:", error);
  }
}

export async function isHomePaywallInCooldown(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const dismissedAt = Number.parseInt(raw, 10);
    if (!Number.isFinite(dismissedAt)) return false;
    return Date.now() - dismissedAt < HOME_PAYWALL_DISMISS_COOLDOWN_MS;
  } catch (error) {
    console.error("[homePaywallPrefs] isHomePaywallInCooldown failed:", error);
    return false;
  }
}
