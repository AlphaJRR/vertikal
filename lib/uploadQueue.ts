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
import type { UploadQueueItem } from '../types/events';

const QUEUE_KEY     = 'ava:photo_upload_queue_v2';
const ORIGINALS     = 'event-originals';
const MAX_RETRIES   = 3;
const RETRY_BASE_MS = 2000;

// ─── Persistence ─────────────────────────────────────────────────────────────

async function readQueue(): Promise<UploadQueueItem[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as UploadQueueItem[]) : [];
  } catch { return []; }
}

async function writeQueue(items: UploadQueueItem[]): Promise<void> {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

async function patchItem(id: string, patch: Partial<UploadQueueItem>): Promise<void> {
  const q = await readQueue();
  await writeQueue(q.map(i => (i.id === id ? { ...i, ...patch } : i)));
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

  async getPending(): Promise<UploadQueueItem[]> {
    const all = await readQueue();
    return all.filter(i => i.status === 'pending' || (i.status === 'failed' && i.retries < MAX_RETRIES));
  },

  async processAll(onProgress?: (done: number, total: number) => void): Promise<{ succeeded: number; failed: number }> {
    const queue   = await readQueue();
    const pending = queue.filter(i => i.status === 'pending' || (i.status === 'failed' && i.retries < MAX_RETRIES));
    let succeeded = 0;
    let failed    = 0;

    for (let idx = 0; idx < pending.length; idx++) {
      const item = pending[idx];
      await patchItem(item.id, { status: 'uploading' });

      const ok = await uploadOne(item);
      if (ok) {
        await patchItem(item.id, { status: 'done' });
        succeeded++;
      } else {
        const retries = item.retries + 1;
        await patchItem(item.id, {
          status:  retries >= MAX_RETRIES ? 'failed' : 'pending',
          retries,
        });
        if (retries < MAX_RETRIES) await sleep(RETRY_BASE_MS * 2 ** retries);
        failed++;
      }
      onProgress?.(idx + 1, pending.length);
    }
    return { succeeded, failed };
  },

  async clearDone(): Promise<void> {
    const q = await readQueue();
    await writeQueue(q.filter(i => i.status !== 'done'));
  },
};

// ─── Upload one item ──────────────────────────────────────────────────────────

async function uploadOne(item: UploadQueueItem): Promise<boolean> {
  try {
    // 1. Read local file as base64
    const base64 = await FileSystem.readAsStringAsync(item.localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

    // 2. Upload to event-originals bucket
    const { error: uploadError } = await supabase.storage
      .from(ORIGINALS)
      .upload(item.storagePath, binary, { contentType: 'image/jpeg', upsert: false });

    if (uploadError) {
      console.error('[UploadQueue] storage upload failed:', uploadError);
      return false;
    }

    // 3. Invoke process-photo edge function.
    //    It generates the thumbnail → uploads to event-previews → inserts event_photos row.
    const { error: fnError } = await supabase.functions.invoke('process-photo', {
      body: {
        eventId:     item.eventId,
        storagePath: item.storagePath,
        filename:    item.filename ?? null,
        source:      'manual',
      },
    });

    if (fnError) {
      console.error('[UploadQueue] process-photo failed:', fnError);
      // Non-fatal for the queue — the original is in storage; edge fn can be retried.
      // Return true so we don't re-upload the original.
      return true;
    }

    return true;
  } catch (err) {
    console.error('[UploadQueue] uploadOne error:', err);
    return false;
  }
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
