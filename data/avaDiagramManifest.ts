import type { AvaDiagramCategory } from "./toolkitSlideLinking";
import { slideRefToHtmlSlideId } from "./toolkitSlideLinking";
import type { SlideRef } from "./toolkitSlideTypes";

/** Canonical diagram PNG for each BLOCK_1–5 slide deck. */
export interface AvaDiagramManifestEntry {
  slideRef: SlideRef;
  htmlSlideId: string;
  category: AvaDiagramCategory;
  /** snake_case filename, e.g. `exposure_triangle.png` */
  file: string;
  /** Short subject for image generation / QA (no text in asset). */
  subject: string;
}

/** Joshua-confirmed diagram filenames (override default slideRef → file naming). */
const DIAGRAM_FILE_OVERRIDES: Partial<Record<SlideRef, string>> = {
  slides_aperture_depth: "depth_of_field.png",
  slides_shutter_motion: "motion_blur.png",
  slides_three_point_lighting: "three_point_layout.png",
  slides_skin_tone_correction: "vectorscope_skin_line.png",
};

function slideRefToDiagramFile(slideRef: SlideRef): string {
  return (
    DIAGRAM_FILE_OVERRIDES[slideRef] ??
    `${slideRef.replace(/^slides_/, "")}.png`
  );
}

/** 31 canonical BLOCK decks (release notes cite 28 core; BLOCK map includes camera + full strategy). */
export const AVA_DIAGRAM_MANIFEST: AvaDiagramManifestEntry[] = [
  // BLOCK_1 — camera
  {
    slideRef: "slides_exposure_triangle",
    htmlSlideId: slideRefToHtmlSlideId("slides_exposure_triangle"),
    category: "camera",
    file: slideRefToDiagramFile("slides_exposure_triangle"),
    subject: "Exposure triangle — aperture, shutter, ISO nodes",
  },
  {
    slideRef: "slides_aperture_depth",
    htmlSlideId: slideRefToHtmlSlideId("slides_aperture_depth"),
    category: "camera",
    file: slideRefToDiagramFile("slides_aperture_depth"),
    subject: "Depth of field — shallow vs deep comparison",
  },
  {
    slideRef: "slides_shutter_motion",
    htmlSlideId: slideRefToHtmlSlideId("slides_shutter_motion"),
    category: "camera",
    file: slideRefToDiagramFile("slides_shutter_motion"),
    subject: "Motion blur levels vs shutter speed",
  },
  {
    slideRef: "slides_iso_noise",
    htmlSlideId: slideRefToHtmlSlideId("slides_iso_noise"),
    category: "camera",
    file: slideRefToDiagramFile("slides_iso_noise"),
    subject: "ISO noise — clean vs grainy comparison",
  },
  // BLOCK_2 — framing
  {
    slideRef: "slides_rule_of_thirds",
    htmlSlideId: slideRefToHtmlSlideId("slides_rule_of_thirds"),
    category: "framing",
    file: slideRefToDiagramFile("slides_rule_of_thirds"),
    subject: "Rule of thirds grid on frame",
  },
  {
    slideRef: "slides_leading_lines",
    htmlSlideId: slideRefToHtmlSlideId("slides_leading_lines"),
    category: "framing",
    file: slideRefToDiagramFile("slides_leading_lines"),
    subject: "Leading lines toward subject",
  },
  {
    slideRef: "slides_headroom_lookroom",
    htmlSlideId: slideRefToHtmlSlideId("slides_headroom_lookroom"),
    category: "framing",
    file: slideRefToDiagramFile("slides_headroom_lookroom"),
    subject: "Headroom and nose / look room",
  },
  {
    slideRef: "slides_vertical_composition",
    htmlSlideId: slideRefToHtmlSlideId("slides_vertical_composition"),
    category: "framing",
    file: slideRefToDiagramFile("slides_vertical_composition"),
    subject: "Vertical 9:16 composition safe zones",
  },
  // BLOCK_3 — lighting
  {
    slideRef: "slides_three_point_lighting",
    htmlSlideId: slideRefToHtmlSlideId("slides_three_point_lighting"),
    category: "lighting",
    file: slideRefToDiagramFile("slides_three_point_lighting"),
    subject: "Three-point lighting layout — key, fill, back",
  },
  {
    slideRef: "slides_hard_soft_light",
    htmlSlideId: slideRefToHtmlSlideId("slides_hard_soft_light"),
    category: "lighting",
    file: slideRefToDiagramFile("slides_hard_soft_light"),
    subject: "Hard vs soft light shadow comparison",
  },
  {
    slideRef: "slides_color_temperature",
    htmlSlideId: slideRefToHtmlSlideId("slides_color_temperature"),
    category: "lighting",
    file: slideRefToDiagramFile("slides_color_temperature"),
    subject: "Color temperature warm-to-cool scale",
  },
  {
    slideRef: "slides_cinematic_setup",
    htmlSlideId: slideRefToHtmlSlideId("slides_cinematic_setup"),
    category: "lighting",
    file: slideRefToDiagramFile("slides_cinematic_setup"),
    subject: "Cinematic mood lighting setup",
  },
  {
    slideRef: "slides_rembrandt_lighting",
    htmlSlideId: slideRefToHtmlSlideId("slides_rembrandt_lighting"),
    category: "lighting",
    file: slideRefToDiagramFile("slides_rembrandt_lighting"),
    subject: "Rembrandt triangle on portrait",
  },
  {
    slideRef: "slides_practical_motivated",
    htmlSlideId: slideRefToHtmlSlideId("slides_practical_motivated"),
    category: "lighting",
    file: slideRefToDiagramFile("slides_practical_motivated"),
    subject: "Practical motivated lighting in scene",
  },
  // BLOCK_4 — editing
  {
    slideRef: "slides_interface_overview",
    htmlSlideId: slideRefToHtmlSlideId("slides_interface_overview"),
    category: "editing",
    file: slideRefToDiagramFile("slides_interface_overview"),
    subject: "Resolve page workflow overview",
  },
  {
    slideRef: "slides_color_wheels",
    htmlSlideId: slideRefToHtmlSlideId("slides_color_wheels"),
    category: "editing",
    file: slideRefToDiagramFile("slides_color_wheels"),
    subject: "Lift / gamma / gain color wheels",
  },
  {
    slideRef: "slides_curves",
    htmlSlideId: slideRefToHtmlSlideId("slides_curves"),
    category: "editing",
    file: slideRefToDiagramFile("slides_curves"),
    subject: "Luma and RGB curves",
  },
  {
    slideRef: "slides_skin_tone_correction",
    htmlSlideId: slideRefToHtmlSlideId("slides_skin_tone_correction"),
    category: "editing",
    file: slideRefToDiagramFile("slides_skin_tone_correction"),
    subject: "Vectorscope skin tone line",
  },
  {
    slideRef: "slides_scopes",
    htmlSlideId: slideRefToHtmlSlideId("slides_scopes"),
    category: "editing",
    file: slideRefToDiagramFile("slides_scopes"),
    subject: "Waveform and vectorscope pair",
  },
  {
    slideRef: "slides_node_structure",
    htmlSlideId: slideRefToHtmlSlideId("slides_node_structure"),
    category: "editing",
    file: slideRefToDiagramFile("slides_node_structure"),
    subject: "Serial / parallel node tree",
  },
  {
    slideRef: "slides_whip_pan",
    htmlSlideId: slideRefToHtmlSlideId("slides_whip_pan"),
    category: "editing",
    file: slideRefToDiagramFile("slides_whip_pan"),
    subject: "Whip pan transition blur",
  },
  {
    slideRef: "slides_fairlight_basics",
    htmlSlideId: slideRefToHtmlSlideId("slides_fairlight_basics"),
    category: "editing",
    file: slideRefToDiagramFile("slides_fairlight_basics"),
    subject: "Fairlight EQ and compression levels",
  },
  {
    slideRef: "slides_dialogue_cleanup",
    htmlSlideId: slideRefToHtmlSlideId("slides_dialogue_cleanup"),
    category: "editing",
    file: slideRefToDiagramFile("slides_dialogue_cleanup"),
    subject: "Dialogue noise reduction waveform",
  },
  // BLOCK_5 — strategy
  {
    slideRef: "slides_instagram_reels",
    htmlSlideId: slideRefToHtmlSlideId("slides_instagram_reels"),
    category: "strategy",
    file: slideRefToDiagramFile("slides_instagram_reels"),
    subject: "Instagram Reels safe zones",
  },
  {
    slideRef: "slides_tiktok_native",
    htmlSlideId: slideRefToHtmlSlideId("slides_tiktok_native"),
    category: "strategy",
    file: slideRefToDiagramFile("slides_tiktok_native"),
    subject: "TikTok loop retention",
  },
  {
    slideRef: "slides_youtube_titles_thumbs",
    htmlSlideId: slideRefToHtmlSlideId("slides_youtube_titles_thumbs"),
    category: "strategy",
    file: slideRefToDiagramFile("slides_youtube_titles_thumbs"),
    subject: "YouTube thumbnail and title layout",
  },
  {
    slideRef: "slides_hook_formula",
    htmlSlideId: slideRefToHtmlSlideId("slides_hook_formula"),
    category: "strategy",
    file: slideRefToDiagramFile("slides_hook_formula"),
    subject: "Hook formula timeline — payoff first",
  },
  {
    slideRef: "slides_hooks_convert",
    htmlSlideId: slideRefToHtmlSlideId("slides_hooks_convert"),
    category: "strategy",
    file: slideRefToDiagramFile("slides_hooks_convert"),
    subject: "Hooks that convert funnel",
  },
  {
    slideRef: "slides_batch_shooting",
    htmlSlideId: slideRefToHtmlSlideId("slides_batch_shooting"),
    category: "strategy",
    file: slideRefToDiagramFile("slides_batch_shooting"),
    subject: "Batch shooting calendar grid",
  },
  {
    slideRef: "slides_repurposing",
    htmlSlideId: slideRefToHtmlSlideId("slides_repurposing"),
    category: "strategy",
    file: slideRefToDiagramFile("slides_repurposing"),
    subject: "Content repurposing hub",
  },
  {
    slideRef: "slides_content_pillars",
    htmlSlideId: slideRefToHtmlSlideId("slides_content_pillars"),
    category: "strategy",
    file: slideRefToDiagramFile("slides_content_pillars"),
    subject: "Content pillars foundation",
  },
];

export function avaDiagramPathForEntry(entry: AvaDiagramManifestEntry): string {
  return `ava/${entry.category}/${entry.file}`;
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
