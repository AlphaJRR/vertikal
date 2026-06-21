/**
 * Create attendee — photographer POS screen.
 *
 * Run at the sale station after checkout (cash, card reader, or Zelle — offline).
 * The DB trigger (005) auto-generates a unique redeem_code on INSERT.
 * Photographer shows the code to the guest — it's their gallery key.
 *
 * Required: first_name + last_name + photos_purchased (package photo count).
 * Contact: phone OR email when event.require_attendee_contact is true (AVA Demo Shoot).
 *
 * NO payment UI. NO price. NO Stripe. This screen only creates the attendee record.
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useEvent } from '@/hooks/useEvents';
import { useOperatorGuard } from '@/hooks/useOperatorGuard';
import type { Attendee } from '@/types/events';

/** Fixed demo/review event — contact required after migration 012. */
const DEMO_EVENT_ID = 'a0000000-de00-de00-de00-000000000001';

export default function CreateAttendeeScreen() {
  const { id }  = useLocalSearchParams<{ id: string }>();
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { isOperator, loading: guardLoading } = useOperatorGuard();
  const { event } = useEvent(id ?? '');

  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [phone,     setPhone]     = useState('');
  const [email,     setEmail]     = useState('');
  const [photosIncluded, setPhotosIncluded] = useState('');

  const requireContact =
    event?.require_attendee_contact === true || id === DEMO_EVENT_ID;

  const [busy,    setBusy]    = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [created, setCreated] = useState<Attendee | null>(null);

  if (guardLoading || !isOperator) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#00BFFF" />
      </View>
    );
  }

  const handleCreate = async () => {
    if (!firstName.trim()) { setError('First name is required.'); return; }
    if (!lastName.trim())  { setError('Last name is required.'); return; }

    const includedCount = parseInt(photosIncluded.trim(), 10);
    if (!photosIncluded.trim() || Number.isNaN(includedCount) || includedCount < 1) {
      setError('Enter how many digital photos are included in their package (at least 1).');
      return;
    }

    const phoneVal = phone.trim();
    const emailVal = email.trim().toLowerCase();
    if (requireContact && !phoneVal && !emailVal) {
      setError('Phone or email is required for this event so we can reach the guest if needed.');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const { data, error: insertErr } = await supabase
        .from('attendees')
        .insert({
          event_id:         id,
          first_name:       firstName.trim(),
          last_name:        lastName.trim(),
          phone:            phoneVal || null,
          email:            emailVal || null,
          photos_purchased: includedCount,
          is_adult:         true,
        })
        .select()
        .single();

      if (insertErr) {
        if (insertErr.code === '23505') {
          setError('An attendee with this email is already registered for this event.');
        } else if (
          insertErr.code === '23514'
          || insertErr.message?.includes('Phone or email is required')
        ) {
          setError('Phone or email is required for this event so we can reach the guest if needed.');
        } else {
          setError('Could not create attendee. Please try again.');
          console.error('[create-attendee]', insertErr.code, insertErr.message, insertErr);
        }
        return;
      }

      setCreated(data as Attendee);
    } catch (err) {
      console.error('[create-attendee] unexpected error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    if (!created?.redeem_code || !event) return;
    try {
      await Share.share({
        message:
          `Your AVA photo gallery code for ${event.name}: ${created.redeem_code}\n\n` +
          `1. Download the Alpha Creators app\n` +
          `2. Create a free account\n` +
          `3. Tap "Redeem code" and enter: ${created.redeem_code}`,
        title: 'Your gallery code',
      });
    } catch { /* user dismissed */ }
  };

  const handleCreateAnother = () => {
    setCreated(null);
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setPhotosIncluded('');
    setError(null);
  };

  // ── SUCCESS STATE ─────────────────────────────────────────────────────────
  if (created) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backRow}>
          <Ionicons name="chevron-back" size={22} color={brandColors.alphaRed} />
          <Text style={styles.backText}>Event</Text>
        </Pressable>

        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={52} color="#00BFFF" />
          <Text style={styles.successName}>
            {created.first_name} {created.last_name}
          </Text>
          <Text style={styles.successSubtitle}>Attendee created</Text>

          {/* Big prominent code display */}
          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>REDEEM CODE — GIVE TO GUEST</Text>
            <Text style={styles.codeValue}>{created.redeem_code}</Text>
            <Text style={styles.codeHint}>
              Guest enters this in the app to unlock their photos
            </Text>
          </View>

          {/* Share the code */}
          <Pressable style={styles.shareBtn} onPress={() => void handleShare()}>
            <Ionicons name="share-outline" size={18} color="#000" />
            <Text style={styles.shareBtnText}>Share code with guest</Text>
          </Pressable>

          {/* Assign photos to this attendee */}
          <Pressable
            style={styles.assignBtn}
            onPress={() => router.push(`/events/${id}/assign` as never)}
          >
            <Ionicons name="images-outline" size={18} color="#00BFFF" />
            <Text style={styles.assignBtnText}>Assign photos to this guest</Text>
          </Pressable>

          {/* Create another */}
          <Pressable style={styles.anotherBtn} onPress={handleCreateAnother}>
            <Ionicons name="add-circle-outline" size={18} color={brandColors.subtleText} />
            <Text style={styles.anotherBtnText}>Create another attendee</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── FORM STATE ────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0a0a0a' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backRow}>
          <Ionicons name="chevron-back" size={22} color={brandColors.alphaRed} />
          <Text style={styles.backText}>{event?.name ?? 'Event'}</Text>
        </Pressable>

        <Text style={styles.title}>New Attendee</Text>
        <Text style={styles.subtitle}>
          Enter the guest&apos;s details. A unique gallery code will be generated automatically.
        </Text>

        {requireContact ? (
          <View style={styles.requiredBanner}>
            <Ionicons name="call-outline" size={16} color="#fbbf24" />
            <Text style={styles.requiredBannerText}>
              Phone or email required for this event — enter at least one so we can reach the guest if delivery issues come up.
            </Text>
          </View>
        ) : null}

        <Field label="First name *">
          <TextInput
            value={firstName} onChangeText={setFirstName}
            placeholder="Marcus" placeholderTextColor={brandColors.mutedText}
            style={styles.input} editable={!busy} autoFocus
          />
        </Field>

        <Field label="Last name *">
          <TextInput
            value={lastName} onChangeText={setLastName}
            placeholder="Johnson" placeholderTextColor={brandColors.mutedText}
            style={styles.input} editable={!busy}
          />
        </Field>

        <Field label="Digital photos included *">
          <TextInput
            value={photosIncluded}
            onChangeText={setPhotosIncluded}
            placeholder="3"
            placeholderTextColor={brandColors.mutedText}
            keyboardType="number-pad"
            style={styles.input}
            editable={!busy}
          />
        </Field>
        <Text style={styles.fieldHint}>
          How many digital photos are in their package (set at checkout).
        </Text>

        <Field label={requireContact ? 'Phone *' : 'Phone (optional)'}>
          <TextInput
            value={phone} onChangeText={setPhone}
            placeholder="(312) 555-0100"
            placeholderTextColor={brandColors.mutedText}
            keyboardType="phone-pad"
            style={styles.input} editable={!busy}
          />
        </Field>

        <Field label={requireContact ? 'Email *' : 'Email (optional)'}>
          <TextInput
            value={email} onChangeText={setEmail}
            placeholder="guest@email.com"
            placeholderTextColor={brandColors.mutedText}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input} editable={!busy}
          />
        </Field>

        <View style={styles.infoNote}>
          <Ionicons name="information-circle-outline" size={14} color={brandColors.mutedText} />
          <Text style={styles.infoText}>
            {requireContact
              ? 'Enter at least one way to reach this guest (phone or email). We only contact them manually if something goes wrong with delivery.'
              : 'Phone and email are optional — they will not gate gallery access. A unique code is generated automatically on save.'}
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Pressable
          style={[styles.primaryBtn, busy && styles.btnDisabled]}
          onPress={() => void handleCreate()}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Ionicons name="person-add-outline" size={18} color="#000" />
              <Text style={styles.primaryBtnText}>Create & get code</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 6, marginTop: 14 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 24 },
  container:  { paddingHorizontal: 24, gap: 0 },
  backRow:    { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 20 },
  backText:   { fontFamily: brandFonts.bodyMedium, fontSize: 15, color: brandColors.alphaRed },
  title:      { fontFamily: brandFonts.display, fontSize: 30, color: '#fff', textTransform: 'uppercase' },
  subtitle:   { fontFamily: brandFonts.body, fontSize: 13, lineHeight: 19, color: brandColors.subtleText, marginTop: 6 },
  requiredBanner: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(251,191,36,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.35)',
  },
  requiredBannerText: {
    fontFamily: brandFonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: '#fbbf24',
    flex: 1,
  },
  fieldLabel: { fontFamily: brandFonts.mono, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: brandColors.mutedText },
  fieldHint: {
    fontFamily: brandFonts.body,
    fontSize: 12,
    color: brandColors.mutedText,
    marginTop: -6,
    lineHeight: 17,
  },
  input: {
    fontFamily: brandFonts.body, fontSize: 16, color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 14,
  },
  infoNote: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    marginTop: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10, padding: 12,
  },
  infoText:   { fontFamily: brandFonts.body, fontSize: 12, color: brandColors.mutedText, flex: 1, lineHeight: 18 },
  errorBox:   { backgroundColor: 'rgba(232,0,10,0.08)', borderWidth: 1, borderColor: 'rgba(232,0,10,0.25)', borderRadius: 10, padding: 14, marginTop: 12 },
  errorText:  { fontFamily: brandFonts.body, fontSize: 13, color: brandColors.alphaRed, lineHeight: 18 },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#00BFFF', borderRadius: 12,
    paddingVertical: 16, justifyContent: 'center', minHeight: 52, marginTop: 24,
  },
  btnDisabled:    { opacity: 0.85 },
  primaryBtnText: { color: '#000', fontSize: 13, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },

  // Success state
  successContainer: { alignItems: 'center', paddingTop: 20, gap: 14 },
  successName:   { fontFamily: brandFonts.display, fontSize: 28, color: '#fff', textTransform: 'uppercase' },
  successSubtitle:{ fontFamily: brandFonts.body, fontSize: 13, color: brandColors.subtleText },
  codeCard: {
    width: '100%',
    backgroundColor: 'rgba(0,191,255,0.08)',
    borderWidth: 2, borderColor: 'rgba(0,191,255,0.4)',
    borderRadius: 16, padding: 24, alignItems: 'center', gap: 8,
  },
  codeLabel: { fontFamily: brandFonts.mono, fontSize: 10, letterSpacing: 2, color: '#00BFFF', textTransform: 'uppercase' },
  codeValue: { fontFamily: brandFonts.mono, fontSize: 44, color: '#fff', letterSpacing: 12, fontWeight: '700' },
  codeHint:  { fontFamily: brandFonts.body, fontSize: 12, color: brandColors.mutedText, textAlign: 'center' },
  shareBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%',
    backgroundColor: '#00BFFF', borderRadius: 12,
    paddingVertical: 14, justifyContent: 'center',
  },
  shareBtnText: { color: '#000', fontSize: 13, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
  assignBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10, width: '100%',
    borderWidth: 1, borderColor: 'rgba(0,191,255,0.4)',
    borderRadius: 12, paddingVertical: 14, justifyContent: 'center',
  },
  assignBtnText: { fontFamily: brandFonts.bodyMedium, fontSize: 14, color: '#00BFFF' },
  anotherBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12, paddingVertical: 14, justifyContent: 'center',
  },
  anotherBtnText: { fontFamily: brandFonts.bodyMedium, fontSize: 14, color: brandColors.subtleText },
});
