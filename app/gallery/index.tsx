/**
 * Attendee gallery screen.
 * Shows thumbnails (signed URLs from mint-download-url edge fn) for all photos
 * the attendee has been assigned. RLS enforces privacy at the DB layer.
 */

import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import { useAttendeeGallery } from '@/hooks/useAttendeeGallery';
import { PhotoGrid } from '@/components/events/PhotoGrid';
import { useAuth } from '@/contexts/AuthContext';
import type { GalleryItem } from '@/hooks/useAttendeeGallery';

export default function GalleryScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { session } = useAuth();
  const { items, loading, error, refresh } = useAttendeeGallery();

  if (!session) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Ionicons name="images-outline" size={40} color={brandColors.mutedText} />
        <Text style={styles.gateTitle}>Your Gallery</Text>
        <Text style={styles.gateBody}>Sign in to view your event photos.</Text>
        <Pressable style={styles.primaryBtn} onPress={() => router.push('/sign-in')}>
          <Text style={styles.primaryBtnText}>Sign in</Text>
        </Pressable>
      </View>
    );
  }

  const handlePhotoPress = (item: GalleryItem) => {
    router.push(`/gallery/${item.photo.id}` as never);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backRow}>
          <Ionicons name="chevron-back" size={22} color={brandColors.alphaRed} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>My Gallery</Text>
        <Text style={styles.subtitle}>{items.length} photo{items.length !== 1 ? 's' : ''}</Text>
      </View>

      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => void refresh()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <PhotoGrid
          items={items}
          loading={loading}
          onPhotoPress={handlePhotoPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#0a0a0a' },
  header:  { paddingHorizontal: 24, paddingBottom: 12, gap: 4 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  backText:{ fontFamily: brandFonts.bodyMedium, fontSize: 15, color: brandColors.alphaRed },
  title:   { fontFamily: brandFonts.display, fontSize: 32, color: '#fff', textTransform: 'uppercase' },
  subtitle:{ fontFamily: brandFonts.body, fontSize: 13, color: brandColors.subtleText },
  centered:{
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16,
    paddingVertical: 60, paddingHorizontal: 32,
  },
  gateTitle: {
    fontFamily: brandFonts.display, fontSize: 24,
    color: '#fff', textTransform: 'uppercase', textAlign: 'center',
  },
  gateBody: {
    fontFamily: brandFonts.body, fontSize: 14, lineHeight: 20,
    color: brandColors.subtleText, textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: '#00d4ff', borderRadius: 10,
    paddingVertical: 14, paddingHorizontal: 28,
  },
  primaryBtnText: {
    color: '#000', fontSize: 13, fontWeight: '800',
    letterSpacing: 0.5, textTransform: 'uppercase',
  },
  errorText: {
    fontFamily: brandFonts.body, fontSize: 14,
    color: brandColors.alphaRed, textAlign: 'center',
  },
  retryBtn: { paddingVertical: 10, paddingHorizontal: 20 },
  retryText: { fontFamily: brandFonts.bodyMedium, fontSize: 14, color: '#00d4ff' },
});
