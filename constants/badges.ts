// constants/badges.ts

export const BADGE_IMAGES = {
  "founding50-gold": require("../assets/badges/badge-founding50-gold.png"),
  "network-titanium": require("../assets/badges/badge-network-titanium.png"),

  // add more as needed:
  // "investor-green": require("../assets/badges/badge-investor-green.png"),
  // "verified-blue": require("../assets/badges/badge-verified-blue_2.png"),
} as const;

export function getBadgeSource(key: string) {
  const source = (BADGE_IMAGES as any)[key] ?? BADGE_IMAGES["founding50-gold"];
  // ✅ CRITICAL DEBUG: Log badge source resolution
  if (__DEV__) {
    console.log('[getBadgeSource]', { key, found: !!(BADGE_IMAGES as any)[key], using: key || 'founding50-gold (fallback)' });
  }
  return source;
}
