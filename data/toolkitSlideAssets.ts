import { Asset } from "expo-asset";
import {
  AVA_DIAGRAM_MANIFEST,
  avaDiagramPathForEntry,
} from "./avaDiagramManifest";

/**
 * Metro `require()` map for AVA diagram PNGs under `assets/ava/`.
 * One entry per PNG in AVA_DIAGRAM_MANIFEST (Metro requires static paths).
 */
export const AVA_DIAGRAM_ASSETS: Record<string, number> = {
  "ava/camera/exposure_triangle.png": require("../assets/ava/camera/exposure_triangle.png"),
  "ava/camera/depth_of_field.png": require("../assets/ava/camera/depth_of_field.png"),
  "ava/camera/motion_blur.png": require("../assets/ava/camera/motion_blur.png"),
  "ava/camera/iso_noise.png": require("../assets/ava/camera/iso_noise.png"),
  "ava/framing/rule_of_thirds.png": require("../assets/ava/framing/rule_of_thirds.png"),
  "ava/framing/leading_lines.png": require("../assets/ava/framing/leading_lines.png"),
  "ava/framing/headroom_lookroom.png": require("../assets/ava/framing/headroom_lookroom.png"),
  "ava/framing/vertical_composition.png": require("../assets/ava/framing/vertical_composition.png"),
  "ava/lighting/three_point_layout.png": require("../assets/ava/lighting/three_point_layout.png"),
  "ava/lighting/hard_soft_light.png": require("../assets/ava/lighting/hard_soft_light.png"),
  "ava/lighting/color_temperature.png": require("../assets/ava/lighting/color_temperature.png"),
  "ava/lighting/cinematic_setup.png": require("../assets/ava/lighting/cinematic_setup.png"),
  "ava/lighting/rembrandt_lighting.png": require("../assets/ava/lighting/rembrandt_lighting.png"),
  "ava/lighting/practical_motivated.png": require("../assets/ava/lighting/practical_motivated.png"),
  "ava/editing/interface_overview.png": require("../assets/ava/editing/interface_overview.png"),
  "ava/editing/color_wheels.png": require("../assets/ava/editing/color_wheels.png"),
  "ava/editing/curves.png": require("../assets/ava/editing/curves.png"),
  "ava/editing/vectorscope_skin_line.png": require("../assets/ava/editing/vectorscope_skin_line.png"),
  "ava/editing/scopes.png": require("../assets/ava/editing/scopes.png"),
  "ava/editing/node_structure.png": require("../assets/ava/editing/node_structure.png"),
  "ava/editing/whip_pan.png": require("../assets/ava/editing/whip_pan.png"),
  "ava/editing/fairlight_basics.png": require("../assets/ava/editing/fairlight_basics.png"),
  "ava/editing/dialogue_cleanup.png": require("../assets/ava/editing/dialogue_cleanup.png"),
  "ava/strategy/instagram_reels.png": require("../assets/ava/strategy/instagram_reels.png"),
  "ava/strategy/tiktok_native.png": require("../assets/ava/strategy/tiktok_native.png"),
  "ava/strategy/youtube_titles_thumbs.png": require("../assets/ava/strategy/youtube_titles_thumbs.png"),
  "ava/strategy/hook_formula.png": require("../assets/ava/strategy/hook_formula.png"),
  "ava/strategy/hooks_convert.png": require("../assets/ava/strategy/hooks_convert.png"),
  "ava/strategy/batch_shooting.png": require("../assets/ava/strategy/batch_shooting.png"),
  "ava/strategy/repurposing.png": require("../assets/ava/strategy/repurposing.png"),
  "ava/strategy/content_pillars.png": require("../assets/ava/strategy/content_pillars.png"),
};

const avaUriCache = new Map<string, string>();

export function isAvaDiagramAssetPath(avaPath: string): boolean {
  return avaPath in AVA_DIAGRAM_ASSETS;
}

/** Resolve `ava/<category>/<file>.png` to a local file:// URI when bundled. */
export async function resolveAvaDiagramUri(
  avaPath: string,
): Promise<string | null> {
  const cached = avaUriCache.get(avaPath);
  if (cached) return cached;

  const moduleId = AVA_DIAGRAM_ASSETS[avaPath];
  if (moduleId == null) return null;

  const asset = Asset.fromModule(moduleId);
  await asset.downloadAsync();
  const uri = asset.localUri ?? asset.uri;
  if (uri) avaUriCache.set(avaPath, uri);
  return uri ?? null;
}

/** All canonical diagram paths (for QA / manifest checks). */
export const AVA_DIAGRAM_PATHS: string[] = AVA_DIAGRAM_MANIFEST.map(
  avaDiagramPathForEntry,
);

/** Bundled creators-toolkit HTML slides (path → metro asset module) */
const BUNDLED_HTML_SLIDES: Record<string, number> = {
  "slides/camera-basics/exposure-triangle.html": require("../assets/creators-toolkit/slides/camera-basics/exposure-triangle.html"),
  "slides/camera-basics/iso-noise.html": require("../assets/creators-toolkit/slides/camera-basics/iso-noise.html"),
  "slides/camera-basics/shutter-motion.html": require("../assets/creators-toolkit/slides/camera-basics/shutter-motion.html"),
  "slides/camera-motion/aperture-depth.html": require("../assets/creators-toolkit/slides/camera-motion/aperture-depth.html"),
  "slides/camera-motion/whip-pan.html": require("../assets/creators-toolkit/slides/camera-motion/whip-pan.html"),
  "slides/camera-shooting-modes/manual-mode.html": require("../assets/creators-toolkit/slides/camera-shooting-modes/manual-mode.html"),
  "slides/camera-shooting-modes/aperture-priority.html": require("../assets/creators-toolkit/slides/camera-shooting-modes/aperture-priority.html"),
  "slides/camera-shooting-modes/shutter-priority.html": require("../assets/creators-toolkit/slides/camera-shooting-modes/shutter-priority.html"),
  "slides/camera-shooting-modes/picture-profiles.html": require("../assets/creators-toolkit/slides/camera-shooting-modes/picture-profiles.html"),
  "slides/camera-shooting-modes/raw-vs-compressed.html": require("../assets/creators-toolkit/slides/camera-shooting-modes/raw-vs-compressed.html"),
  "slides/camera-movement/handheld.html": require("../assets/creators-toolkit/slides/camera-movement/handheld.html"),
  "slides/camera-movement/gimbal.html": require("../assets/creators-toolkit/slides/camera-movement/gimbal.html"),
  "slides/camera-movement/static-locked.html": require("../assets/creators-toolkit/slides/camera-movement/static-locked.html"),
  "slides/camera-movement/dolly-slider.html": require("../assets/creators-toolkit/slides/camera-movement/dolly-slider.html"),
  "slides/camera-movement/camera-whip-pan.html": require("../assets/creators-toolkit/slides/camera-movement/camera-whip-pan.html"),
  "slides/davinci-resolve/color-wheels.html": require("../assets/creators-toolkit/slides/davinci-resolve/color-wheels.html"),
  "slides/davinci-resolve/curves.html": require("../assets/creators-toolkit/slides/davinci-resolve/curves.html"),
  "slides/davinci-resolve/custom-curves.html": require("../assets/creators-toolkit/slides/davinci-resolve/custom-curves.html"),
  "slides/davinci-resolve/dialogue-cleanup.html": require("../assets/creators-toolkit/slides/davinci-resolve/dialogue-cleanup.html"),
  "slides/davinci-resolve/fairlight-basics.html": require("../assets/creators-toolkit/slides/davinci-resolve/fairlight-basics.html"),
  "slides/davinci-resolve/interface-overview.html": require("../assets/creators-toolkit/slides/davinci-resolve/interface-overview.html"),
  "slides/davinci-resolve/node-structure.html": require("../assets/creators-toolkit/slides/davinci-resolve/node-structure.html"),
  "slides/davinci-resolve/node-workflow.html": require("../assets/creators-toolkit/slides/davinci-resolve/node-workflow.html"),
  "slides/davinci-resolve/scopes.html": require("../assets/creators-toolkit/slides/davinci-resolve/scopes.html"),
  "slides/davinci-resolve/skin-tone-correction.html": require("../assets/creators-toolkit/slides/davinci-resolve/skin-tone-correction.html"),
  "slides/davinci-resolve/skin-tones.html": require("../assets/creators-toolkit/slides/davinci-resolve/skin-tones.html"),
  "slides/davinci-resolve/vectorscope.html": require("../assets/creators-toolkit/slides/davinci-resolve/vectorscope.html"),
  "slides/framing-shots/camera-angles.html": require("../assets/creators-toolkit/slides/framing-shots/camera-angles.html"),
  "slides/framing-shots/headroom-lookroom.html": require("../assets/creators-toolkit/slides/framing-shots/headroom-lookroom.html"),
  "slides/framing-shots/vertical-composition.html": require("../assets/creators-toolkit/slides/framing-shots/vertical-composition.html"),
  "slides/lighting-exposure/cinematic-setup.html": require("../assets/creators-toolkit/slides/lighting-exposure/cinematic-setup.html"),
  "slides/lighting-exposure/color-temperature.html": require("../assets/creators-toolkit/slides/lighting-exposure/color-temperature.html"),
  "slides/lighting-exposure/hard-soft-light.html": require("../assets/creators-toolkit/slides/lighting-exposure/hard-soft-light.html"),
  "slides/lighting-exposure/interview-setup.html": require("../assets/creators-toolkit/slides/lighting-exposure/interview-setup.html"),
  "slides/lighting-exposure/practical-motivated.html": require("../assets/creators-toolkit/slides/lighting-exposure/practical-motivated.html"),
  "slides/lighting-exposure/rembrandt-lighting.html": require("../assets/creators-toolkit/slides/lighting-exposure/rembrandt-lighting.html"),
  "slides/lighting-exposure/three-point-lighting.html": require("../assets/creators-toolkit/slides/lighting-exposure/three-point-lighting.html"),
  "slides/photography-composition/depth.html": require("../assets/creators-toolkit/slides/photography-composition/depth.html"),
  "slides/photography-composition/leading-lines.html": require("../assets/creators-toolkit/slides/photography-composition/leading-lines.html"),
  "slides/photography-composition/rule-of-thirds.html": require("../assets/creators-toolkit/slides/photography-composition/rule-of-thirds.html"),
  "slides/strategy/batch-shooting.html": require("../assets/creators-toolkit/slides/strategy/batch-shooting.html"),
  "slides/strategy/content-pillars.html": require("../assets/creators-toolkit/slides/strategy/content-pillars.html"),
  "slides/strategy/hook-formula.html": require("../assets/creators-toolkit/slides/strategy/hook-formula.html"),
  "slides/strategy/hooks-convert.html": require("../assets/creators-toolkit/slides/strategy/hooks-convert.html"),
  "slides/strategy/instagram-reels.html": require("../assets/creators-toolkit/slides/strategy/instagram-reels.html"),
  "slides/strategy/repurposing.html": require("../assets/creators-toolkit/slides/strategy/repurposing.html"),
  "slides/strategy/tiktok-native.html": require("../assets/creators-toolkit/slides/strategy/tiktok-native.html"),
  "slides/strategy/youtube-titles-thumbs.html": require("../assets/creators-toolkit/slides/strategy/youtube-titles-thumbs.html"),
};

const uriCache = new Map<string, string>();

export function isBundledHtmlSlidePath(htmlPath: string): boolean {
  return htmlPath in BUNDLED_HTML_SLIDES;
}

/** Resolve a toolkit-content htmlPath to a local file:// URI for WebView */
export async function resolveToolkitHtmlUri(htmlPath: string): Promise<string | null> {
  const cached = uriCache.get(htmlPath);
  if (cached) return cached;

  const moduleId = BUNDLED_HTML_SLIDES[htmlPath];
  if (moduleId == null) return null;

  const asset = Asset.fromModule(moduleId);
  await asset.downloadAsync();
  const uri = asset.localUri ?? asset.uri;
  if (uri) uriCache.set(htmlPath, uri);
  return uri ?? null;
}
