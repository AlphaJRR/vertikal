/**
 * React hook that exposes the upload queue state and triggers processing
 * whenever the app comes to the foreground.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { UploadQueue } from '@/lib/uploadQueue';
import type { UploadQueueItem } from '@/types/events';

interface UseUploadQueueReturn {
  items:      UploadQueueItem[];
  pending:    number;
  uploading:  boolean;
  process:    () => Promise<void>;
  refresh:    () => Promise<void>;
}

export function useUploadQueue(): UseUploadQueueReturn {
  const [items,     setItems]     = useState<UploadQueueItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const processingRef             = useRef(false);

  const refresh = useCallback(async () => {
    const all = await UploadQueue.getAll();
    setItems(all);
  }, []);

  const process = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    setUploading(true);
    try {
      await UploadQueue.processAll(async () => {
        await refresh();
      });
      await UploadQueue.clearDone();
    } finally {
      processingRef.current = false;
      setUploading(false);
      await refresh();
    }
  }, [refresh]);

  // Process pending uploads when the app returns to foreground
  useEffect(() => {
    void refresh();

    const handleAppState = (next: AppStateStatus) => {
      if (next === 'active') {
        void process();
      }
    };

    const sub = AppState.addEventListener('change', handleAppState);
    void process(); // also kick off on mount

    return () => sub.remove();
  }, [process, refresh]);

  const pending = items.filter(i => i.status === 'pending' || i.status === 'uploading').length;

  return { items, pending, uploading, process, refresh };
}
