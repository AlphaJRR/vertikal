import { WALLPAPER_MANIFEST, type WallpaperEntry } from "../data/wallpaperManifest";

/**
 * CDN base for remote wallpaper JPEGs (no app bundle).
 * Joshua must upload all files from the web repo Wallpapers folder to this path first.
 *
 * Option A (default): Cloudflare Pages / site static — https://alphavisualartists.com/wallpapers/<filename>
 * Option B: Supabase public bucket — https://dyhmyvzgqonngzjueyoq.supabase.co/storage/v1/object/public/wallpapers/<filename>
 */
export const WALLPAPER_CDN_BASE =
  (process.env.EXPO_PUBLIC_WALLPAPER_CDN_BASE ?? "https://alphavisualartists.com/wallpapers").replace(
    /\/$/,
    "",
  );

export function getWallpaperPublicUrl(filename: string): string {
  return `${WALLPAPER_CDN_BASE}/${encodeURIComponent(filename)}`;
}

/** Manifest entries with publicUrl resolved from current env CDN base. */
export function getWallpapers(): WallpaperEntry[] {
  return WALLPAPER_MANIFEST.map((entry) => ({
    ...entry,
    publicUrl: getWallpaperPublicUrl(entry.filename),
  }));
}

export {
  WALLPAPER_MANIFEST,
  WALLPAPER_COUNT,
  type WallpaperEntry,
} from "../data/wallpaperManifest";
