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
import { useAuth } from '@/contexts/AuthContext';
import { loadRedeemContext } from '@/lib/redeemContext';
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
  const { session } = useAuth();
  const [items,   setItems]   = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const fetchingRef           = useRef(false);
  const thumbGenRef           = useRef(0);

  const getSignedUrl = useCallback(async (
    photoId:    string,
    resolution: 'preview' | 'original' = 'preview',
  ): Promise<string | null> => {
    const key    = `${photoId}:${resolution}`;
    const cached = urlCache.get(key);
    if (cached && cached.expiresAt > Date.now() + 60_000) return cached.url;

    try {
      const { data, error: fnErr } = await supabase.functions.invoke('mint-download-url', {
        body: { photoId, resolution },
      });
      if (fnErr || !data?.signedUrl) return null;
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
    if (!session?.user) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const thumbGen = ++thumbGenRef.current;

    try {
      const ctx = await loadRedeemContext();

      let query = supabase
        .from('event_photos')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (ctx?.eventId) {
        query = query.eq('event_id', ctx.eventId);
      }

      const { data, error: err } = await query;
      if (err) throw err;

      const photos = (data ?? []) as EventPhoto[];
      setItems(photos.map(p => ({ photo: p, thumbnailUrl: null })));
      setLoading(false);

      if (photos.length === 0) return;

      const BATCH = 6;
      for (let i = 0; i < photos.length; i += BATCH) {
        if (thumbGen !== thumbGenRef.current) return;
        const batch = photos.slice(i, i + BATCH);
        const urls  = await Promise.all(batch.map(p => getSignedUrl(p.id, 'preview')));
        if (thumbGen !== thumbGenRef.current) return;
        setItems(prev => {
          const next = [...prev];
          batch.forEach((p, idx) => {
            const found = next.findIndex(g => g.photo.id === p.id);
            if (found >= 0) next[found] = { ...next[found], thumbnailUrl: urls[idx] };
          });
          return next;
        });
      }
    } catch (err) {
      console.error('[useAttendeeGallery] refresh failed:', err);
      setError('Could not load your gallery.');
      setLoading(false);
    }
  }, [getSignedUrl, session?.user]);

  useEffect(() => { void refresh(); }, [refresh]);

  return { items, loading, error, refresh, getSignedUrl };
}
