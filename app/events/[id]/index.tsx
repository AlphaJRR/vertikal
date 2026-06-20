/**
 * Event detail screen — shows event info, the share QR code, and quick-action buttons.
 * Photographer lands here after creating an event or tapping one from the list.
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import { useEvent } from '@/hooks/useEvents';
import { useEventPhotos } from '@/hooks/usePhotos';
import { QRCodeDisplay, joinUrl } from '@/components/events/QRCodeDisplay';
import { useOperatorGuard } from '@/hooks/useOperatorGuard';

export default function EventDetailScreen() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const { isOperator, loading: guardLoading } = useOperatorGuard();
  const { event, loading } = useEvent(id ?? '');
  const { photos }         = useEventPhotos(id ?? '');
  const [sharing, setSharing] = useState(false);

  if (guardLoading || !isOperator) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator color="#00BFFF" />
      </View>
    );
  }

  const handleShareLink = async () => {
    if (!event) return;
    setSharing(true);
    try {
      await Share.share({
        message: `Tap to access your photos from ${event.name}: ${joinUrl(event.qr_token)}`,
        title:   `${event.name} — Photo Gallery`,
      });
    } catch {
      // user dismissed share sheet
    } finally {
      setSharing(false);
    }
  };

  if (loading || !event) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator color="#00d4ff" />
      </View>
    );
  }

  const dateLabel = event.event_date
    ? new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      })
    : null;

  const readyPhotos = photos.length; // all rows in event_photos are processed (inserted by edge fn)

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
      ]}
    >
      {/* Back */}
      <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backRow}>
        <Ionicons name="chevron-back" size={22} color={brandColors.alphaRed} />
        <Text style={styles.backText}>Events</Text>
      </Pressable>

      {/* Name + meta */}
      <Text style={styles.title}>{event.name}</Text>
      {dateLabel      ? <Text style={styles.meta}>{dateLabel}</Text>           : null}
      {event.event_type ? <Text style={styles.meta}>{event.event_type}</Text> : null}

      {/* QR code */}
      <View style={styles.qrSection}>
        <QRCodeDisplay qrToken={event.qr_token} eventName={event.name} size={200} />
        <Pressable
          style={styles.shareBtn}
          onPress={() => void handleShareLink()}
          disabled={sharing}
        >
          <Ionicons name="share-outline" size={16} color="#000" />
          <Text style={styles.shareBtnText}>Share link</Text>
        </Pressable>
        <Text style={styles.qrHint}>
          Show this QR at the event or share the link. Attendees sign up once with their email.
        </Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <Stat label="Photos" value={photos.length} />
        <Stat label="Ready"  value={readyPhotos}   accent />
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <ActionBtn
          icon="person-add-outline"
          label="Create attendee + code"
          onPress={() => router.push(`/events/${id}/create-attendee` as never)}
        />
        <ActionBtn
          icon="cloud-upload-outline"
          label="Upload photos"
          onPress={() => router.push(`/events/${id}/upload` as never)}
        />
        <ActionBtn
          icon="people-outline"
          label="Assign photos"
          onPress={() => router.push(`/events/${id}/assign` as never)}
        />
        <ActionBtn
          icon="stats-chart-outline"
          label="Dashboard"
          onPress={() => router.push(`/events/${id}/dashboard` as never)}
        />
      </View>
    </ScrollView>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <View style={statStyles.container}>
      <Text style={[statStyles.value, accent && statStyles.valueAccent]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

function ActionBtn({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Pressable style={actionStyles.btn} onPress={onPress} accessibilityRole="button">
      <Ionicons name={icon as never} size={22} color="#00d4ff" />
      <Text style={actionStyles.label}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={brandColors.mutedText} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#0a0a0a' },
  content: { paddingHorizontal: 24, gap: 20 },
  centered: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  backRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8,
  },
  backText: {
    fontFamily: brandFonts.bodyMedium, fontSize: 15, color: brandColors.alphaRed,
  },
  title: {
    fontFamily: brandFonts.display, fontSize: 32,
    color: '#fff', textTransform: 'uppercase',
  },
  meta: {
    fontFamily: brandFonts.body, fontSize: 14,
    color: brandColors.subtleText, lineHeight: 20,
  },
  qrSection: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  shareBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#00d4ff', borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 20,
  },
  shareBtnText: {
    color: '#000', fontSize: 13, fontWeight: '800',
    letterSpacing: 0.5, textTransform: 'uppercase',
  },
  qrHint: {
    fontFamily: brandFonts.body, fontSize: 12, lineHeight: 18,
    color: brandColors.mutedText, textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row', gap: 12,
  },
  actions: {
    gap: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    overflow: 'hidden',
  },
});

const statStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontFamily: brandFonts.display,
    fontSize: 32,
    color: '#fff',
  },
  valueAccent: {
    color: '#00d4ff',
  },
  label: {
    fontFamily: brandFonts.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: brandColors.mutedText,
  },
});

const actionStyles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  label: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 15,
    color: '#fff',
    flex: 1,
  },
});
