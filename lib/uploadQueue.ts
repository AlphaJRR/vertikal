/**
 * Background upload queue for event photos.
 * Persisted to AsyncStorage so uploads survive app backgrounding / hotspot drops.
 * Retries up to MAX_RETRIES with exponential back-off.
 *
 * Schema note (migration 004):
 *   event_photos rows are inserted by the process-photo edge function AFTER
 *   both original and thumbnail exist.  The queue only tracks the upload to
 *   the event-originals bucket + the edge function call.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from './supabase';
import {
  contentTypeForUpload,
  mediaKindFromFilename,
  type EventMediaKind,
} from './eventMedia';
import type { UploadQueueItem } from '../types/events';

const QUEUE_KEY     = 'ava:photo_upload_queue_v2';
const ORIGINALS     = 'event-originals';
const SUPABASE_URL  = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const MAX_RETRIES   = 3;
const RETRY_BASE_MS = 2000;
const READ_TIMEOUT_MS    = 45_000;
const UPLOAD_TIMEOUT_MS  = 120_000;
const VIDEO_UPLOAD_TIMEOUT_MS = 600_000;
const PROCESS_TIMEOUT_MS = 90_000;

export interface ProcessQueueResult {
  succeeded: number;
  failed:    number;
  lastError: string | null;
}

type UploadAttempt = { ok: true } | { ok: false; error: string };

let processingLock = false;
let processChain: Promise<ProcessQueueResult> = Promise.resolve({
  succeeded: 0,
  failed: 0,
  lastError: null,
});

function runExclusive<T>(fn: () => Promise<T>): Promise<T> {
  const run = processChain.then(fn);
  processChain = run.then(
    () => ({ succeeded: 0, failed: 0, lastError: null }),
    () => ({ succeeded: 0, failed: 0, lastError: null }),
  );
  return run;
}

function isActionable(item: UploadQueueItem): boolean {
  return item.status === 'pending'
    || item.status === 'uploading'
    || (item.status === 'failed' && item.retries < MAX_RETRIES);
}

// ─── Persistence ─────────────────────────────────────────────────────────────

async function readQueue(): Promise<UploadQueueItem[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    const parsed = raw ? (JSON.parse(raw) as UploadQueueItem[]) : [];
    return parsed.map(normalizeQueueItem);
  } catch { return []; }
}

function normalizeQueueItem(item: UploadQueueItem): UploadQueueItem {
  const mediaKind: EventMediaKind =
    item.mediaKind
    ?? mediaKindFromFilename(item.filename ?? item.localUri);
  return { ...item, mediaKind };
}

async function writeQueue(items: UploadQueueItem[]): Promise<void> {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

async function patchItem(id: string, patch: Partial<UploadQueueItem>): Promise<void> {
  const q = await readQueue();
  await writeQueue(q.map(i => (i.id === id ? { ...i, ...patch } : i)));
}

async function getFreshItem(id: string): Promise<UploadQueueItem | undefined> {
  const q = await readQueue();
  return q.find(i => i.id === id);
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const UploadQueue = {
  async enqueue(items: UploadQueueItem[]): Promise<void> {
    const current = await readQueue();
    const ids     = new Set(current.map(i => i.id));
    await writeQueue([...current, ...items.filter(i => !ids.has(i.id))]);
  },

  async getAll(): Promise<UploadQueueItem[]> {
    return readQueue();
  },

  async getPending(eventId?: string): Promise<UploadQueueItem[]> {
    const all = await readQueue();
    return all.filter(i => {
      if (eventId && i.eventId !== eventId) return false;
      return isActionable(i);
    });
  },

  getLastErrorForEvent(items: UploadQueueItem[], eventId: string): string | null {
    const failed = items
      .filter(i => i.eventId === eventId && i.lastError)
      .sort((a, b) => b.addedAt - a.addedAt);
    return failed[0]?.lastError ?? null;
  },

  /** After force-quit mid-upload, items can stay stuck in `uploading`. */
  async recoverStuck(): Promise<void> {
    const q = await readQueue();
    const next = q.map(i =>
      i.status === 'uploading' ? { ...i, status: 'pending' as const } : i,
    );
    if (next.some((item, idx) => item.status !== q[idx]?.status)) {
      await writeQueue(next);
    }
  },

  async clearFailed(eventId?: string): Promise<void> {
    const q = await readQueue();
    await writeQueue(
      q.filter(i => {
        if (i.status !== 'failed') return true;
        if (eventId && i.eventId !== eventId) return true;
        return false;
      }),
    );
  },

  /** Reset failed items so the operator can retry without re-picking photos. */
  async resetFailed(eventId?: string): Promise<void> {
    const q = await readQueue();
    await writeQueue(
      q.map(i => {
        if (i.status !== 'failed') return i;
        if (eventId && i.eventId !== eventId) return i;
        return { ...i, status: 'pending' as const, retries: 0, lastError: undefined };
      }),
    );
  },

  async clearForEvent(eventId: string): Promise<void> {
    const q = await readQueue();
    await writeQueue(q.filter(i => i.eventId !== eventId));
  },

  /**
   * Process the queue until no actionable items remain (retries each item up to
   * MAX_RETRIES in this run). Uses a module-level lock so multiple hook instances
   * don't double-upload.
   */
  async processAll(
    onProgress?: (done: number, total: number) => void,
    eventId?: string,
  ): Promise<ProcessQueueResult> {
    return runExclusive(() => processAllInner(onProgress, eventId));
  },

  async clearDone(): Promise<void> {
    const q = await readQueue();
    await writeQueue(q.filter(i => i.status !== 'done'));
  },
};

async function processAllInner(
  onProgress?: (done: number, total: number) => void,
  eventId?: string,
): Promise<ProcessQueueResult> {
  processingLock = true;
  let succeeded  = 0;
  let failed     = 0;
  let lastError: string | null = null;
  let processed  = 0;

  try {
    await UploadQueue.recoverStuck();

    while (true) {
      const pending = await UploadQueue.getPending(eventId);
      if (pending.length === 0) break;

      const item = pending[0];
      const fresh = await getFreshItem(item.id);
      if (!fresh || !isActionable(fresh)) continue;

      await patchItem(fresh.id, { status: 'uploading' });

      let attempt: UploadAttempt;
      try {
        attempt = await uploadOne(fresh);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        attempt = { ok: false, error: message };
      }
      processed++;

      if (attempt.ok) {
        await patchItem(fresh.id, { status: 'done', lastError: undefined });
        succeeded++;
      } else {
        const retries = fresh.retries + 1;
        lastError = attempt.error;
        await patchItem(fresh.id, {
          status:    retries >= MAX_RETRIES ? 'failed' : 'pending',
          retries,
          lastError: attempt.error,
        });
        if (retries >= MAX_RETRIES) failed++;
        else await sleep(RETRY_BASE_MS * 2 ** retries);
      }

      onProgress?.(processed, processed + pending.length - 1);
    }
  } finally {
    processingLock = false;
  }

  return { succeeded, failed, lastError };
}

// ─── Upload one item ──────────────────────────────────────────────────────────

async function uploadOne(item: UploadQueueItem): Promise<UploadAttempt> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { ok: false, error: 'Not signed in — sign in again and retry.' };
    }

    const fresh = normalizeQueueItem(item);
    const mediaKind = fresh.mediaKind;
    const contentType = contentTypeForUpload(fresh.filename ?? fresh.localUri, mediaKind);
    const uploadTimeout = mediaKind === 'video' ? VIDEO_UPLOAD_TIMEOUT_MS : UPLOAD_TIMEOUT_MS;

    if (mediaKind === 'video') {
      const videoAttempt = await withTimeout(
        uploadVideoToStorage(fresh.localUri, fresh.storagePath, contentType, session.access_token),
        uploadTimeout,
        'Storage upload',
      );
      if (!videoAttempt.ok) {
        console.error('[UploadQueue] video storage upload failed:', videoAttempt.error);
        return videoAttempt;
      }
    } else {
      const { bytes, contentType: resolvedType } = await withTimeout(
        readPhotoBytes(fresh.localUri, fresh.filename, mediaKind),
        READ_TIMEOUT_MS,
        'Reading photo',
      );

      const { error: uploadError } = await withTimeout(
        supabase.storage
          .from(ORIGINALS)
          .upload(fresh.storagePath, bytes, {
            contentType: resolvedType,
            upsert: true,
          }),
        uploadTimeout,
        'Storage upload',
      );

      if (uploadError) {
        console.error('[UploadQueue] storage upload failed:', uploadError.message, uploadError);
        if (uploadError.message?.includes('row-level security')) {
          return {
            ok: false,
            error: 'Storage blocked by server policy. Apply migration 011 in Supabase SQL editor, then retry.',
          };
        }
        return { ok: false, error: uploadError.message || 'Storage upload failed' };
      }
    }

    const { data: fnData, error: fnError } = await withTimeout(
      supabase.functions.invoke('process-photo', {
        body: {
          eventId:     fresh.eventId,
          storagePath: fresh.storagePath,
          filename:    fresh.filename ?? null,
          source:      'manual',
          mediaKind,
        },
      }),
      PROCESS_TIMEOUT_MS,
      'Thumbnail processing',
    );

    if (fnError) {
      console.error('[UploadQueue] process-photo failed:', fnError, fnData);
      const msg = extractFunctionError(fnData, fnError);
      if (msg.includes('404') || msg.toLowerCase().includes('not found')) {
        return {
          ok: false,
          error: 'process-photo edge function not deployed — check Supabase Edge Functions.',
        };
      }
      if (msg.toLowerCase().includes('decode')) {
        return {
          ok: false,
          error: 'Photo format not supported (try JPEG). Re-select photos and retry.',
        };
      }
      return { ok: false, error: msg };
    }

    const payload = fnData as { ok?: boolean; error?: string } | null;
    if (payload?.error) {
      console.error('[UploadQueue] process-photo error payload:', payload.error);
      return { ok: false, error: payload.error };
    }
    if (!payload?.ok) {
      console.error('[UploadQueue] process-photo bad response:', fnData);
      return { ok: false, error: 'Thumbnail processing failed — try again.' };
    }

    return { ok: true };
  } catch (err) {
    console.error('[UploadQueue] uploadOne error:', err);
    const message = err instanceof Error ? err.message : 'Upload failed';
    return { ok: false, error: message };
  }
}

async function readPhotoBytes(
  localUri: string,
  filename: string | null,
  mediaKind: EventMediaKind,
): Promise<{ bytes: ArrayBuffer; contentType: string }> {
  const contentType = contentTypeForUpload(filename ?? localUri, mediaKind);

  try {
    const info = await FileSystem.getInfoAsync(localUri);
    if (!info.exists) {
      throw new Error('Local photo missing — re-select from camera roll.');
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('re-select')) throw err;
  }

  // fetch() is faster than base64 for large camera-roll JPEGs copied to cache.
  try {
    const response = await fetch(localUri);
    if (response.ok) {
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength > 0) {
        return {
          bytes,
          contentType: response.headers.get('content-type') || contentType,
        };
      }
    }
  } catch {
    // fall through to FileSystem
  }

  try {
    const base64 = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const binary = atob(base64);
    const arr = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
    if (arr.byteLength === 0) throw new Error('Photo file is empty.');
    return { bytes: arr.buffer, contentType };
  } catch (fsErr) {
    const msg = fsErr instanceof Error ? fsErr.message : 'Could not read local photo.';
    throw new Error(msg);
  }
}

/** Stream video from disk — avoids loading multi-GB files into JS memory. */
async function uploadVideoToStorage(
  localUri: string,
  storagePath: string,
  contentType: string,
  accessToken: string,
): Promise<UploadAttempt> {
  if (!SUPABASE_URL) {
    return { ok: false, error: 'Supabase URL not configured.' };
  }

  try {
    const info = await FileSystem.getInfoAsync(localUri);
    if (!info.exists) {
      return { ok: false, error: 'Local video missing — re-select from camera roll.' };
    }
  } catch (err) {
    console.warn('[UploadQueue] video file info check failed:', err);
  }

  const url = `${SUPABASE_URL}/storage/v1/object/${ORIGINALS}/${storagePath}`;
  try {
    const result = await FileSystem.uploadAsync(url, localUri, {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': contentType,
        'x-upsert': 'true',
      },
    });

    if (result.status >= 200 && result.status < 300) {
      return { ok: true };
    }

    let detail = result.body;
    try {
      const parsed = JSON.parse(result.body) as { message?: string; error?: string };
      detail = parsed.message ?? parsed.error ?? result.body;
    } catch {
      // keep raw body
    }
    return { ok: false, error: detail || `Storage upload failed (${result.status})` };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Video upload failed';
    return { ok: false, error: message };
  }
}

function extractFunctionError(data: unknown, error: unknown): string {
  if (data && typeof data === 'object' && 'error' in data) {
    const msg = (data as { error?: string }).error;
    if (typeof msg === 'string' && msg.length > 0) return msg;
  }
  if (error instanceof Error && error.message) return error.message;
  return 'Thumbnail processing failed';
}

function withTimeout<T>(promise: PromiseLike<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`)), ms);
    }),
  ]);
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
