/**
 * Upload photos for an event.
 * Batch-picks from camera roll → pre-inserts DB rows → queues uploads.
 * Background queue + retry handled by UploadQueue / useUploadQueue.
 */

import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import { useEvent } from '@/hooks/useEvents';
import { useEventPhotos, useBatchPicker } from '@/hooks/usePhotos';
import { useUploadQueue } from '@/hooks/useUploadQueue';
import { useOperatorGuard } from '@/hooks/useOperatorGuard';
import { UploadProgressBar } from '@/components/events/UploadProgressBar';
import { EventPhotoThumb } from '@/components/events/EventPhotoThumb';
import type { EventPhoto } from '@/types/events';

export default function UploadScreen() {
  const { id }  = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { isOperator, loading: guardLoading } = useOperatorGuard();
  const { event }  = useEvent(id ?? '');
  const { pending, failed, uploading, lastError, process, resetFailed, clearForEvent } =
    useUploadQueue(id ?? '');
  const { photos, refresh } = useEventPhotos(id ?? '', {
    realtime: true,
    hasPendingUploads: pending > 0 || uploading,
  });

  const refreshPhotos = useCallback(async () => {
    await refresh();
  }, [refresh]);

  const { pickAndEnqueue, picking } = useBatchPicker(id ?? '', () => {
    void process(id).then(() => refreshPhotos());
  });

  // Refresh grid when uploads finish
  useEffect(() => {
    if (uploading) return;
    void refreshPhotos();
  }, [uploading, pending, failed, refreshPhotos]);

  // Keep trying while items are still queued
  useEffect(() => {
    if (uploading || pending === 0) return;
    const timer = setInterval(() => void process(id), 8000);
    return () => clearInterval(timer);
  }, [uploading, pending, process, id]);

  if (guardLoading || !isOperator) {
    return (
      <View style={[styles.root, { paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color="#00BFFF" />
      </View>
    );
  }

  const handlePick = async () => {
    if (id && failed > 0) {
      await clearForEvent(id);
    }
    const count = await pickAndEnqueue();
    if (count === 0) return;
    void process(id).then(() => refreshPhotos());
  };

  const handleRetry = async () => {
    if (failed > 0) {
      await resetFailed(id);
    }
    void process(id).then(() => refreshPhotos());
  };

  const handleClearQueue = async () => {
    if (!id) return;
    await clearForEvent(id);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backRow}>
          <Ionicons name="chevron-back" size={22} color={brandColors.alphaRed} />
          <Text style={styles.backText}>{event?.name ?? 'Event'}</Text>
        </Pressable>
        <Text style={styles.title}>Upload Photos</Text>
      </View>

      {/* Progress bar */}
      <UploadProgressBar
        pending={pending}
        failed={failed}
        uploading={uploading}
        lastError={lastError}
        onRetry={handleRetry}
      />

      {pending > 0 && !uploading ? (
        <Pressable style={styles.clearQueueBtn} onPress={() => void handleClearQueue()}>
          <Text style={styles.clearQueueText}>Clear stuck queue</Text>
        </Pressable>
      ) : null}

      {failed > 0 && !uploading ? (
        <Pressable style={styles.clearQueueBtn} onPress={() => void handleClearQueue()}>
          <Text style={styles.clearQueueText}>Clear failed queue</Text>
        </Pressable>
      ) : null}

      {/* Photo grid */}
      <FlatList
        data={photos}
        keyExtractor={p => p.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 100 }]}
        renderItem={({ item }: { item: EventPhoto }) => (
          <View style={styles.cell}>
            <EventPhotoThumb photo={item} showReadyDot />
          </View>
        )}
        ListEmptyComponent={
          !picking ? (
            <View style={styles.emptyState}>
              <Ionicons
                name={pending > 0 || uploading ? 'cloud-upload-outline' : 'images-outline'}
                size={44}
                color={brandColors.mutedText}
              />
              <Text style={styles.emptyTitle}>
                {pending > 0 || uploading
                  ? `Processing ${pending} photo${pending !== 1 ? 's' : ''}…`
                  : 'No photos yet'}
              </Text>
              <Text style={styles.emptyBody}>
                {pending > 0 || uploading
                  ? 'Thumbnails appear here as each photo finishes processing.'
                  : 'Tap the button below to pick photos from your camera roll.'}
              </Text>
            </View>
          ) : null
        }
      />

      {/* Floating pick button */}
      <View style={[styles.fabContainer, { bottom: insets.bottom + 24 }]}>
        <Pressable
          style={[styles.fab, (picking || uploading) && styles.fabDisabled]}
          onPress={() => void handlePick()}
          disabled={picking || uploading}
          accessibilityRole="button"
          accessibilityLabel="Select photos from camera roll"
        >
          {picking ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Ionicons name="images-outline" size={20} color="#000" />
              <Text style={styles.fabText}>Select photos</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const CELL = 120;
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { paddingHorizontal: 24, paddingBottom: 12, gap: 8 },
  backRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4,
  },
  backText: {
    fontFamily: brandFonts.bodyMedium, fontSize: 15, color: brandColors.alphaRed,
  },
  title: {
    fontFamily: brandFonts.display, fontSize: 28,
    color: '#fff', textTransform: 'uppercase',
  },
  clearQueueBtn: {
    alignSelf: 'center',
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearQueueText: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 13,
    color: '#fbbf24',
    textDecorationLine: 'underline',
  },
  grid: { padding: 2, gap: 2 },
  row:  { gap: 2 },
  cell: {
    width: CELL, height: CELL,
    position: 'relative',
  },
  emptyState: {
    alignItems: 'center', paddingVertical: 60,
    paddingHorizontal: 32, gap: 14,
  },
  emptyTitle: {
    fontFamily: brandFonts.display, fontSize: 22,
    color: '#fff', textTransform: 'uppercase',
  },
  emptyBody: {
    fontFamily: brandFonts.body, fontSize: 14,
    lineHeight: 20, color: brandColors.subtleText, textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute', left: 24, right: 24, alignItems: 'center',
  },
  fab: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#00d4ff',
    borderRadius: 14,
    paddingVertical: 16, paddingHorizontal: 32,
    minHeight: 52,
    shadowColor: '#00d4ff',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  fabDisabled: { opacity: 0.6 },
  fabText: {
    color: '#000', fontSize: 14,
    fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase',
  },
});
