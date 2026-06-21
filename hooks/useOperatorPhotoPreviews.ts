/**
 * Batch-load signed thumbnail URLs for operator photo grids.
 * Re-signs when photos list changes or app returns to foreground.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { batchSignOperatorPreviews } from '@/lib/eventPhotoPreview';
import type { EventPhoto } from '@/types/events';

interface UseOperatorPhotoPreviewsReturn {
  previewUrls: Map<string, string>;
  loading:     boolean;
  refresh:     () => Promise<void>;
}

export function useOperatorPhotoPreviews(photos: EventPhoto[]): UseOperatorPhotoPreviewsReturn {
  const [previewUrls, setPreviewUrls] = useState<Map<string, string>>(new Map());
  const [loading, setLoading]         = useState(false);
  const signingRef                    = useRef(false);
  const photosRef                     = useRef(photos);
  photosRef.current                   = photos;

  const photoKey = photos.map(p => `${p.id}:${p.thumb_path ?? ''}`).join('|');

  const refresh = useCallback(async () => {
    const list = photosRef.current;
    if (list.length === 0) {
      setPreviewUrls(new Map());
      return;
    }
    if (signingRef.current) return;
    signingRef.current = true;
    setLoading(true);
    try {
      const urls = await batchSignOperatorPreviews(list);
      setPreviewUrls(urls);
    } catch (err) {
      console.error('[useOperatorPhotoPreviews] batch sign failed:', err);
    } finally {
      signingRef.current = false;
      setLoading(false);
    }
  }, [photoKey]);

  useEffect(() => {
    void refresh();
  }, [photoKey, refresh]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  return { previewUrls, loading, refresh };
}
