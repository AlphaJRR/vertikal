/**
 * Events tab for guests — type code, see gallery or welcome screen. No account signup.
 */

import React, { useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import { useGuestGalleryUnlock } from '@/hooks/useGuestGalleryUnlock';

const LAST_CODE_KEY = 'ava:last_redeem_code';

interface GuestEventsGateProps {
  paddingTop: number;
  paddingBottom: number;
}

export function GuestEventsGate({ paddingTop, paddingBottom }: GuestEventsGateProps) {
  const router = useRouter();
  const { code, setCode, busy, error, unlock, setError } = useGuestGalleryUnlock();

  useEffect(() => {
    void AsyncStorage.getItem(LAST_CODE_KEY).then((saved) => {
      if (saved) setCode(saved);
    });
  }, [setCode]);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: paddingTop + 16, paddingBottom: paddingBottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>AVA · Events</Text>
        <Text style={styles.title}>Your photos</Text>
        <Text style={styles.body}>
          Enter the code from your photographer. No account needed — your gallery opens right away.
        </Text>

        <Text style={styles.label}>Event code</Text>
        <TextInput
          value={code}
          onChangeText={t => {
            setCode(t.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8));
            setError(null);
          }}
          placeholder="DEMO01"
          placeholderTextColor={brandColors.mutedText}
          autoCapitalize="characters"
          autoCorrect={false}
          style={styles.codeInput}
          editable={!busy}
          onSubmitEditing={() => void unlock()}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.unlockBtn, busy && styles.btnDisabled]}
          onPress={() => void unlock()}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Ionicons name="images-outline" size={18} color="#000" />
              <Text style={styles.unlockBtnText}>Open my gallery</Text>
            </>
          )}
        </Pressable>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>photographer?</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable
          style={styles.signInBtn}
          onPress={() => router.push('/sign-in' as never)}
          disabled={busy}
        >
          <Text style={styles.signInBtnText}>Sign in to manage events</Text>
        </Pressable>

        <Text style={styles.demoHint}>Demo code: DEMO01</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { paddingHorizontal: 24, gap: 12 },
  eyebrow: {
    color: '#00BFFF', fontSize: 10, fontWeight: '700',
    letterSpacing: 2, textTransform: 'uppercase',
  },
  title: {
    fontFamily: brandFonts.display, fontSize: 32,
    color: '#fff', textTransform: 'uppercase',
  },
  body: {
    fontFamily: brandFonts.body, fontSize: 15, lineHeight: 22,
    color: brandColors.subtleText, marginBottom: 8,
  },
  label: {
    fontFamily: brandFonts.mono, fontSize: 10,
    letterSpacing: 1.5, textTransform: 'uppercase',
    color: brandColors.mutedText, marginTop: 4,
  },
  codeInput: {
    fontFamily: brandFonts.mono, fontSize: 28, color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(0,191,255,0.35)',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 18,
    textAlign: 'center', letterSpacing: 8,
  },
  error: { fontFamily: brandFonts.body, fontSize: 13, color: brandColors.alphaRed, lineHeight: 18 },
  unlockBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#00BFFF', borderRadius: 12,
    paddingVertical: 18, minHeight: 56, marginTop: 4,
  },
  unlockBtnText: {
    color: '#000', fontSize: 15, fontWeight: '800',
    letterSpacing: 0.5, textTransform: 'uppercase',
  },
  btnDisabled: { opacity: 0.5 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: {
    fontFamily: brandFonts.mono, fontSize: 9,
    letterSpacing: 1.5, textTransform: 'uppercase',
    color: brandColors.mutedText,
  },
  signInBtn: {
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12, paddingVertical: 14, alignItems: 'center',
  },
  signInBtnText: {
    fontFamily: brandFonts.bodyMedium, fontSize: 14, color: brandColors.subtleText,
  },
  demoHint: {
    fontFamily: brandFonts.mono, fontSize: 10,
    letterSpacing: 1, textTransform: 'uppercase',
    color: brandColors.mutedText, textAlign: 'center', marginTop: 16,
  },
});
