/**
 * Attendee join — QR scan landing screen.
 * Deep link: ava://attendee/join?token=<qr_token>
 *
 * The QR token is used ONLY for:
 *   (a) Event discovery — shows the event name/date
 *   (b) Install attribution — logs an install_events row
 *
 * Gallery access is granted by the REDEEM CODE, not by the QR token.
 * After auth + consent this screen routes to /redeem.
 *
 * NOTE: No email-auto-linking by design (005 migration). The redeem code
 * is the sole authorization. This prevents gallery-guessing via email.
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import { needsAccountConsentScreen } from '@/lib/accountConsent';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

type PublicEventInfo = {
  id: string;
  name: string;
  cover_image_url: string | null;
  event_date: string | null;
  status: string;
};

export default function AttendeeJoinScreen() {
  const { token }   = useLocalSearchParams<{ token: string }>();
  const router      = useRouter();
  const insets      = useSafeAreaInsets();
  const { session } = useAuth();

  const [event,     setEvent]     = useState<PublicEventInfo | null>(null);
  const [resolving, setResolving] = useState(true);
  const [error,     setError]     = useState('');

  // ── Resolve event from qr_token ──────────────────────────────────────────
  useEffect(() => {
    if (!token) { setError('Invalid QR code.'); setResolving(false); return; }

    supabase
      .rpc('get_event_public', { p_qr_token: token })
      .then(({ data, error: err }) => {
        if (err) {
          setError('Unable to load event. Please check your connection and try again.');
        } else {
          const row = Array.isArray(data) ? (data as PublicEventInfo[])[0] : null;
          if (!row) {
            setError('Event not found. Check that you scanned the right QR code.');
          } else {
            setEvent(row);
          }
        }
        setResolving(false);
      });
  }, [token]);

  // ── Log QR scan for attribution (fire-and-forget) ─────────────────────────
  useEffect(() => {
    if (!event) return;
    void supabase.from('install_events').insert({
      event_id: event.id,
      type:     'qr_scan',
    });
  }, [event]);

  const handleContinue = async () => {
    if (!session?.user) {
      router.push('/redeem' as Href);
      return;
    }

    // Account consent — email users only; guests use per-event photo-release
    const needsConsent = await needsAccountConsentScreen(session.user);
    if (needsConsent) {
      router.push({ pathname: '/consent', params: { redirectTo: '/redeem' } } as never);
      return;
    }

    router.push('/redeem' as Href);
  };

  const dateLabel = event?.event_date
    ? new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : null;

  if (resolving) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator color="#00BFFF" size="large" />
        <Text style={styles.loadingText}>Finding your event…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Ionicons name="alert-circle-outline" size={44} color={brandColors.alphaRed} />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.homeBtn} onPress={() => router.replace('/(tabs)' as Href)}>
          <Text style={styles.homeBtnText}>Go home</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 40 }]}>
      {/* Event card */}
      <View style={styles.eventCard}>
        <Ionicons name="camera-outline" size={36} color="#00BFFF" />
        <Text style={styles.eventName}>{event?.name}</Text>
        {dateLabel        && <Text style={styles.eventMeta}>{dateLabel}</Text>}
        {event?.status && <Text style={styles.eventMeta}>{event.status}</Text>}
      </View>

      <Text style={styles.headline}>You're almost in</Text>
      <Text style={styles.body}>
        Enter the code your photographer gave you at checkout. No account signup — just the code.
      </Text>

      <Pressable style={styles.primaryBtn} onPress={() => void handleContinue()}>
        <Text style={styles.primaryBtnText}>
          {session ? 'Enter my code' : 'Enter event code'}
        </Text>
      </Pressable>

      <Text style={styles.note}>
        Your redeem code is on your receipt from the photographer.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root:      { flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 24, gap: 18 },
  centered:  { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', gap: 16 },
  eventCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16, padding: 24, alignItems: 'center', gap: 8,
  },
  eventName: { fontFamily: brandFonts.display, fontSize: 28, color: '#fff', textTransform: 'uppercase', textAlign: 'center' },
  eventMeta: { fontFamily: brandFonts.body, fontSize: 14, color: brandColors.subtleText, textAlign: 'center' },
  headline:  { fontFamily: brandFonts.display, fontSize: 26, color: '#fff', textTransform: 'uppercase' },
  body:      { fontFamily: brandFonts.body, fontSize: 14, lineHeight: 21, color: brandColors.subtleText },
  primaryBtn:{ backgroundColor: '#00BFFF', borderRadius: 12, paddingVertical: 16, alignItems: 'center', minHeight: 52 },
  primaryBtnText: { color: '#000', fontSize: 13, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
  note:      { fontFamily: brandFonts.body, fontSize: 12, color: brandColors.mutedText, textAlign: 'center' },
  loadingText: { fontFamily: brandFonts.body, fontSize: 14, color: brandColors.subtleText },
  errorText: { fontFamily: brandFonts.body, fontSize: 14, color: brandColors.alphaRed, textAlign: 'center', paddingHorizontal: 24 },
  homeBtn:   { paddingVertical: 10, paddingHorizontal: 20 },
  homeBtnText: { fontFamily: brandFonts.bodyMedium, fontSize: 14, color: '#00BFFF' },
});
