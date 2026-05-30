import { LINKING_MAP, type SlideRef } from "./toolkitSlideTypes";
import {
  AVA_DIAGRAM_MANIFEST,
  avaDiagramPathForEntry,
  avaDiagramPngPathForEntry,
} from "./avaDiagramManifest";

/** Brand-repo root for AVA diagram PNGs (sibling repo, not bundled in Vertikal-App). */
export const AVA_DIAGRAM_BRAND_ROOT =
  "alpha-visual-artists-brand/creators-toolkit/assets/ava";

/** App bundle root when PNGs are synced from the brand repo. */
export const AVA_DIAGRAM_BUNDLE_ROOT = "assets/ava";

/** Valid `ava/<category>/<file>.svg` categories for diagram slides. */
export const AVA_DIAGRAM_CATEGORIES = [
  "camera",
  "lighting",
  "framing",
  "editing",
  "strategy",
] as const;

export type AvaDiagramCategory = (typeof AVA_DIAGRAM_CATEGORIES)[number];

/** Maps canonical `.png` schema paths → bundled SVG path on disk (until PNGs ship). */
export const AVA_DIAGRAM_PNG_TO_BUNDLE: Record<string, string> = Object.fromEntries(
  AVA_DIAGRAM_MANIFEST.map((entry) => [
    avaDiagramPngPathForEntry(entry),
    avaDiagramPathForEntry(entry),
  ]),
);
AVA_DIAGRAM_PNG_TO_BUNDLE["ava/common/placeholder.png"] = "ava/common/placeholder.svg";

/** Resolve slide JSON diagram path to bundled asset key (svg/png on disk). */
export function resolveDiagramBundlePath(image: string): string {
  if (image in AVA_DIAGRAM_PNG_TO_BUNDLE) {
    return AVA_DIAGRAM_PNG_TO_BUNDLE[image];
  }
  if (image.endsWith(".svg") || image.endsWith(".png")) {
    return image;
  }
  return "ava/common/placeholder.png";
}

const AVA_DIAGRAM_PATH = /^ava\/([a-z-]+)\/([a-z0-9-]+\.(?:svg|png))$/;

export interface AvaDiagramPath {
  category: AvaDiagramCategory;
  file: string;
  brandPath: string;
  bundlePath: string;
}

/**
 * Parse and resolve `ava/<category>/<file>.svg|png` diagram paths.
 * Returns null when the path does not match the canonical convention.
 */
export function resolveAvaDiagramPath(image: string): AvaDiagramPath | null {
  const bundlePath = resolveDiagramBundlePath(image);
  const match = AVA_DIAGRAM_PATH.exec(bundlePath);
  if (!match) return null;

  const category = match[1] as AvaDiagramCategory;
  if (!(AVA_DIAGRAM_CATEGORIES as readonly string[]).includes(category)) {
    return null;
  }

  const file = match[2];
  return {
    category,
    file,
    brandPath: `${AVA_DIAGRAM_BRAND_ROOT}/${category}/${file}`,
    bundlePath: `${AVA_DIAGRAM_BUNDLE_ROOT}/${category}/${file}`,
  };
}

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

/** When slideRef kebab id differs from legacy toolkit-content htmlSlideId */
export const SLIDE_REF_HTML_SLIDE_ID: Partial<Record<SlideRef, string>> = {
  slides_depth_layers: "depth",
  slides_high_low_angle: "camera-angles",
  slides_interview_setup: "interview-setup",
};

/** Resolve slide deck ref to toolkit-content / curriculum htmlSlideId */
export function htmlSlideIdForSlideRef(slideRef: SlideRef | string): string {
  return SLIDE_REF_HTML_SLIDE_ID[slideRef as SlideRef] ?? slideRefToHtmlSlideId(slideRef);
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
  return slideRef ? htmlSlideIdForSlideRef(slideRef) : undefined;
}
