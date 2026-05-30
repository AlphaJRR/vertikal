import type { AvaDiagramCategory } from "./toolkitSlideLinking";
import { slideRefToHtmlSlideId } from "./toolkitSlideLinking";
import type { SlideRef } from "./toolkitSlideTypes";

/** Canonical AVA brand SVG diagram for Creator Toolkit core decks (28 total). */
export interface AvaDiagramManifestEntry {
  slideRef?: SlideRef;
  htmlSlideId?: string;
  category: AvaDiagramCategory;
  /** kebab-case filename, e.g. `exposure-triangle.svg` */
  file: string;
}

/** Joshua-confirmed 28 SVG diagrams — kebab-case filenames under `assets/ava/`. */
export const AVA_DIAGRAM_MANIFEST: AvaDiagramManifestEntry[] = [
  // CAMERA (6)
  { slideRef: "slides_exposure_triangle", htmlSlideId: "exposure-triangle", category: "camera", file: "exposure-triangle.svg" },
  { slideRef: "slides_aperture_depth", htmlSlideId: "aperture-depth", category: "camera", file: "aperture-depth.svg" },
  { slideRef: "slides_shutter_motion", htmlSlideId: "shutter-motion", category: "camera", file: "shutter-motion.svg" },
  { category: "camera", file: "white-balance.svg" },
  { category: "camera", file: "frame-rates.svg" },
  { slideRef: "slides_iso_noise", htmlSlideId: "iso-noise", category: "camera", file: "iso-noise.svg" },
  // FRAMING (6)
  { slideRef: "slides_rule_of_thirds", htmlSlideId: "rule-of-thirds", category: "framing", file: "rule-of-thirds.svg" },
  { slideRef: "slides_leading_lines", htmlSlideId: "leading-lines", category: "framing", file: "leading-lines.svg" },
  { category: "framing", file: "dutch-angle.svg" },
  { htmlSlideId: "camera-angles", category: "framing", file: "high-low-angle.svg" },
  { htmlSlideId: "depth", category: "framing", file: "depth-layers.svg" },
  { slideRef: "slides_headroom_lookroom", htmlSlideId: "headroom-lookroom", category: "framing", file: "headroom-noseroom.svg" },
  // LIGHTING (7)
  { slideRef: "slides_three_point_lighting", htmlSlideId: "three-point-lighting", category: "lighting", file: "three-point-layout.svg" },
  { slideRef: "slides_hard_soft_light", htmlSlideId: "hard-soft-light", category: "lighting", file: "hard-soft-light.svg" },
  { slideRef: "slides_rembrandt_lighting", htmlSlideId: "rembrandt-lighting", category: "lighting", file: "rembrandt-triangle.svg" },
  { category: "lighting", file: "butterfly-lighting.svg" },
  { category: "lighting", file: "split-lighting.svg" },
  { category: "lighting", file: "interview-setup.svg" },
  { category: "lighting", file: "outdoor-fill-setup.svg" },
  // EDITING (6)
  { slideRef: "slides_color_wheels", htmlSlideId: "color-wheels", category: "editing", file: "color-wheels-diagram.svg" },
  { slideRef: "slides_curves", htmlSlideId: "curves", category: "editing", file: "rgb-curves.svg" },
  { htmlSlideId: "node-workflow", category: "editing", file: "node-workflow.svg" },
  { category: "editing", file: "log-vs-graded.svg" },
  { category: "editing", file: "j-cut-l-cut.svg" },
  { slideRef: "slides_skin_tone_correction", htmlSlideId: "skin-tone-correction", category: "editing", file: "vectorscope-skin-line.svg" },
  // STRATEGY (3)
  { slideRef: "slides_hook_formula", htmlSlideId: "hook-formula", category: "strategy", file: "hook-formula.svg" },
  { slideRef: "slides_content_pillars", htmlSlideId: "content-pillars", category: "strategy", file: "content-pillars.svg" },
  { slideRef: "slides_batch_shooting", htmlSlideId: "batch-shooting", category: "strategy", file: "batch-shooting-calendar.svg" },
];

export function avaDiagramPathForEntry(entry: AvaDiagramManifestEntry): string {
  return `ava/${entry.category}/${entry.file}`;
}

/** Canonical PNG path per Joshua's schema (kebab basename + `.png`). */
export function avaDiagramPngPathForEntry(entry: AvaDiagramManifestEntry): string {
  const base = entry.file.replace(/\.svg$/, "");
  return `ava/${entry.category}/${base}.png`;
}

export function getAvaDiagramByHtmlSlideId(
  htmlSlideId: string,
): AvaDiagramManifestEntry | undefined {
  return AVA_DIAGRAM_MANIFEST.find((e) => e.htmlSlideId === htmlSlideId);
}

export function getAvaDiagramBySlideRef(
  slideRef: SlideRef,
): AvaDiagramManifestEntry | undefined {
  return AVA_DIAGRAM_MANIFEST.find((e) => e.slideRef === slideRef);
}

/** Resolve htmlSlideId from slideRef when omitted on manifest entry. */
export function manifestHtmlSlideId(entry: AvaDiagramManifestEntry): string | undefined {
  if (entry.htmlSlideId) return entry.htmlSlideId;
  if (entry.slideRef) return slideRefToHtmlSlideId(entry.slideRef);
  return undefined;
}
