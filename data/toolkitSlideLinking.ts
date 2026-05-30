import { LINKING_MAP, type SlideRef } from "./toolkitSlideTypes";

/**
 * Snake_case AVA lesson id → kebab-case Vertikal curriculum lesson id.
 * Only entries where the id differs from a naive snake→kebab transform are listed here.
 */
export const KNOWN_LESSON_ID_MISMATCHES: Record<string, string> = {
  framing_headroom_lookroom: "framing-headroom-nose-room",
  lighting_hard_soft_light: "lighting-hard-vs-soft",
  lighting_color_temperature: "lighting-color-temp",
  editing_interface_overview: "editing-resolve-interface",
  editing_skin_tone_correction: "editing-skin-tone",
  editing_reading_scopes: "editing-scopes",
  editing_node_structure: "editing-nodes",
  editing_whip_pan_transition: "editing-whip-pan-transition",
  editing_fairlight_basics: "editing-fairlight",
  editing_dialogue_cleanup: "editing-dialogue-cleanup",
  strategy_instagram_reels: "strategy-reels",
  strategy_tiktok_native: "strategy-tiktok",
  strategy_youtube_titles_thumbs: "strategy-youtube",
  strategy_hooks_that_convert: "strategy-hooks-that-convert",
  strategy_repurposing_content: "strategy-repurposing",
};

/** Strip `slides_` prefix and convert underscores to kebab-case for htmlSlideId / toolkit-content.json */
export function slideRefToHtmlSlideId(slideRef: SlideRef | string): string {
  return slideRef.replace(/^slides_/, "").replace(/_/g, "-");
}

/** Resolve AVA snake_case lesson id to canonical slide deck ref (e.g. slides_exposure_triangle). */
export function getSlideIdForLesson(lessonSnakeId: string): SlideRef | undefined {
  return LINKING_MAP[lessonSnakeId];
}

/** Resolve AVA snake_case lesson id to Vertikal curriculum kebab lesson id. */
export function getCurriculumLessonId(lessonSnakeId: string): string | undefined {
  if (lessonSnakeId in KNOWN_LESSON_ID_MISMATCHES) {
    return KNOWN_LESSON_ID_MISMATCHES[lessonSnakeId];
  }
  if (!(lessonSnakeId in LINKING_MAP)) {
    return undefined;
  }
  return lessonSnakeId.replace(/_/g, "-");
}

/** Resolve AVA snake_case lesson id to toolkit-content.json / htmlSlideId kebab id. */
export function getHtmlSlideIdForLesson(lessonSnakeId: string): string | undefined {
  const slideRef = getSlideIdForLesson(lessonSnakeId);
  return slideRef ? slideRefToHtmlSlideId(slideRef) : undefined;
}
