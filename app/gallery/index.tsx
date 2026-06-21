/**
 * Attendee gallery — photos when ready, welcome screen when not.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import { useAttendeeGallery } from '@/hooks/useAttendeeGallery';
import { useAttendeeWelcome } from '@/hooks/useAttendeeWelcome';
import { PhotoGrid } from '@/components/events/PhotoGrid';
import { GalleryWelcome } from '@/components/gallery/GalleryWelcome';
import { useAuth } from '@/contexts/AuthContext';
import type { GalleryItem } from '@/hooks/useAttendeeGallery';

export default function GalleryScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { session } = useAuth();
  const { items, loading, error, refresh } = useAttendeeGallery();
  const { welcome, loading: welcomeLoading, refresh: refreshWelcome } = useAttendeeWelcome();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refresh(), refreshWelcome()]);
    } finally {
      setRefreshing(false);
    }
  }, [refresh, refreshWelcome]);

  useEffect(() => {
    if (loading || welcomeLoading || !welcome) return;
    if (items.length === 0) return;
    if (welcome.photoConsentAt) return;

    router.replace({
      pathname: '/photo-release',
      params: { attendeeId: welcome.attendeeId, redirectTo: '/gallery' },
    } as never);
  }, [items.length, loading, welcome, welcomeLoading, router]);

  useFocusEffect(
    useCallback(() => {
      void handleRefresh();
    }, [handleRefresh]),
  );

  if (!session) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Ionicons name="key-outline" size={40} color={brandColors.mutedText} />
        <Text style={styles.gateTitle}>Enter your code</Text>
        <Text style={styles.gateBody}>Go to Events and type the code from your photographer.</Text>
        <Pressable style={styles.primaryBtn} onPress={() => router.replace('/(tabs)/events' as never)}>
          <Text style={styles.primaryBtnText}>Go to Events</Text>
        </Pressable>
      </View>
    );
  }

  const handlePhotoPress = (item: GalleryItem) => {
    router.push(`/gallery/${item.photo.id}` as never);
  };

  const showWelcome =
    !loading && !welcomeLoading && items.length === 0 && welcome != null && welcome.assignedCount === 0;

  const showSyncIssue =
    !loading && !welcomeLoading && items.length === 0 && welcome != null && welcome.assignedCount > 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backRow}>
          <Ionicons name="chevron-back" size={22} color={brandColors.alphaRed} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>My Gallery</Text>
        <Text style={styles.subtitle}>
          {showWelcome
            ? welcome?.eventName ?? 'Your event'
            : `${items.length} photo${items.length !== 1 ? 's' : ''}`}
        </Text>
      </View>

      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => void handleRefresh()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : loading || welcomeLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#00BFFF" />
        </View>
      ) : showSyncIssue ? (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={40} color={brandColors.mutedText} />
          <Text style={styles.gateTitle}>Photos are assigned</Text>
          <Text style={styles.gateBody}>
            {welcome?.assignedCount ?? 0} photo{(welcome?.assignedCount ?? 0) !== 1 ? 's are' : ' is'} ready for you
            at {welcome?.eventName ?? 'your event'}, but we could not load them yet. Pull refresh or re-enter your code.
          </Text>
          <Pressable style={styles.primaryBtn} onPress={() => void handleRefresh()}>
            <Text style={styles.primaryBtnText}>Refresh gallery</Text>
          </Pressable>
          <Pressable style={styles.retryBtn} onPress={() => router.replace('/(tabs)/events' as never)}>
            <Text style={styles.retryText}>Re-enter event code</Text>
          </Pressable>
        </View>
      ) : showWelcome ? (
        <GalleryWelcome
          welcome={welcome}
          onRefresh={() => void handleRefresh()}
          refreshing={refreshing}
        />
      ) : items.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="key-outline" size={40} color={brandColors.mutedText} />
          <Text style={styles.gateBody}>Enter your event code on the Events tab first.</Text>
          <Pressable style={styles.primaryBtn} onPress={() => router.replace('/(tabs)/events' as never)}>
            <Text style={styles.primaryBtnText}>Enter code</Text>
          </Pressable>
        </View>
      ) : (
        <PhotoGrid
          items={items}
          loading={false}
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
