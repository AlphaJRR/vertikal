/**
 * Paywall surfacing — tunable delays and dismiss cooldowns.
 *
 * Home upsell: shown once per app session after HOME_PAYWALL_DELAY_MS on the Home tab.
 * If dismissed via "Maybe later", suppressed for HOME_PAYWALL_DISMISS_COOLDOWN_DAYS.
 */
export const HOME_PAYWALL_DELAY_MS = 8_000;

/** Days to wait before showing the home upsell again after "Maybe later". */
export const HOME_PAYWALL_DISMISS_COOLDOWN_DAYS = 0;

export const HOME_PAYWALL_DISMISS_COOLDOWN_MS =
  HOME_PAYWALL_DISMISS_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
