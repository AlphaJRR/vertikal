import type { SlideDeck } from "../toolkitSlideTypes";

export type { SlideDeck } from "../toolkitSlideTypes";
import l0 from "./slides_aperture_depth.json";
import l1 from "./slides_aperture_priority.json";
import l2 from "./slides_batch_shooting.json";
import l3 from "./slides_camera_whip_pan.json";
import l4 from "./slides_cinematic_setup.json";
import l5 from "./slides_color_temperature.json";
import l6 from "./slides_color_wheels.json";
import l7 from "./slides_content_pillars.json";
import l8 from "./slides_curves.json";
import l9 from "./slides_depth_layers.json";
import l10 from "./slides_dialogue_cleanup.json";
import l11 from "./slides_dolly_slider.json";
import l12 from "./slides_exposure_triangle.json";
import l13 from "./slides_fairlight_basics.json";
import l14 from "./slides_gimbal.json";
import l15 from "./slides_handheld.json";
import l16 from "./slides_hard_soft_light.json";
import l17 from "./slides_headroom_lookroom.json";
import l18 from "./slides_high_low_angle.json";
import l19 from "./slides_hook_formula.json";
import l20 from "./slides_hooks_convert.json";
import l21 from "./slides_instagram_reels.json";
import l22 from "./slides_interface_overview.json";
import l23 from "./slides_interview_setup.json";
import l24 from "./slides_iso_noise.json";
import l25 from "./slides_leading_lines.json";
import l26 from "./slides_manual_mode.json";
import l27 from "./slides_node_structure.json";
import l28 from "./slides_picture_profiles.json";
import l29 from "./slides_practical_motivated.json";
import l30 from "./slides_raw_vs_compressed.json";
import l31 from "./slides_rembrandt_lighting.json";
import l32 from "./slides_repurposing.json";
import l33 from "./slides_rule_of_thirds.json";
import l34 from "./slides_scopes.json";
import l35 from "./slides_shutter_motion.json";
import l36 from "./slides_shutter_priority.json";
import l37 from "./slides_skin_tone_correction.json";
import l38 from "./slides_static_locked.json";
import l39 from "./slides_three_point_lighting.json";
import l40 from "./slides_tiktok_native.json";
import l41 from "./slides_vertical_composition.json";
import l42 from "./slides_whip_pan.json";
import l43 from "./slides_youtube_titles_thumbs.json";

/** Canonical slide deck ids — JSON under data/slides/ */
export const SLIDE_DECK_IDS = [
  "slides_aperture_depth",
  "slides_aperture_priority",
  "slides_batch_shooting",
  "slides_camera_whip_pan",
  "slides_cinematic_setup",
  "slides_color_temperature",
  "slides_color_wheels",
  "slides_content_pillars",
  "slides_curves",
  "slides_depth_layers",
  "slides_dialogue_cleanup",
  "slides_dolly_slider",
  "slides_exposure_triangle",
  "slides_fairlight_basics",
  "slides_gimbal",
  "slides_handheld",
  "slides_hard_soft_light",
  "slides_headroom_lookroom",
  "slides_high_low_angle",
  "slides_hook_formula",
  "slides_hooks_convert",
  "slides_instagram_reels",
  "slides_interface_overview",
  "slides_interview_setup",
  "slides_iso_noise",
  "slides_leading_lines",
  "slides_manual_mode",
  "slides_node_structure",
  "slides_picture_profiles",
  "slides_practical_motivated",
  "slides_raw_vs_compressed",
  "slides_rembrandt_lighting",
  "slides_repurposing",
  "slides_rule_of_thirds",
  "slides_scopes",
  "slides_shutter_motion",
  "slides_shutter_priority",
  "slides_skin_tone_correction",
  "slides_static_locked",
  "slides_three_point_lighting",
  "slides_tiktok_native",
  "slides_vertical_composition",
  "slides_whip_pan",
  "slides_youtube_titles_thumbs",
] as const;

export type SlideDeckId = (typeof SLIDE_DECK_IDS)[number];

const SLIDE_DECK_MAP = {
  "slides_aperture_depth": l0,
  "slides_aperture_priority": l1,
  "slides_batch_shooting": l2,
  "slides_camera_whip_pan": l3,
  "slides_cinematic_setup": l4,
  "slides_color_temperature": l5,
  "slides_color_wheels": l6,
  "slides_content_pillars": l7,
  "slides_curves": l8,
  "slides_depth_layers": l9,
  "slides_dialogue_cleanup": l10,
  "slides_dolly_slider": l11,
  "slides_exposure_triangle": l12,
  "slides_fairlight_basics": l13,
  "slides_gimbal": l14,
  "slides_handheld": l15,
  "slides_hard_soft_light": l16,
  "slides_headroom_lookroom": l17,
  "slides_high_low_angle": l18,
  "slides_hook_formula": l19,
  "slides_hooks_convert": l20,
  "slides_instagram_reels": l21,
  "slides_interface_overview": l22,
  "slides_interview_setup": l23,
  "slides_iso_noise": l24,
  "slides_leading_lines": l25,
  "slides_manual_mode": l26,
  "slides_node_structure": l27,
  "slides_picture_profiles": l28,
  "slides_practical_motivated": l29,
  "slides_raw_vs_compressed": l30,
  "slides_rembrandt_lighting": l31,
  "slides_repurposing": l32,
  "slides_rule_of_thirds": l33,
  "slides_scopes": l34,
  "slides_shutter_motion": l35,
  "slides_shutter_priority": l36,
  "slides_skin_tone_correction": l37,
  "slides_static_locked": l38,
  "slides_three_point_lighting": l39,
  "slides_tiktok_native": l40,
  "slides_vertical_composition": l41,
  "slides_whip_pan": l42,
  "slides_youtube_titles_thumbs": l43,
} as Record<SlideDeckId, SlideDeck>;

export function getSlideDeck(id: string): SlideDeck | undefined {
  return SLIDE_DECK_MAP[id as SlideDeckId];
}

export function getAllSlideDecks(): SlideDeck[] {
  return SLIDE_DECK_IDS.map((id) => SLIDE_DECK_MAP[id]);
}
