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

import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { UploadQueue } from '@/lib/uploadQueue';
import {
  cacheExtension,
  defaultFilename,
  mediaKindFromFilename,
  type EventMediaKind,
} from '@/lib/eventMedia';
import type { EventPhoto, UploadQueueItem } from '@/types/events';

// ─── useEventPhotos ──────────────────────────────────────────────────────────

interface UseEventPhotosReturn {
  photos:  EventPhoto[];
  loading: boolean;
  error:   string | null;
  refresh: () => Promise<void>;
}

export function useEventPhotos(
  eventId: string,
  options?: { realtime?: boolean; hasPendingUploads?: boolean },
): UseEventPhotosReturn {
  const [photos,  setPhotos]  = useState<EventPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const realtime = options?.realtime ?? true;
  const hasPendingUploads = options?.hasPendingUploads ?? false;

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

  useEffect(() => {
    if (!eventId || !realtime) return;

    const channel = supabase
      .channel(`event-photos:${eventId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'event_photos',
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const row = payload.new as EventPhoto;
          setPhotos(prev => {
            if (prev.some(p => p.id === row.id)) return prev;
            return [row, ...prev];
          });
        },
      )
      .on(
        'postgres_changes',
        {
          event:  '*',
          schema: 'public',
          table:  'event_photos',
          filter: `event_id=eq.${eventId}`,
        },
        () => { void refresh(); },
      )
      .subscribe();

    const appSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refresh();
    });

    return () => {
      void supabase.removeChannel(channel);
      appSub.remove();
    };
  }, [eventId, realtime, refresh]);

  // Poll only while uploads are processing — saves battery
  useEffect(() => {
    if (!hasPendingUploads) {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }
    pollRef.current = setInterval(() => { void refresh(); }, 4000);
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [hasPendingUploads, refresh]);

  return { photos, loading, error, refresh };
}

// ─── useBatchPicker ──────────────────────────────────────────────────────────

type PickerMode = 'photo' | 'video';

interface UseBatchPickerReturn {
  pickPhotos: () => Promise<number>;
  pickVideos: () => Promise<number>;
  picking:    boolean;
}

export function useBatchPicker(
  eventId:    string,
  onEnqueued: () => void,
): UseBatchPickerReturn {
  const [picking, setPicking] = useState(false);

  const pickAndEnqueue = useCallback(async (mode: PickerMode): Promise<number> => {
    setPicking(true);
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          'Permission needed',
          'Allow photo library access to upload event media.',
        );
        return 0;
      }

      const result = await ImagePicker.launchImageLibraryAsync(
        pickerOptionsForMode(mode),
      );

      if (result.canceled || result.assets.length === 0) return 0;

      const items: UploadQueueItem[] = [];
      for (const asset of result.assets) {
        try {
          const itemId      = randomUUID();
          const storagePath = `${eventId}/${itemId}/original`;
          const mediaKind: EventMediaKind = mode === 'video'
            ? 'video'
            : mediaKindFromFilename(asset.fileName ?? asset.uri);
          const filename =
            asset.fileName?.replace(/\.heic$/i, '.jpg')
            ?? defaultFilename(mediaKind, itemId);
          const localUri = await persistPickerUri(asset.uri, itemId, mediaKind);
          items.push({
            id:          itemId,
            eventId,
            localUri,
            storagePath,
            filename,
            mediaKind,
            retries:     0,
            status:      'pending' as const,
            addedAt:     Date.now(),
          });
        } catch (assetErr) {
          console.error('[useBatchPicker] asset persist failed:', assetErr);
        }
      }

      if (items.length === 0) {
        Alert.alert(
          'Could not add media',
          'Selected files could not be prepared for upload. Try again or pick fewer items.',
        );
        return 0;
      }

      await UploadQueue.enqueue(items);
      onEnqueued();
      return items.length;
    } catch (err) {
      console.error('[useBatchPicker] error:', err);
      const message = err instanceof Error ? err.message : 'Could not open photo library.';
      Alert.alert('Upload failed', message);
      return 0;
    } finally {
      setPicking(false);
    }
  }, [eventId, onEnqueued]);

  const pickPhotos = useCallback(() => pickAndEnqueue('photo'), [pickAndEnqueue]);
  const pickVideos = useCallback(() => pickAndEnqueue('video'), [pickAndEnqueue]);

  return { pickPhotos, pickVideos, picking };
}

/** iOS crashes when multi-select mixes images + videos — use separate pickers. */
function pickerOptionsForMode(mode: PickerMode): ImagePicker.ImagePickerOptions {
  const iosAssetMode = Platform.OS === 'ios'
    ? {
        preferredAssetRepresentationMode:
          ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Current,
      }
    : {};

  if (mode === 'video') {
    return {
      mediaTypes: ['videos'],
      allowsMultipleSelection: true,
      exif: false,
      videoExportPreset: ImagePicker.VideoExportPreset.Passthrough,
      ...iosAssetMode,
    };
  }

  return {
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    quality: 0.92,
    exif: false,
    ...iosAssetMode,
  };
}

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Camera-roll URIs expire after app kill — copy into cache first. */
async function persistPickerUri(
  uri: string,
  itemId: string,
  mediaKind: EventMediaKind,
): Promise<string> {
  const cacheDir = FileSystem.cacheDirectory;
  if (!cacheDir) return uri;

  const ext = cacheExtension(uri, mediaKind);
  const dest  = `${cacheDir}ava-upload-${itemId}.${ext}`;

  try {
    await FileSystem.copyAsync({ from: uri, to: dest });
    return dest;
  } catch (err) {
    console.warn('[useBatchPicker] cache copy failed, using picker uri:', err);
    return uri;
  }
}

function randomUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
