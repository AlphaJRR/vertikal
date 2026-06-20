/**
 * Upload photos for an event.
 * Batch-picks from camera roll → pre-inserts DB rows → queues uploads.
 * Background queue + retry handled by UploadQueue / useUploadQueue.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
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
import type { EventPhoto } from '@/types/events';

export default function UploadScreen() {
  const { id }  = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { isOperator, loading: guardLoading } = useOperatorGuard();
  const { event }  = useEvent(id ?? '');
  const { photos, refresh } = useEventPhotos(id ?? '');

  const { pending, uploading, process } = useUploadQueue();
  const { pickAndEnqueue, picking }     = useBatchPicker(id ?? '', () => {
    void process();
    void refresh();
  });

  // Poll for status changes while uploads are in flight
  useEffect(() => {
    if (!uploading && pending === 0) return;
    const timer = setInterval(() => void refresh(), 4000);
    return () => clearInterval(timer);
  }, [uploading, pending, refresh]);

  if (guardLoading || !isOperator) {
    return (
      <View style={[styles.root, { paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color="#00BFFF" />
      </View>
    );
  }

  const handlePick = async () => {
    const count = await pickAndEnqueue();
    if (count === 0) return;
    void refresh();
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
      <UploadProgressBar pending={pending} uploading={uploading} />

      {/* Photo grid */}
      <FlatList
        data={photos}
        keyExtractor={p => p.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 100 }]}
        renderItem={({ item }: { item: EventPhoto }) => (
          <PhotoThumb photo={item} />
        )}
        ListEmptyComponent={
          !picking ? (
            <View style={styles.emptyState}>
              <Ionicons name="cloud-upload-outline" size={44} color={brandColors.mutedText} />
              <Text style={styles.emptyTitle}>No photos yet</Text>
              <Text style={styles.emptyBody}>
                Tap the button below to pick photos from your camera roll.
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

function PhotoThumb({ photo }: { photo: EventPhoto }) {
  // All rows in event_photos are fully processed (inserted by process-photo edge fn)
  return (
    <View style={styles.cell}>
      <View style={[styles.cellInner, styles.placeholderBg]}>
        <Ionicons name="image-outline" size={20} color={brandColors.mutedText} />
      </View>
      <View style={styles.readyDot} />
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
  grid: { padding: 2, gap: 2 },
  row:  { gap: 2 },
  cell: {
    width: CELL, height: CELL,
    position: 'relative',
  },
  cellInner: {
    width: '100%', height: '100%',
    alignItems: 'center', justifyContent: 'center',
  },
  placeholderBg: { backgroundColor: '#111' },
  readyDot: {
    position: 'absolute', top: 6, right: 6,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#00d4ff',
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
