/**
 * Regenerates data/wallpaperManifest.ts from the web repo Wallpapers folder.
 *
 * Usage:
 *   npx tsx scripts/generate-wallpaper-manifest.ts
 *
 * Optional env:
 *   WALLPAPER_SOURCE_DIR — override source folder
 *   WALLPAPER_CDN_BASE — base URL baked into publicUrl fields (default alphavisualartists.com)
 */

import * as fs from "node:fs";
import * as path from "node:path";

const DEFAULT_SOURCE =
  "/Users/alphavisualartists/ALPHA VISUAL ARTISTS WEB/public/images/work/Wallpapers";
const DEFAULT_CDN = "https://alphavisualartists.com/wallpapers";

const sourceDir = process.env.WALLPAPER_SOURCE_DIR ?? DEFAULT_SOURCE;
const cdnBase = (process.env.WALLPAPER_CDN_BASE ?? DEFAULT_CDN).replace(/\/$/, "");
const outPath = path.join(process.cwd(), "data/wallpaperManifest.ts");

function main(): void {
  if (!fs.existsSync(sourceDir)) {
    console.error("[generate-wallpaper-manifest] Source dir not found:", sourceDir);
    process.exit(1);
  }

  const filenames = fs
    .readdirSync(sourceDir)
    .filter((name) => !name.startsWith("."))
    .sort((a, b) => a.localeCompare(b, "en"));

  const entries = filenames.map((filename, index) => {
    const id = `wp-${String(index + 1).padStart(3, "0")}`;
    const publicUrl = `${cdnBase}/${encodeURIComponent(filename)}`;
    return { id, filename, publicUrl };
  });

  const file = `/**
 * AVA wallpaper catalog — generated from web repo assets.
 * Regenerate: npx tsx scripts/generate-wallpaper-manifest.ts
 * Do NOT bundle images in the app; URLs point at CDN (EXPO_PUBLIC_WALLPAPER_CDN_BASE).
 */

export type WallpaperEntry = {
  id: string;
  filename: string;
  /** Default CDN URL at generation time; prefer getWallpaperPublicUrl() for runtime env. */
  publicUrl: string;
};

export const WALLPAPER_MANIFEST: WallpaperEntry[] = ${JSON.stringify(entries, null, 2)} as const;

export const WALLPAPER_COUNT = WALLPAPER_MANIFEST.length;
`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, file, "utf8");
  console.log(`[generate-wallpaper-manifest] Wrote ${entries.length} entries → ${outPath}`);
}

main();
