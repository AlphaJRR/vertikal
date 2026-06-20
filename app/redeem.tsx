/**
 * Redeem code screen — the buyer's entry point to their private gallery.
 *
 * Payment happens OFFLINE (cash / card reader / Zelle at the event).
 * The photographer hands the buyer a 6-character redeem_code after payment.
 * Entering that code calls redeem_attendee_code(p_code) which:
 *   - Validates the code exists and is unclaimed (or already claimed by this user)
 *   - Sets attendees.user_id = auth.uid()  ← RLS now resolves their gallery
 *   - Returns { attendee_id, event_id, event_name }
 *
 * There is NO price, NO purchase button, NO Stripe anywhere in this screen.
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { RedeemResult } from '@/types/events';

export default function RedeemScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { session } = useAuth();

  const [code,    setCode]    = useState('');
  const [busy,    setBusy]    = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState<RedeemResult | null>(null);

  if (!session) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top + 40 }]}>
        <Ionicons name="key-outline" size={44} color={brandColors.mutedText} />
        <Text style={styles.gateTitle}>Enter your code</Text>
        <Text style={styles.gateBody}>
          Sign in first, then come back here to enter your photo-delivery code.
        </Text>
        <Pressable style={styles.primaryBtn} onPress={() => router.push('/sign-in' as Href)}>
          <Text style={styles.primaryBtnText}>Sign in</Text>
        </Pressable>
      </View>
    );
  }

  const handleRedeem = async () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 3) {
      setError('Enter the code from your receipt.');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const { data, error: rpcErr } = await supabase
        .rpc('redeem_attendee_code', { p_code: trimmed });

      if (rpcErr) {
        const msg = rpcErr.message ?? '';
        if (msg.includes('Invalid code')) {
          setError('That code wasn\'t found. Double-check and try again.');
        } else if (msg.includes('Code already claimed')) {
          setError('This code has already been used by a different account. Contact the photographer.');
        } else {
          setError('Something went wrong. Please try again.');
          console.error('[redeem] RPC error:', rpcErr);
        }
        return;
      }

      // data is an array of rows — take the first
      const row = Array.isArray(data) ? (data[0] as RedeemResult) : (data as RedeemResult);

      // Check if this attendee has given photo consent for this specific event.
      // A returning user with profile-level tos_accepted_at can skip /consent on
      // subsequent redeems, bypassing per-event photo release. Always check.
      const { data: attendeeData } = await supabase
        .from('attendees')
        .select('photo_consent_at')
        .eq('id', row.attendee_id)
        .single();

      if (!attendeeData?.photo_consent_at) {
        router.replace({ pathname: '/consent', params: { redirectTo: '/gallery' } } as never);
      } else {
        setSuccess(row);
      }
    } catch (err) {
      console.error('[redeem] unexpected error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (success) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top + 40 }]}>
        <Ionicons name="checkmark-circle" size={56} color="#00BFFF" />
        <Text style={styles.successTitle}>Gallery unlocked!</Text>
        <Text style={styles.successBody}>
          Your photos from <Text style={styles.bold}>{success.event_name}</Text> are
          ready. Tap below to view them.
        </Text>
        <Pressable style={styles.primaryBtn} onPress={() => router.replace('/gallery' as Href)}>
          <Text style={styles.primaryBtnText}>View my gallery</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0a0a0a' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backRow}>
          <Ionicons name="chevron-back" size={22} color={brandColors.alphaRed} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={styles.icon}>
          <Ionicons name="key-outline" size={40} color="#00BFFF" />
        </View>

        <Text style={styles.title}>Enter your code</Text>
        <Text style={styles.body}>
          Your photographer gave you a 6-character code with your receipt.
          Enter it here to unlock your private photo gallery.
        </Text>

        <Text style={styles.fieldLabel}>Redeem code</Text>
        <TextInput
          value={code}
          onChangeText={t => {
            setCode(t.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8));
            setError(null);
          }}
          placeholder="e.g.  A3K7M9"
          placeholderTextColor={brandColors.mutedText}
          autoCapitalize="characters"
          autoCorrect={false}
          keyboardType="default"
          style={styles.codeInput}
          editable={!busy}
          autoFocus
          onSubmitEditing={() => void handleRedeem()}
        />

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color={brandColors.alphaRed} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Pressable
          style={[styles.primaryBtn, (busy || code.trim().length < 3) && styles.btnDisabled]}
          onPress={() => void handleRedeem()}
          disabled={busy || code.trim().length < 3}
        >
          {busy ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Ionicons name="lock-open-outline" size={18} color="#000" />
              <Text style={styles.primaryBtnText}>Unlock gallery</Text>
            </>
          )}
        </Pressable>

        <View style={styles.helpNote}>
          <Ionicons name="information-circle-outline" size={15} color={brandColors.mutedText} />
          <Text style={styles.helpText}>
            Don't have a code? Ask your photographer — codes are given out at the event after purchase.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1, backgroundColor: '#0a0a0a',
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32, gap: 16,
  },
  container: { paddingHorizontal: 24, gap: 16 },
  backRow:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  backText:  { fontFamily: brandFonts.bodyMedium, fontSize: 15, color: brandColors.alphaRed },
  icon:      { alignItems: 'center', paddingVertical: 8 },
  title:     { fontFamily: brandFonts.display, fontSize: 32, color: '#fff', textTransform: 'uppercase', textAlign: 'center' },
  body:      { fontFamily: brandFonts.body, fontSize: 14, lineHeight: 21, color: brandColors.subtleText, textAlign: 'center' },
  fieldLabel:{ fontFamily: brandFonts.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: brandColors.mutedText },
  codeInput: {
    fontFamily: brandFonts.mono, fontSize: 28, color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(0,191,255,0.3)',
    borderRadius: 12, paddingHorizontal: 20, paddingVertical: 18,
    textAlign: 'center', letterSpacing: 10,
  },
  errorBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: 'rgba(232,0,10,0.08)',
    borderWidth: 1, borderColor: 'rgba(232,0,10,0.25)',
    borderRadius: 10, padding: 14,
  },
  errorText:  { fontFamily: brandFonts.body, fontSize: 13, color: brandColors.alphaRed, flex: 1, lineHeight: 18 },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#00BFFF', borderRadius: 12,
    paddingVertical: 16, justifyContent: 'center', minHeight: 52,
  },
  btnDisabled:    { opacity: 0.35 },
  primaryBtnText: { color: '#000', fontSize: 14, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
  helpNote:  { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  helpText:  { fontFamily: brandFonts.body, fontSize: 12, color: brandColors.mutedText, flex: 1, lineHeight: 18 },
  gateTitle: { fontFamily: brandFonts.display, fontSize: 26, color: '#fff', textTransform: 'uppercase', textAlign: 'center' },
  gateBody:  { fontFamily: brandFonts.body, fontSize: 14, lineHeight: 20, color: brandColors.subtleText, textAlign: 'center' },
  successTitle: { fontFamily: brandFonts.display, fontSize: 28, color: '#fff', textTransform: 'uppercase', textAlign: 'center' },
  successBody:  { fontFamily: brandFonts.body, fontSize: 15, lineHeight: 22, color: brandColors.subtleText, textAlign: 'center' },
  bold:      { fontWeight: '700', color: '#fff' },
});
