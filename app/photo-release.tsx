/**
 * Per-event photo release consent screen.
 *
 * Shown after a successful redeem_attendee_code RPC when the attendee
 * has not yet given per-event photo consent (attendees.photo_consent_at IS NULL).
 *
 * Route params:
 *   attendeeId  — the attendees row that needs photo consent
 *   redirectTo  — where to navigate after confirm (default: /gallery)
 *
 * On confirm:
 *   - Sets attendees.photo_consent_at = now()
 *   - Inserts consent_log row: { attendee_id, consent_type: 'photo_release', granted: true }
 *   - Navigates to redirectTo
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import { savePhotoReleaseConsent } from '@/lib/photoReleaseConsent';

export default function PhotoReleaseScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { attendeeId, redirectTo } = useLocalSearchParams<{ attendeeId: string; redirectTo?: string }>();

  const [photoConsent,  setPhotoConsent]  = useState(false);
  const [marketingOn,   setMarketingOn]   = useState(false);
  const [busy,          setBusy]          = useState(false);
  const [error,         setError]         = useState<string | null>(null);

  const canContinue = photoConsent;
  const destination = (redirectTo ?? '/gallery') as Href;

  const handleConfirm = async () => {
    if (!canContinue) {
      setError('Please confirm your consent to continue.');
      return;
    }
    if (!attendeeId) {
      setError('Missing attendee ID. Please try redeeming your code again.');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const saved = await savePhotoReleaseConsent(attendeeId, marketingOn);
      if (!saved.ok) {
        setError('Could not save your consent. Please try again.');
        return;
      }

      router.replace(destination);
    } catch (err) {
      console.error('[photo-release] failed:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>ALPHA VISUAL ARTISTS</Text>
        <Text style={styles.title}>Photo Release</Text>
        <Text style={styles.subtitle}>
          Before we show your photos, we need your consent to display them in your private gallery.
        </Text>
      </View>

      <View style={styles.card}>
        {/* Photo release — required */}
        <CheckRow
          checked={photoConsent}
          onToggle={() => setPhotoConsent(v => !v)}
          required
        >
          I consent to my event photos being{' '}
          <Text style={styles.bold}>displayed in my private gallery</Text>{' '}
          and shared only with me
        </CheckRow>

        {/* Marketing opt-in — optional, un-pre-checked */}
        <CheckRow
          checked={marketingOn}
          onToggle={() => setMarketingOn(v => !v)}
          optional
        >
          <Text style={styles.checkLabel}>
            Email me updates about AVA — tips, events, and new features
          </Text>
          <Text style={styles.optionalTag}>Optional • change anytime in Settings</Text>
        </CheckRow>
      </View>

      <View style={styles.privacyNote}>
        <Ionicons name="shield-checkmark-outline" size={16} color="#00BFFF" />
        <Text style={styles.privacyText}>
          Your photos are private by default. Only you can see them in your gallery.
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.btn, (!canContinue || busy) && styles.btnDisabled]}
        onPress={() => void handleConfirm()}
        disabled={!canContinue || busy}
      >
        {busy ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.btnText}>View my photos</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

function CheckRow({
  checked, onToggle, required, optional, children,
}: {
  checked: boolean; onToggle: () => void;
  required?: boolean; optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      style={[styles.row, optional && styles.rowOptional]}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={14} color="#000" />}
      </View>
      <View style={{ flex: 1 }}>
        {typeof children === 'string' ? (
          <Text style={styles.checkLabel}>{children}</Text>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root:      { flex: 1, backgroundColor: '#0a0a0a' },
  container: { paddingHorizontal: 24, gap: 20 },
  header:    { gap: 8 },
  eyebrow:   { color: '#00BFFF', fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
  title:     { fontFamily: brandFonts.display, fontSize: 30, color: '#fff', textTransform: 'uppercase' },
  subtitle:  { fontFamily: brandFonts.body, fontSize: 14, lineHeight: 20, color: brandColors.subtleText },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12, padding: 20, gap: 20,
  },
  row:         { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  rowOptional: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 20 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
  },
  checkboxChecked: { backgroundColor: '#00BFFF', borderColor: '#00BFFF' },
  checkLabel:  { fontFamily: brandFonts.body, fontSize: 14, lineHeight: 20, color: '#fff' },
  bold:        { fontWeight: '700' },
  optionalTag: { fontFamily: brandFonts.body, fontSize: 11, color: brandColors.mutedText, marginTop: 3 },
  privacyNote: {
    flexDirection: 'row', gap: 10,
    backgroundColor: 'rgba(0,191,255,0.06)',
    borderRadius: 10, padding: 14, alignItems: 'flex-start',
  },
  privacyText: { fontFamily: brandFonts.body, fontSize: 12, lineHeight: 18, color: brandColors.subtleText, flex: 1 },
  btn: {
    backgroundColor: '#00BFFF', borderRadius: 10,
    paddingVertical: 16, alignItems: 'center', justifyContent: 'center', minHeight: 52,
  },
  btnDisabled: { opacity: 0.35 },
  btnText:     { color: '#000', fontSize: 13, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
  error:       { fontFamily: brandFonts.body, fontSize: 13, color: brandColors.alphaRed, lineHeight: 18 },
});
