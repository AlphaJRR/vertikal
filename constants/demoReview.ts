/**
 * App Review demo account — password set in Supabase dashboard only (never in source).
 *
 * Keep "Continue as Reviewer" + demo panel until the paid IAP build is submitted and
 * App Store–approved; remove demo reviewer UI only after that (not before, not via early OTA).
 */
export const DEMO_REVIEW_EMAIL = "appreview@alphavisualartists.com";

export const SHOOT_STORAGE_KEYS = {
  pre: "ava_shoot_pre_v1",
  day: "ava_shoot_day_v1",
  post: "ava_shoot_post_v1",
} as const;

export const EDIT_STORAGE_KEY = "ava_edit_v1";
