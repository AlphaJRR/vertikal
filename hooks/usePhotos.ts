/**
 * Hooks for event_photos (photographer-facing).
 *
 * Architecture change from v1:
 *   The DB row (event_photos) is inserted by the process-photo edge function
 *   AFTER the original is in storage and the thumbnail has been generated.
 *   This keeps thumb_path NOT NULL clean — no placeholder values needed.
 *
 * Upload flow:
 *   1. App uploads original → event-originals bucket
 *   2. App calls process-photo edge fn  {eventId, storagePath, filename}
 *   3. Edge fn generates thumb → event-previews bucket → INSERT event_photos row
 *   4. App polls / refreshes event_photos to see the new row
 */

import { useCallback, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { UploadQueue } from '@/lib/uploadQueue';
import type { EventPhoto, UploadQueueItem } from '@/types/events';

// ─── useEventPhotos ──────────────────────────────────────────────────────────

interface UseEventPhotosReturn {
  photos:  EventPhoto[];
  loading: boolean;
  error:   string | null;
  refresh: () => Promise<void>;
}

export function useEventPhotos(eventId: string): UseEventPhotosReturn {
  const [photos,  setPhotos]  = useState<EventPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('event_photos')
        .select('*')
        .eq('event_id', eventId)
        .order('uploaded_at', { ascending: false });
      if (err) throw err;
      setPhotos((data as EventPhoto[]) ?? []);
    } catch (err) {
      console.error('[useEventPhotos] fetch failed:', err);
      setError('Could not load photos.');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => { void refresh(); }, [refresh]);
  return { photos, loading, error, refresh };
}

// ─── useBatchPicker ──────────────────────────────────────────────────────────

interface UseBatchPickerReturn {
  pickAndEnqueue: () => Promise<number>;
  picking:        boolean;
}

export function useBatchPicker(
  eventId:    string,
  onEnqueued: () => void,
): UseBatchPickerReturn {
  const [picking, setPicking] = useState(false);

  const pickAndEnqueue = useCallback(async (): Promise<number> => {
    setPicking(true);
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return 0;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 1,
        exif: false,
      });

      if (result.canceled || result.assets.length === 0) return 0;

      const items: UploadQueueItem[] = result.assets.map(asset => {
        const itemId     = randomUUID();
        const storagePath = `${eventId}/${itemId}/original`;
        return {
          id:          itemId,
          eventId,
          localUri:    asset.uri,
          storagePath,
          filename:    asset.fileName ?? null,
          retries:     0,
          status:      'pending' as const,
          addedAt:     Date.now(),
        };
      });

      await UploadQueue.enqueue(items);
      onEnqueued();
      return items.length;
    } catch (err) {
      console.error('[useBatchPicker] error:', err);
      return 0;
    } finally {
      setPicking(false);
    }
  }, [eventId, onEnqueued]);

  return { pickAndEnqueue, picking };
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function randomUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
