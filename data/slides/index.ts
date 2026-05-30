import type { SlideDeck } from "../toolkitSlideTypes";

export type { SlideDeck } from "../toolkitSlideTypes";
import l0 from "./slides_aperture_depth.json";
import l1 from "./slides_batch_shooting.json";
import l2 from "./slides_cinematic_setup.json";
import l3 from "./slides_color_temperature.json";
import l4 from "./slides_color_wheels.json";
import l5 from "./slides_content_pillars.json";
import l6 from "./slides_curves.json";
import l7 from "./slides_dialogue_cleanup.json";
import l8 from "./slides_exposure_triangle.json";
import l9 from "./slides_fairlight_basics.json";
import l10 from "./slides_hard_soft_light.json";
import l11 from "./slides_headroom_lookroom.json";
import l12 from "./slides_hook_formula.json";
import l13 from "./slides_hooks_convert.json";
import l14 from "./slides_instagram_reels.json";
import l15 from "./slides_interface_overview.json";
import l16 from "./slides_iso_noise.json";
import l17 from "./slides_leading_lines.json";
import l18 from "./slides_node_structure.json";
import l19 from "./slides_practical_motivated.json";
import l20 from "./slides_rembrandt_lighting.json";
import l21 from "./slides_repurposing.json";
import l22 from "./slides_rule_of_thirds.json";
import l23 from "./slides_scopes.json";
import l24 from "./slides_shutter_motion.json";
import l25 from "./slides_skin_tone_correction.json";
import l26 from "./slides_three_point_lighting.json";
import l27 from "./slides_tiktok_native.json";
import l28 from "./slides_vertical_composition.json";
import l29 from "./slides_whip_pan.json";
import l30 from "./slides_youtube_titles_thumbs.json";

/** Canonical lesson ids — JSON files under data/lessons/ are source of truth. */
export const SLIDE_DECK_IDS = [
  "slides_aperture_depth",
  "slides_batch_shooting",
  "slides_cinematic_setup",
  "slides_color_temperature",
  "slides_color_wheels",
  "slides_content_pillars",
  "slides_curves",
  "slides_dialogue_cleanup",
  "slides_exposure_triangle",
  "slides_fairlight_basics",
  "slides_hard_soft_light",
  "slides_headroom_lookroom",
  "slides_hook_formula",
  "slides_hooks_convert",
  "slides_instagram_reels",
  "slides_interface_overview",
  "slides_iso_noise",
  "slides_leading_lines",
  "slides_node_structure",
  "slides_practical_motivated",
  "slides_rembrandt_lighting",
  "slides_repurposing",
  "slides_rule_of_thirds",
  "slides_scopes",
  "slides_shutter_motion",
  "slides_skin_tone_correction",
  "slides_three_point_lighting",
  "slides_tiktok_native",
  "slides_vertical_composition",
  "slides_whip_pan",
  "slides_youtube_titles_thumbs",
] as const;

export type SlideDeckId = (typeof SLIDE_DECK_IDS)[number];

const SLIDE_DECK_MAP = {
  "slides_aperture_depth": l0,
  "slides_batch_shooting": l1,
  "slides_cinematic_setup": l2,
  "slides_color_temperature": l3,
  "slides_color_wheels": l4,
  "slides_content_pillars": l5,
  "slides_curves": l6,
  "slides_dialogue_cleanup": l7,
  "slides_exposure_triangle": l8,
  "slides_fairlight_basics": l9,
  "slides_hard_soft_light": l10,
  "slides_headroom_lookroom": l11,
  "slides_hook_formula": l12,
  "slides_hooks_convert": l13,
  "slides_instagram_reels": l14,
  "slides_interface_overview": l15,
  "slides_iso_noise": l16,
  "slides_leading_lines": l17,
  "slides_node_structure": l18,
  "slides_practical_motivated": l19,
  "slides_rembrandt_lighting": l20,
  "slides_repurposing": l21,
  "slides_rule_of_thirds": l22,
  "slides_scopes": l23,
  "slides_shutter_motion": l24,
  "slides_skin_tone_correction": l25,
  "slides_three_point_lighting": l26,
  "slides_tiktok_native": l27,
  "slides_vertical_composition": l28,
  "slides_whip_pan": l29,
  "slides_youtube_titles_thumbs": l30,
} as Record<SlideDeckId, SlideDeck>;

export function getSlideDeck(id: string): SlideDeck | undefined {
  return SLIDE_DECK_MAP[id as SlideDeckId];
}

export function getAllSlideDecks(): SlideDeck[] {
  return SLIDE_DECK_IDS.map((id) => SLIDE_DECK_MAP[id]);
}
