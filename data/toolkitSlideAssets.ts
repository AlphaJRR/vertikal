import { Asset } from "expo-asset";

/** Bundled creators-toolkit HTML slides (path → metro asset module) */
const BUNDLED_HTML_SLIDES: Record<string, number> = {
  "slides/photography-composition/depth.html": require("../assets/creators-toolkit/slides/photography-composition/depth.html"),
  "slides/photography-composition/rule-of-thirds.html": require("../assets/creators-toolkit/slides/photography-composition/rule-of-thirds.html"),
  "slides/framing-shots/camera-angles.html": require("../assets/creators-toolkit/slides/framing-shots/camera-angles.html"),
  "slides/davinci-resolve/custom-curves.html": require("../assets/creators-toolkit/slides/davinci-resolve/custom-curves.html"),
  "slides/davinci-resolve/skin-tones.html": require("../assets/creators-toolkit/slides/davinci-resolve/skin-tones.html"),
  "slides/davinci-resolve/vectorscope.html": require("../assets/creators-toolkit/slides/davinci-resolve/vectorscope.html"),
  "slides/davinci-resolve/node-workflow.html": require("../assets/creators-toolkit/slides/davinci-resolve/node-workflow.html"),
  "slides/lighting-exposure/three-point-lighting.html": require("../assets/creators-toolkit/slides/lighting-exposure/three-point-lighting.html"),
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
