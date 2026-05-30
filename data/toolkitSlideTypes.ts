export type Slide =
  | { type: "title"; heading: string; subheading?: string }
  | { type: "concept"; heading: string; bullets: string[] }
  | {
      type: "diagram";
      heading: string;
      /** AVA asset path: `ava/<category>/<file>.png` */
      image: string;
      caption?: string;
    }
  | { type: "steps"; heading: string; steps: string[] }
  | { type: "callout"; heading: string; text: string }
  | { type: "warning"; heading: string; text: string };

export interface SlideDeck {
  id: string;
  lessonId: string;
  title: string;
  slides: Slide[];
}

export const QA_STEPS = [
  "Open every HTML lesson",
  "Verify slide deck loads",
  "Swipe through all slides",
  "Check diagram images load",
  "Check callout + warning styling",
  "Check deep linking",
  "Check no console errors",
  "Check no red screens",
  "Check performance on low-end device",
  "Check back navigation",
  "Check scroll behavior",
  "Check slideRef matches lessonId",
] as const;

/** Canonical slide deck ids grouped by Joshua's BLOCK_1..BLOCK_5 architecture */
export const SLIDE_BLOCKS = {
  BLOCK_1: [
    "slides_exposure_triangle",
    "slides_aperture_depth",
    "slides_shutter_motion",
    "slides_iso_noise",
  ],
  BLOCK_2: [
    "slides_rule_of_thirds",
    "slides_leading_lines",
    "slides_headroom_lookroom",
    "slides_vertical_composition",
  ],
  BLOCK_3: [
    "slides_three_point_lighting",
    "slides_hard_soft_light",
    "slides_color_temperature",
    "slides_cinematic_setup",
    "slides_rembrandt_lighting",
    "slides_practical_motivated",
  ],
  BLOCK_4: [
    "slides_interface_overview",
    "slides_color_wheels",
    "slides_curves",
    "slides_skin_tone_correction",
    "slides_scopes",
    "slides_node_structure",
    "slides_whip_pan",
    "slides_fairlight_basics",
    "slides_dialogue_cleanup",
  ],
  BLOCK_5: [
    "slides_instagram_reels",
    "slides_tiktok_native",
    "slides_youtube_titles_thumbs",
    "slides_hook_formula",
    "slides_hooks_convert",
    "slides_batch_shooting",
    "slides_repurposing",
    "slides_content_pillars",
  ],
} as const;

export type SlideBlockKey = keyof typeof SLIDE_BLOCKS;
export type SlideRef = (typeof SLIDE_BLOCKS)[SlideBlockKey][number];

/**
 * Maps AVA Creator Toolkit snake_case lesson ids to canonical slide deck refs.
 * Includes camera entries (BLOCK_1) plus the original 27-lesson linking map.
 */
export const LINKING_MAP: Record<string, SlideRef> = {
  camera_exposure_triangle: "slides_exposure_triangle",
  camera_aperture_depth: "slides_aperture_depth",
  camera_shutter_motion: "slides_shutter_motion",
  camera_iso_noise: "slides_iso_noise",

  lighting_three_point_lighting: "slides_three_point_lighting",
  lighting_hard_soft_light: "slides_hard_soft_light",
  lighting_color_temperature: "slides_color_temperature",
  lighting_cinematic_setup: "slides_cinematic_setup",
  lighting_rembrandt_lighting: "slides_rembrandt_lighting",
  lighting_practical_motivated: "slides_practical_motivated",

  framing_rule_of_thirds: "slides_rule_of_thirds",
  framing_leading_lines: "slides_leading_lines",
  framing_headroom_lookroom: "slides_headroom_lookroom",
  framing_vertical_composition: "slides_vertical_composition",

  editing_interface_overview: "slides_interface_overview",
  editing_color_wheels: "slides_color_wheels",
  editing_curves: "slides_curves",
  editing_skin_tone_correction: "slides_skin_tone_correction",
  editing_reading_scopes: "slides_scopes",
  editing_node_structure: "slides_node_structure",
  editing_whip_pan_transition: "slides_whip_pan",
  editing_fairlight_basics: "slides_fairlight_basics",
  editing_dialogue_cleanup: "slides_dialogue_cleanup",

  strategy_instagram_reels: "slides_instagram_reels",
  strategy_tiktok_native: "slides_tiktok_native",
  strategy_youtube_titles_thumbs: "slides_youtube_titles_thumbs",
  strategy_hook_formula: "slides_hook_formula",
  strategy_hooks_that_convert: "slides_hooks_convert",
  strategy_batch_shooting: "slides_batch_shooting",
  strategy_repurposing_content: "slides_repurposing",
  strategy_content_pillars: "slides_content_pillars",
};
