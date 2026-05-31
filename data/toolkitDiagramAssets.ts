import { Asset } from "expo-asset";
import {
  AVA_DIAGRAM_MANIFEST,
  avaDiagramPathForEntry,
} from "./avaDiagramManifest";

/**
 * Metro `require()` map for AVA diagram PNGs under `assets/ava/`.
 * Kept separate from HTML slide assets so lesson detail views do not
 * load the full cheat-sheet bundle on open.
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
