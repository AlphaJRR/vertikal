/**
 * Signed preview URLs for operator upload/assign grids.
 *
 * Private buckets (event-previews / event-originals) require /object/sign/ URLs.
 * Primary path: batch createSignedUrls on event-previews (thumb_path).
 * Fallback: per-photo edge fn or originals bucket.
 */

import { supabase } from './supabase';
import type { EventPhoto } from '@/types/events';

const ORIGINALS = 'event-originals';
const PREVIEWS  = 'event-previews';
const TTL_SEC   = 3600;

const PREVIEW_TRANSFORM = {
  width:   400,
  quality: 60,
  resize:  'cover' as const,
};

type SignRow = { path: string; signedUrl: string; error: string | null };

/** Batch-sign thumb paths — one round trip for the whole grid. */
export async function batchSignOperatorPreviews(
  photos: EventPhoto[],
): Promise<Map<string, string>> {
  const urls = new Map<string, string>();
  if (photos.length === 0) return urls;

  const byThumb = new Map<string, EventPhoto[]>();
  for (const photo of photos) {
    const path = photo.thumb_path?.trim();
    if (!path) continue;
    const list = byThumb.get(path) ?? [];
    list.push(photo);
    byThumb.set(path, list);
  }

  const thumbPaths = [...byThumb.keys()];
  if (thumbPaths.length > 0) {
    const { data, error } = await supabase.storage
      .from(PREVIEWS)
      .createSignedUrls(thumbPaths, TTL_SEC);

    if (error) {
      console.warn('[eventPhotoPreview] batch previews sign failed:', error.message);
    } else {
      applySignRows(data as SignRow[] | null, byThumb, urls);
    }
  }

  const missing = photos.filter(p => !urls.has(p.id));
  if (missing.length === 0) return urls;

  const byStorage = new Map<string, EventPhoto[]>();
  for (const photo of missing) {
    const path = photo.storage_path?.trim();
    if (!path) continue;
    const list = byStorage.get(path) ?? [];
    list.push(photo);
    byStorage.set(path, list);
  }

  const storagePaths = [...byStorage.keys()];
  if (storagePaths.length > 0) {
    const { data, error } = await supabase.storage
      .from(PREVIEWS)
      .createSignedUrls(storagePaths, TTL_SEC);

    if (!error) {
      applySignRows(data as SignRow[] | null, byStorage, urls);
    }
  }

  for (const photo of photos) {
    if (urls.has(photo.id)) continue;
    const url = await getOperatorPreviewUrl(photo.id, photo.thumb_path, photo.storage_path);
    if (url) urls.set(photo.id, url);
  }

  return urls;
}

function applySignRows(
  rows: SignRow[] | null,
  pathToPhotos: Map<string, EventPhoto[]>,
  urls: Map<string, string>,
): void {
  if (!rows) return;
  for (const row of rows) {
    if (row.error || !row.signedUrl) continue;
    const matches = pathToPhotos.get(row.path);
    if (!matches) continue;
    for (const photo of matches) {
      urls.set(photo.id, row.signedUrl);
    }
  }
}

export async function getOperatorPreviewUrl(
  photoId: string,
  thumbPath?: string | null,
  storagePath?: string | null,
): Promise<string | null> {
  if (!photoId) return null;

  const pathsToTry = [
    { bucket: PREVIEWS, path: thumbPath },
    { bucket: PREVIEWS, path: storagePath },
    { bucket: ORIGINALS, path: thumbPath, transform: true },
    { bucket: ORIGINALS, path: storagePath, transform: true },
  ] as const;

  for (const attempt of pathsToTry) {
    if (!attempt.path?.trim()) continue;
    const url = await signOne(attempt.bucket, attempt.path, 'transform' in attempt);
    if (url) return url;
  }

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

  return null;
}

async function signOne(
  bucket: string,
  path: string,
  withTransform: boolean,
): Promise<string | null> {
  if (withTransform) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, TTL_SEC, { transform: PREVIEW_TRANSFORM });
    if (!error && data?.signedUrl) return data.signedUrl;
  }

  const plain = await supabase.storage.from(bucket).createSignedUrl(path, TTL_SEC);
  if (!plain.error && plain.data?.signedUrl) return plain.data.signedUrl;

  return null;
}
