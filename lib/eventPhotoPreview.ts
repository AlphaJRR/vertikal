/**
 * Signed preview URLs for operator upload/assign grids.
 *
 * Primary path: mint-download-url edge function (transformed original, never full-res).
 * Fallback: direct storage signed URL with transform when edge fn is unavailable.
 */

import { supabase } from './supabase';

const ORIGINALS = 'event-originals';
const PREVIEWS  = 'event-previews';
const TTL_SEC   = 3600;

const PREVIEW_TRANSFORM = {
  width:   400,
  quality: 60,
  resize:  'cover' as const,
};

export async function getOperatorPreviewUrl(
  photoId: string,
  thumbPath?: string | null,
  storagePath?: string | null,
): Promise<string | null> {
  if (!photoId) return null;

  try {
    const { data, error } = await supabase.functions.invoke('mint-download-url', {
      body: { photoId, resolution: 'preview' },
    });
    if (!error && data?.signedUrl) {
      return data.signedUrl as string;
    }
    if (error) {
      console.warn('[eventPhotoPreview] mint-download-url failed:', error.message);
    }
  } catch (err) {
    console.warn('[eventPhotoPreview] mint-download-url error:', err);
  }

  const originalPath = storagePath ?? thumbPath;
  if (!originalPath) return null;

  const { data, error } = await supabase.storage
    .from(ORIGINALS)
    .createSignedUrl(originalPath, TTL_SEC, { transform: PREVIEW_TRANSFORM });

  if (!error && data?.signedUrl) {
    return data.signedUrl;
  }

  if (thumbPath && thumbPath !== storagePath) {
    const legacy = await supabase.storage
      .from(PREVIEWS)
      .createSignedUrl(thumbPath, TTL_SEC, { transform: PREVIEW_TRANSFORM });
    if (!legacy.error && legacy.data?.signedUrl) {
      return legacy.data.signedUrl;
    }
  }

  console.error('[eventPhotoPreview] storage signed URL failed:', error?.message);
  return null;
}
