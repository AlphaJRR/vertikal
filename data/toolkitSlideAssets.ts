import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

const TOOLKIT_CSS_MODULE = require("../assets/creators-toolkit/css/ava-toolkit.css");

export {
  AVA_DIAGRAM_ASSETS,
  AVA_DIAGRAM_PATHS,
  isAvaDiagramAssetPath,
  resolveAvaDiagramUri,
} from "./toolkitDiagramAssets";

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
const htmlCache = new Map<string, string>();

async function readBundledAssetText(moduleId: number): Promise<string | null> {
  const asset = Asset.fromModule(moduleId);
  await asset.downloadAsync();
  const uri = asset.localUri ?? asset.uri;
  if (!uri) return null;
  return FileSystem.readAsStringAsync(uri);
}

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

/** Inline CSS into bundled HTML for stable WebView rendering on iOS 26. */
export async function resolveToolkitSlideHtml(htmlPath: string): Promise<string | null> {
  const cached = htmlCache.get(htmlPath);
  if (cached) return cached;

  const moduleId = BUNDLED_HTML_SLIDES[htmlPath];
  if (moduleId == null) return null;

  const [html, css] = await Promise.all([
    readBundledAssetText(moduleId),
    readBundledAssetText(TOOLKIT_CSS_MODULE),
  ]);
  if (!html || !css) return null;

  const document = html.replace(
    /<link[^>]*href="[^"]*ava-toolkit\.css"[^>]*>/i,
    `<style>${css}</style>`,
  );
  htmlCache.set(htmlPath, document);
  return document;
}
