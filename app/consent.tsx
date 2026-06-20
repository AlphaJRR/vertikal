/**
 * Age-gate + consent screen — PRD Section 05 / compliance matrix Section 10.
 *
 * REQUIRED before any gallery content is shown (App Store 5.1.1 / COPPA).
 * Writes four rows to consent_log: age_confirm, photo_release, terms, marketing.
 * Sets attendees.photo_consent_at + terms_accepted_at + is_adult.
 * Marketing opt-in is SEPARATE and un-pre-checked (5.1.1 compliance).
 *
 * Gate: 18+ OR parent/guardian.  Not a Kids app — categorised for 17+.
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
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
import { supabase } from '@/lib/supabase';

// ⚠️ JR: replace with live URLs before App Store submission
const PRIVACY_URL = 'https://alphavisualartists.com/privacy';
const TERMS_URL   = 'https://alphavisualartists.com/terms';

export default function ConsentScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { redirectTo } = useLocalSearchParams<{ redirectTo?: string }>();

  const [isAdult,      setIsAdult]      = useState(false);
  const [photoRelease, setPhotoRelease] = useState(false);
  const [tosAccepted,  setTosAccepted]  = useState(false);
  const [marketingOn,  setMarketingOn]  = useState(false);  // un-pre-checked per PRD

  const [busy,  setBusy]  = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinue = isAdult && photoRelease && tosAccepted;

  const handleContinue = async () => {
    if (!canContinue) {
      setError('Please confirm all required items to continue.');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No session');

      const now = new Date().toISOString();

      // ── 1. Upsert profiles with account-level consent timestamps ─────────
      const { error: upsertError } = await supabase.from('profiles').upsert({
        id:                    user.id,
        age_gate_confirmed_at: isAdult ? now : null,
        tos_accepted_at:       tosAccepted ? now : null,
        marketing_opt_in:      marketingOn,
      }, { onConflict: 'id' });

      if (upsertError) {
        console.error('[consent] profiles upsert failed:', upsertError);
        setError('Could not save your preferences. Please try again.');
        return;
      }

      // ── 2. Write account-level consent_log rows (no attendee_id here) ────
      // photo_release is per-event and written by the /photo-release screen.
      await supabase.from('consent_log').insert([
        { attendee_id: null, consent_type: 'age_confirm', granted: isAdult     },
        { attendee_id: null, consent_type: 'terms',       granted: tosAccepted  },
        { attendee_id: null, consent_type: 'marketing',   granted: marketingOn  },
      ]);

      // ── 3. Navigate ───────────────────────────────────────────────────────
      if (redirectTo) {
        router.replace(redirectTo as Href);
      } else if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)' as Href);
      }
    } catch (err) {
      console.error('[consent] failed:', err);
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
        <Text style={styles.title}>Before we start</Text>
        <Text style={styles.subtitle}>
          We need your confirmation to protect your privacy and keep our community safe.
        </Text>
      </View>

      <View style={styles.card}>
        {/* Age gate — 18+ or parent/guardian */}
        <CheckRow
          checked={isAdult}
          onToggle={() => setIsAdult(v => !v)}
          required
        >
          I am <BoldText>18 years of age or older</BoldText>, or I am a parent /
          guardian consenting on behalf of a minor
        </CheckRow>

        {/* Photo release consent */}
        <CheckRow
          checked={photoRelease}
          onToggle={() => setPhotoRelease(v => !v)}
          required
        >
          I consent to my event photos being <BoldText>displayed in my private gallery</BoldText>{' '}
          and shared only with me
        </CheckRow>

        {/* Terms + privacy */}
        <CheckRow
          checked={tosAccepted}
          onToggle={() => setTosAccepted(v => !v)}
          required
        >
          I agree to the{' '}
          <Text style={styles.link} onPress={() => void Linking.openURL(TERMS_URL)}>
            Terms of Service
          </Text>
          {' '}and{' '}
          <Text style={styles.link} onPress={() => void Linking.openURL(PRIVACY_URL)}>
            Privacy Policy
          </Text>
        </CheckRow>

        {/* Marketing opt-in — SEPARATE, un-pre-checked (PRD 5.1.1) */}
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

      {/* Data minimization callout */}
      <View style={styles.dataNote}>
        <Ionicons name="shield-checkmark-outline" size={16} color="#00BFFF" />
        <Text style={styles.dataNoteText}>
          Account creation requires only your <BoldText>name + email</BoldText>.
          Phone and interests are optional and will never limit your gallery access.
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.btn, (!canContinue || busy) && styles.btnDisabled]}
        onPress={() => void handleContinue()}
        disabled={!canContinue || busy}
      >
        {busy ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.btnText}>Continue</Text>
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

function BoldText({ children }: { children: React.ReactNode }) {
  return <Text style={styles.bold}>{children}</Text>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a0a' },
  container: { paddingHorizontal: 24, gap: 20 },
  header: { gap: 8 },
  eyebrow: { color: '#00BFFF', fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
  title: { fontFamily: brandFonts.display, fontSize: 30, color: '#fff', textTransform: 'uppercase' },
  subtitle: { fontFamily: brandFonts.body, fontSize: 14, lineHeight: 20, color: brandColors.subtleText },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12, padding: 20, gap: 20,
  },
  row: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  rowOptional: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 20 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
  },
  checkboxChecked: { backgroundColor: '#00BFFF', borderColor: '#00BFFF' },
  checkLabel: { fontFamily: brandFonts.body, fontSize: 14, lineHeight: 20, color: '#fff' },
  bold: { fontWeight: '700' },
  link: { color: '#00BFFF', textDecorationLine: 'underline' },
  optionalTag: { fontFamily: brandFonts.body, fontSize: 11, color: brandColors.mutedText, marginTop: 3 },
  dataNote: {
    flexDirection: 'row', gap: 10,
    backgroundColor: 'rgba(0,191,255,0.06)',
    borderRadius: 10, padding: 14, alignItems: 'flex-start',
  },
  dataNoteText: { fontFamily: brandFonts.body, fontSize: 12, lineHeight: 18, color: brandColors.subtleText, flex: 1 },
  btn: {
    backgroundColor: '#00BFFF', borderRadius: 10,
    paddingVertical: 16, alignItems: 'center', justifyContent: 'center', minHeight: 52,
  },
  btnDisabled: { opacity: 0.35 },
  btnText: { color: '#000', fontSize: 13, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
  error: { fontFamily: brandFonts.body, fontSize: 13, color: brandColors.alphaRed, lineHeight: 18 },
});
