/** Valid bundled HTML cheat sheet paths — no Metro requires (safe for route entry). */
export const TOOLKIT_HTML_SLIDE_PATHS = [
  "slides/camera-basics/exposure-triangle.html",
  "slides/camera-basics/iso-noise.html",
  "slides/camera-basics/shutter-motion.html",
  "slides/camera-motion/aperture-depth.html",
  "slides/camera-motion/whip-pan.html",
  "slides/camera-shooting-modes/manual-mode.html",
  "slides/camera-shooting-modes/aperture-priority.html",
  "slides/camera-shooting-modes/shutter-priority.html",
  "slides/camera-shooting-modes/picture-profiles.html",
  "slides/camera-shooting-modes/raw-vs-compressed.html",
  "slides/camera-movement/handheld.html",
  "slides/camera-movement/gimbal.html",
  "slides/camera-movement/static-locked.html",
  "slides/camera-movement/dolly-slider.html",
  "slides/camera-movement/camera-whip-pan.html",
  "slides/davinci-resolve/color-wheels.html",
  "slides/davinci-resolve/curves.html",
  "slides/davinci-resolve/custom-curves.html",
  "slides/davinci-resolve/dialogue-cleanup.html",
  "slides/davinci-resolve/fairlight-basics.html",
  "slides/davinci-resolve/interface-overview.html",
  "slides/davinci-resolve/node-structure.html",
  "slides/davinci-resolve/node-workflow.html",
  "slides/davinci-resolve/scopes.html",
  "slides/davinci-resolve/skin-tone-correction.html",
  "slides/davinci-resolve/skin-tones.html",
  "slides/davinci-resolve/vectorscope.html",
  "slides/framing-shots/camera-angles.html",
  "slides/framing-shots/headroom-lookroom.html",
  "slides/framing-shots/vertical-composition.html",
  "slides/lighting-exposure/cinematic-setup.html",
  "slides/lighting-exposure/color-temperature.html",
  "slides/lighting-exposure/hard-soft-light.html",
  "slides/lighting-exposure/interview-setup.html",
  "slides/lighting-exposure/practical-motivated.html",
  "slides/lighting-exposure/rembrandt-lighting.html",
  "slides/lighting-exposure/three-point-lighting.html",
  "slides/photography-composition/depth.html",
  "slides/photography-composition/leading-lines.html",
  "slides/photography-composition/rule-of-thirds.html",
  "slides/strategy/batch-shooting.html",
  "slides/strategy/content-pillars.html",
  "slides/strategy/hook-formula.html",
  "slides/strategy/hooks-convert.html",
  "slides/strategy/instagram-reels.html",
  "slides/strategy/repurposing.html",
  "slides/strategy/tiktok-native.html",
  "slides/strategy/youtube-titles-thumbs.html",
] as const;

export type ToolkitHtmlSlidePath = (typeof TOOLKIT_HTML_SLIDE_PATHS)[number];

const PATH_SET = new Set<string>(TOOLKIT_HTML_SLIDE_PATHS);

export function isBundledHtmlSlidePath(
  htmlPath: string,
): htmlPath is ToolkitHtmlSlidePath {
  return PATH_SET.has(htmlPath);
}
