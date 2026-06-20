/**
 * Events tab — role-branched on useIsOperator().
 *
 * Operator  → full photographer dashboard: event list, create button, settings.
 * Standard  → attendee view only: redeem-code CTA + list of unlocked galleries.
 * Loading   → neutral skeleton (never flash operator surface while loading).
 *
 * Security: operator status comes from is_event_operator() RPC (migration 006).
 * It defaults to FALSE on error and is NEVER self-assignable. The DB-layer
 * RLS policy (events_operator_insert) is the real enforcement; UI gating is courtesy.
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useMyEvents } from '@/hooks/useEvents';
import { useIsOperator } from '@/hooks/useIsOperator';
import { EventCard } from '@/components/events/EventCard';
import { useAuth } from '@/contexts/AuthContext';
import type { Attendee, AVAEvent } from '@/types/events';

// ─────────────────────────────────────────────────────────────────────────────

export default function EventsTab() {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const { session }              = useAuth();
  const { isOperator, loading }  = useIsOperator();

  // Render
  if (!session) return <SignInCTA router={router} insets={insets} />;
  if (loading)  return <NeutralSkeleton insets={insets} />;
  if (isOperator) return <OperatorHome router={router} insets={insets} />;
  return <AttendeeHome router={router} insets={insets} />;
}

// ─── Operator view ────────────────────────────────────────────────────────────

function OperatorHome({ router, insets }: { router: ReturnType<typeof useRouter>; insets: ReturnType<typeof import('react-native-safe-area-context').useSafeAreaInsets> }) {
  const { events, loading, error, refresh } = useMyEvents();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
      ]}
    >
      {/* Operator header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>AVA · Operator</Text>
          <Text style={styles.title}>My Events</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.settingsBtn}
            onPress={() => router.push('/settings' as never)}
            accessibilityLabel="Settings"
          >
            <Ionicons name="settings-outline" size={20} color={brandColors.mutedText} />
          </Pressable>
          <Pressable
            style={styles.createBtn}
            onPress={() => router.push('/events/create' as never)}
            accessibilityLabel="Create new event"
          >
            <Ionicons name="add" size={20} color="#000" />
            <Text style={styles.createBtnText}>New</Text>
          </Pressable>
        </View>
      </View>

      {/* Attendee access (operators can also have galleries) */}
      <View style={styles.attendeeRow}>
        <Pressable style={styles.redeemBtn} onPress={() => router.push('/redeem' as never)}>
          <Ionicons name="key-outline" size={16} color="#00BFFF" />
          <Text style={styles.redeemBtnText}>Redeem a code</Text>
        </Pressable>
        <Pressable style={styles.galleryBtn} onPress={() => router.push('/gallery' as never)}>
          <Ionicons name="images-outline" size={16} color={brandColors.mutedText} />
          <Text style={styles.galleryBtnText}>My gallery</Text>
        </Pressable>
      </View>

      {/* Event list */}
      {loading ? (
        <View style={styles.centeredPad}>
          <ActivityIndicator color="#00BFFF" />
        </View>
      ) : error ? (
        <View style={styles.centeredPad}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => void refresh()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={44} color={brandColors.mutedText} />
          <Text style={styles.emptyTitle}>No events yet</Text>
          <Text style={styles.emptyBody}>
            Create your first event to start uploading photos and delivering galleries.
          </Text>
          <Pressable style={styles.primaryBtn} onPress={() => router.push('/events/create' as never)}>
            <Text style={styles.primaryBtnText}>Create an event</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.eventList}>
          {events.map(ev => (
            <EventCard
              key={ev.id}
              event={ev}
              onPress={() => router.push(`/events/${ev.id}` as never)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

// ─── Attendee / standard-user view ───────────────────────────────────────────

function AttendeeHome({ router, insets }: { router: ReturnType<typeof useRouter>; insets: ReturnType<typeof import('react-native-safe-area-context').useSafeAreaInsets> }) {
  const [unlockedEvents, setUnlockedEvents] = useState<Array<{ attendee: Attendee; eventName: string }>>([]);
  const [loadingGalleries, setLoadingGalleries] = useState(true);

  useEffect(() => {
    supabase
      .from('attendees')
      .select('*, events!inner(name)')
      .not('user_id', 'is', null)
      .is('deleted_at', null)
      .then(({ data }) => {
        if (data) {
          setUnlockedEvents(
            (data as unknown as Array<Attendee & { events: { name: string } }>).map(row => ({
              attendee:  row as unknown as Attendee,
              eventName: row.events.name,
            })),
          );
        }
        setLoadingGalleries(false);
      });
  }, []);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
      ]}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>AVA</Text>
          <Text style={styles.title}>Your Photos</Text>
        </View>
        <Pressable
          style={styles.settingsBtn}
          onPress={() => router.push('/settings' as never)}
          accessibilityLabel="Settings"
        >
          <Ionicons name="settings-outline" size={20} color={brandColors.mutedText} />
        </Pressable>
      </View>

      {/* Primary actions */}
      <View style={styles.attendeeRow}>
        <Pressable style={styles.redeemBtnFull} onPress={() => router.push('/redeem' as never)}>
          <Ionicons name="key-outline" size={20} color="#000" />
          <Text style={styles.redeemBtnFullText}>Enter my code</Text>
        </Pressable>
      </View>

      <Pressable style={styles.galleryRowBtn} onPress={() => router.push('/gallery' as never)}>
        <Ionicons name="images-outline" size={18} color="#00BFFF" />
        <Text style={styles.galleryRowText}>View all my photos</Text>
        <Ionicons name="chevron-forward" size={16} color={brandColors.mutedText} />
      </Pressable>

      {/* Unlocked events list */}
      {!loadingGalleries && unlockedEvents.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>Unlocked galleries</Text>
          <View style={styles.eventList}>
            {unlockedEvents.map(({ attendee, eventName }) => (
              <Pressable
                key={attendee.id}
                style={styles.galleryCard}
                onPress={() => router.push('/gallery' as never)}
              >
                <View style={styles.galleryCardIcon}>
                  <Ionicons name="images-outline" size={22} color="#00BFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.galleryCardName}>{eventName}</Text>
                  <Text style={styles.galleryCardSub}>Tap to view your photos</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={brandColors.mutedText} />
              </Pressable>
            ))}
          </View>
        </>
      )}

      {!loadingGalleries && unlockedEvents.length === 0 && (
        <View style={styles.attendeeEmpty}>
          <Ionicons name="key-outline" size={40} color={brandColors.mutedText} />
          <Text style={styles.attendeeEmptyTitle}>No galleries yet</Text>
          <Text style={styles.attendeeEmptyBody}>
            Enter the 6-character code from your photographer to unlock your event photos.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Not signed in ────────────────────────────────────────────────────────────

function SignInCTA({ router, insets }: { router: ReturnType<typeof useRouter>; insets: ReturnType<typeof import('react-native-safe-area-context').useSafeAreaInsets> }) {
  return (
    <View style={[styles.centered, { paddingTop: insets.top + 40 }]}>
      <Ionicons name="camera-outline" size={44} color={brandColors.mutedText} />
      <Text style={styles.gateTitle}>Event Photo Delivery</Text>
      <Text style={styles.gateBody}>
        Photographers create events and deliver photos. Attendees redeem a code to view their gallery.
        Sign in to get started.
      </Text>
      <Pressable style={styles.primaryBtn} onPress={() => router.push('/sign-in' as never)}>
        <Text style={styles.primaryBtnText}>Sign in</Text>
      </Pressable>
    </View>
  );
}

// ─── Neutral skeleton (shown while isOperator is loading) ─────────────────────
// Shows nothing that implies a role — no create button, no attendee-specific copy.

function NeutralSkeleton({ insets }: { insets: ReturnType<typeof import('react-native-safe-area-context').useSafeAreaInsets> }) {
  return (
    <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonBadge} />
      </View>
      <View style={[styles.skeletonCard, { marginTop: 24 }]} />
      <View style={[styles.skeletonCard, { marginTop: 12, opacity: 0.6 }]} />
      <View style={[styles.skeletonCard, { marginTop: 12, opacity: 0.4 }]} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#0a0a0a' },
  content: { paddingHorizontal: 16, gap: 14 },
  centered:{ flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 16 },

  headerRow:    { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  eyebrow:      { color: '#00BFFF', fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
  title:        { fontFamily: brandFonts.display, fontSize: 32, color: '#fff', textTransform: 'uppercase' },
  headerActions:{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 4 },
  settingsBtn:  { padding: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)' },
  createBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#00BFFF', borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 16,
  },
  createBtnText:{ color: '#000', fontSize: 13, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },

  attendeeRow:  { flexDirection: 'row', gap: 10 },
  redeemBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(0,191,255,0.1)', borderWidth: 1, borderColor: 'rgba(0,191,255,0.3)',
    borderRadius: 12, paddingVertical: 14,
  },
  redeemBtnText:{ fontFamily: brandFonts.bodyMedium, fontSize: 14, color: '#00BFFF' },
  galleryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12, paddingVertical: 14,
  },
  galleryBtnText: { fontFamily: brandFonts.bodyMedium, fontSize: 14, color: brandColors.subtleText },

  redeemBtnFull: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#00BFFF', borderRadius: 14,
    paddingVertical: 18, minHeight: 56,
  },
  redeemBtnFullText: { color: '#000', fontSize: 15, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },

  galleryRowBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12, padding: 16,
  },
  galleryRowText: { fontFamily: brandFonts.bodyMedium, fontSize: 15, color: '#00BFFF', flex: 1 },

  sectionLabel: {
    fontFamily: brandFonts.mono, fontSize: 10,
    letterSpacing: 1.5, textTransform: 'uppercase', color: brandColors.mutedText,
    marginTop: 8,
  },

  eventList:  { gap: 12 },
  centeredPad:{ paddingVertical: 40, alignItems: 'center', gap: 12 },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 14, paddingHorizontal: 16 },
  emptyTitle: { fontFamily: brandFonts.display, fontSize: 22, color: '#fff', textTransform: 'uppercase' },
  emptyBody:  { fontFamily: brandFonts.body, fontSize: 14, lineHeight: 20, color: brandColors.subtleText, textAlign: 'center' },

  primaryBtn: {
    backgroundColor: '#00BFFF', borderRadius: 10,
    paddingVertical: 14, paddingHorizontal: 28,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#000', fontSize: 13, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },

  errorText:  { fontFamily: brandFonts.body, fontSize: 14, color: brandColors.alphaRed, textAlign: 'center' },
  retryBtn:   { paddingVertical: 10, paddingHorizontal: 20 },
  retryText:  { fontFamily: brandFonts.bodyMedium, fontSize: 14, color: '#00BFFF' },

  // Attendee empty
  attendeeEmpty:    { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24, gap: 14 },
  attendeeEmptyTitle:{ fontFamily: brandFonts.display, fontSize: 22, color: '#fff', textTransform: 'uppercase' },
  attendeeEmptyBody: { fontFamily: brandFonts.body, fontSize: 14, lineHeight: 20, color: brandColors.subtleText, textAlign: 'center' },

  galleryCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12, padding: 16,
  },
  galleryCardIcon: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: 'rgba(0,191,255,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  galleryCardName:  { fontFamily: brandFonts.bodyMedium, fontSize: 15, color: '#fff' },
  galleryCardSub:   { fontFamily: brandFonts.body, fontSize: 12, color: brandColors.mutedText, marginTop: 2 },

  // Gate (not signed in)
  gateTitle:{ fontFamily: brandFonts.display, fontSize: 24, color: '#fff', textTransform: 'uppercase', textAlign: 'center' },
  gateBody: { fontFamily: brandFonts.body, fontSize: 14, lineHeight: 20, color: brandColors.subtleText, textAlign: 'center' },

  // Neutral skeleton
  skeletonHeader:{ paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  skeletonTitle: { width: 160, height: 32, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.08)' },
  skeletonBadge: { width: 60,  height: 32, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.06)' },
  skeletonCard:  { marginHorizontal: 16, height: 72, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)' },
});
