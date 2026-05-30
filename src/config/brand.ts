/**
 * Brand Configuration - Single Source of Truth
 * Prevents brand drift (e.g., "VERTFLIX" resurfacing)
 */

export const BRAND = {
  name: "VERTIKAL",
  short: "V",
  tagline: "CINEMA ISN'T DYING — IT'S ROTATING",
} as const;

// Runtime brand guard (dev/staging only)
export function brandGuard(text: string): void {
  if (__DEV__) {
    const bad = ["VERTFLIX", "Vertflix", "VF", "Vertflix"];
    const hit = bad.find((b) => text.includes(b));
    if (hit) {
      throw new Error(`BRAND_DRIFT: found "${hit}". Expected "${BRAND.name}".`);
    }
  }
}
