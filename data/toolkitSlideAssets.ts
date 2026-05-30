import { Asset } from "expo-asset";
import {
  AVA_DIAGRAM_MANIFEST,
  avaDiagramPathForEntry,
} from "./avaDiagramManifest";

/**
 * Metro `require()` map for AVA diagram SVGs under `assets/ava/`.
 * One entry per SVG in AVA_DIAGRAM_MANIFEST (Metro requires static paths).
 */
export const AVA_DIAGRAM_ASSETS: Record<string, number> = {
  "ava/camera/exposure-triangle.svg": require("../assets/ava/camera/exposure-triangle.svg"),
  "ava/camera/aperture-depth.svg": require("../assets/ava/camera/aperture-depth.svg"),
  "ava/camera/shutter-motion.svg": require("../assets/ava/camera/shutter-motion.svg"),
  "ava/camera/white-balance.svg": require("../assets/ava/camera/white-balance.svg"),
  "ava/camera/frame-rates.svg": require("../assets/ava/camera/frame-rates.svg"),
  "ava/camera/iso-noise.svg": require("../assets/ava/camera/iso-noise.svg"),
  "ava/framing/rule-of-thirds.svg": require("../assets/ava/framing/rule-of-thirds.svg"),
  "ava/framing/leading-lines.svg": require("../assets/ava/framing/leading-lines.svg"),
  "ava/framing/dutch-angle.svg": require("../assets/ava/framing/dutch-angle.svg"),
  "ava/framing/high-low-angle.svg": require("../assets/ava/framing/high-low-angle.svg"),
  "ava/framing/depth-layers.svg": require("../assets/ava/framing/depth-layers.svg"),
  "ava/framing/headroom-noseroom.svg": require("../assets/ava/framing/headroom-noseroom.svg"),
  "ava/lighting/three-point-layout.svg": require("../assets/ava/lighting/three-point-layout.svg"),
  "ava/lighting/hard-soft-light.svg": require("../assets/ava/lighting/hard-soft-light.svg"),
  "ava/lighting/rembrandt-triangle.svg": require("../assets/ava/lighting/rembrandt-triangle.svg"),
  "ava/lighting/butterfly-lighting.svg": require("../assets/ava/lighting/butterfly-lighting.svg"),
  "ava/lighting/split-lighting.svg": require("../assets/ava/lighting/split-lighting.svg"),
  "ava/lighting/interview-setup.svg": require("../assets/ava/lighting/interview-setup.svg"),
  "ava/lighting/outdoor-fill-setup.svg": require("../assets/ava/lighting/outdoor-fill-setup.svg"),
  "ava/editing/color-wheels-diagram.svg": require("../assets/ava/editing/color-wheels-diagram.svg"),
  "ava/editing/rgb-curves.svg": require("../assets/ava/editing/rgb-curves.svg"),
  "ava/editing/node-workflow.svg": require("../assets/ava/editing/node-workflow.svg"),
  "ava/editing/log-vs-graded.svg": require("../assets/ava/editing/log-vs-graded.svg"),
  "ava/editing/j-cut-l-cut.svg": require("../assets/ava/editing/j-cut-l-cut.svg"),
  "ava/editing/vectorscope-skin-line.svg": require("../assets/ava/editing/vectorscope-skin-line.svg"),
  "ava/strategy/hook-formula.svg": require("../assets/ava/strategy/hook-formula.svg"),
  "ava/strategy/content-pillars.svg": require("../assets/ava/strategy/content-pillars.svg"),
  "ava/strategy/batch-shooting-calendar.svg": require("../assets/ava/strategy/batch-shooting-calendar.svg"),
};

const avaUriCache = new Map<string, string>();

export function isAvaDiagramAssetPath(avaPath: string): boolean {
  return avaPath in AVA_DIAGRAM_ASSETS;
}

/** Resolve `ava/<category>/<file>.svg` to a local file:// URI when bundled. */
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
