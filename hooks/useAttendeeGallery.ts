/**
 * Attendee gallery hook.
 *
 * Fetches event_photos via RLS (photos_attendee_read policy returns only
 * rows the attendee is explicitly assigned to — deleted_at-aware).
 * Thumbnail signed URLs come from the mint-download-url edge function.
 * Full-res signed URLs come from the same function with resolution='original'.
 *
 * Privacy guarantee: guessing another photo UUID returns 0 rows from the DB
 * AND the edge function would refuse to sign it.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { EventPhoto } from '@/types/events';

export interface GalleryItem {
  photo:        EventPhoto;
  thumbnailUrl: string | null;  // signed URL from event-previews via edge fn
}

interface UseAttendeeGalleryReturn {
  items:        GalleryItem[];
  loading:      boolean;
  error:        string | null;
  refresh:      () => Promise<void>;
  getSignedUrl: (photoId: string, resolution: 'preview' | 'original') => Promise<string | null>;
}

// In-memory cache keyed by `${photoId}:${resolution}`
const urlCache = new Map<string, { url: string; expiresAt: number }>();

export function useAttendeeGallery(): UseAttendeeGalleryReturn {
  const [items,   setItems]   = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const fetchingRef           = useRef(false);

  const getSignedUrl = useCallback(async (
    photoId:    string,
    resolution: 'preview' | 'original' = 'preview',
  ): Promise<string | null> => {
    const key    = `${photoId}:${resolution}`;
    const cached = urlCache.get(key);
    if (cached && cached.expiresAt > Date.now() + 60_000) return cached.url;

    try {
      const { data, error } = await supabase.functions.invoke('mint-download-url', {
        body: { photoId, resolution },
      });
      if (error || !data?.signedUrl) return null;
      urlCache.set(key, {
        url:       data.signedUrl as string,
        expiresAt: Date.now() + (data.expiresIn as number) * 1000,
      });
      return data.signedUrl as string;
    } catch (err) {
      console.error('[useAttendeeGallery] getSignedUrl failed:', err);
      return null;
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // RLS (photos_attendee_read) filters to assigned-only, deleted_at-aware
      const { data, error: err } = await supabase
        .from('event_photos')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (err) throw err;

      const photos = (data ?? []) as EventPhoto[];
      setItems(photos.map(p => ({ photo: p, thumbnailUrl: null })));
      setLoading(false);

      // Fetch thumbnails in batches of 6
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      const BATCH = 6;
      for (let i = 0; i < photos.length; i += BATCH) {
        const batch = photos.slice(i, i + BATCH);
        const urls  = await Promise.all(batch.map(p => getSignedUrl(p.id, 'preview')));
        setItems(prev => {
          const next = [...prev];
          batch.forEach((p, idx) => {
            const found = next.findIndex(g => g.photo.id === p.id);
            if (found >= 0) next[found] = { ...next[found], thumbnailUrl: urls[idx] };
          });
          return next;
        });
      }

      fetchingRef.current = false;
    } catch (err) {
      console.error('[useAttendeeGallery] refresh failed:', err);
      setError('Could not load your gallery.');
      setLoading(false);
    }
  }, [getSignedUrl]);

  useEffect(() => { void refresh(); }, [refresh]);

  return { items, loading, error, refresh, getSignedUrl };
}
