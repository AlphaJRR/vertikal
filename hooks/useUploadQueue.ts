/**
 * React hook that exposes the upload queue state and triggers processing
 * whenever the app comes to the foreground.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { UploadQueue } from '@/lib/uploadQueue';
import type { UploadQueueItem } from '@/types/events';

interface UseUploadQueueReturn {
  items:       UploadQueueItem[];
  pending:     number;
  failed:      number;
  uploading:   boolean;
  lastError:   string | null;
  process:     (eventId?: string) => Promise<void>;
  refresh:     () => Promise<void>;
  clearFailed: (eventId?: string) => Promise<void>;
  resetFailed: (eventId?: string) => Promise<void>;
  clearForEvent: (eventId: string) => Promise<void>;
}

export function useUploadQueue(eventId?: string): UseUploadQueueReturn {
  const [items,     setItems]     = useState<UploadQueueItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const mountedRef                = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const refresh = useCallback(async () => {
    const all = await UploadQueue.getAll();
    if (!mountedRef.current) return;
    setItems(all);
    if (eventId) {
      setLastError(UploadQueue.getLastErrorForEvent(all, eventId));
    }
  }, [eventId]);

  const process = useCallback(async (scopeEventId?: string) => {
    setUploading(true);
    try {
      const result = await UploadQueue.processAll(async () => {
        await refresh();
      }, scopeEventId ?? eventId);

      if (mountedRef.current && result.lastError) {
        setLastError(result.lastError);
      }

      await UploadQueue.clearDone();
    } finally {
      if (mountedRef.current) setUploading(false);
      await refresh();
    }
  }, [eventId, refresh]);

  const clearFailed = useCallback(async (scopeEventId?: string) => {
    await UploadQueue.clearFailed(scopeEventId ?? eventId);
    if (mountedRef.current) setLastError(null);
    await refresh();
  }, [eventId, refresh]);

  const resetFailed = useCallback(async (scopeEventId?: string) => {
    await UploadQueue.resetFailed(scopeEventId ?? eventId);
    if (mountedRef.current) setLastError(null);
    await refresh();
  }, [eventId, refresh]);

  const clearForEvent = useCallback(async (scopeEventId: string) => {
    await UploadQueue.clearForEvent(scopeEventId);
    if (mountedRef.current) setLastError(null);
    await refresh();
  }, [refresh]);

  useEffect(() => {
    void (async () => {
      await UploadQueue.recoverStuck();
      await refresh();
      await process(eventId);
    })();

    const handleAppState = (next: AppStateStatus) => {
      if (next === 'active') {
        void process(eventId);
      }
    };

    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  }, [process, refresh, eventId]);

  const scoped = eventId ? items.filter(i => i.eventId === eventId) : items;
  const pending = scoped.filter(i => i.status === 'pending' || i.status === 'uploading').length;
  const failed  = scoped.filter(i => i.status === 'failed').length;

  return {
    items: scoped,
    pending,
    failed,
    uploading,
    lastError,
    process,
    refresh,
    clearFailed,
    resetFailed,
    clearForEvent,
  };
}
