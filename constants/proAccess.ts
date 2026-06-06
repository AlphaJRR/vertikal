/**
 * AVA Pro access — single source of truth for mobile gating.
 *
 * Conversion strategy: balanced conversion — not 6, not 25.
 * Twelve foundational lessons (two per tab) give enough taste per track; Pro unlocks
 * the full Creators Toolkit (108 lessons), cheat sheets, and pro tools.
 * Invoice Builder is free; Send Quote and other pro tools remain Pro-only.
 *
 * Joshua — Supabase dashboard (mobile auth + profiles):
 * 1. Authentication → Email: enable Email provider; enable password sign-in.
 * 2. App Review demo: create user appreview@alphavisualartists.com with password in dashboard only.
 * 3. Authentication → Email Templates → OTP: optional for users who prefer email codes.
 * 4. Database → profiles: ensure table has `id` (uuid, FK auth.users), `subscription_tier` text default 'free'.
 * 5. SQL trigger on auth.users insert → insert profiles row (id, subscription_tier = 'free').
 * 6. Set subscription_tier = 'pro' on demo review account; IAP webhook when shipped (P1).
 */
import type { ToolkitMenuId } from "../components/toolkit/ToolkitNavigator";

/** Two foundational lessons per tab — fixed allow-list; do not expand via curriculum slicing. */
const FREE_LESSON_IDS_LIST = [
  "camera-iso",
  "camera-aperture",
  "framing-rule-of-thirds",
  "framing-leading-lines",
  "lighting-three-point",
  "lighting-natural-light",
  "editing-resolve-interface",
  "editing-project-setup",
  "strategy-reels",
  "strategy-tiktok",
  "production-director",
  "production-dp",
] as const;

const FREE_LESSON_IDS = new Set<string>(FREE_LESSON_IDS_LIST);

export function isLessonFree(lessonId: string): boolean {
  return FREE_LESSON_IDS.has(lessonId);
}

export function isLessonProLocked(lessonId: string): boolean {
  return !isLessonFree(lessonId);
}

export function getFreeLessonIds(): string[] {
  return [...FREE_LESSON_IDS];
}

export const FREE_LESSON_COUNT = FREE_LESSON_IDS.size;

/** All HTML cheat sheets require AVA Pro — even for free lessons. */
export function isCheatSheetProLocked(): boolean {
  return true;
}

/** Rate Calculator is free to use; Send Quote / export is Pro-only. */
export function isRateCalculatorQuoteProLocked(): boolean {
  return true;
}

/** Rate Calculator + Creator Training browse are always reachable; lessons gate inside training. */
export const FREE_TOOL_IDS: ReadonlySet<ToolkitMenuId> = new Set([
  "rate-calculator",
  "training",
  "invoice",
]);

export function isToolProLocked(toolId: ToolkitMenuId): boolean {
  return !FREE_TOOL_IDS.has(toolId);
}

export function isChecklistsProLocked(): boolean {
  return true;
}

export function isInvoiceBuilderProLocked(): boolean {
  return false;
}
