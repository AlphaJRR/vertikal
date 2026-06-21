/**
 * Redeem screen — same code-only flow as Events tab.
 */

import React, { useEffect, useState } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { brandColors, brandFonts } from '@/constants/theme';
import { useGuestGalleryUnlock } from '@/hooks/useGuestGalleryUnlock';
import { normalizeRedeemCode, peekStashedRedeemCode, stashRedeemCode } from '@/lib/redeemDeepLink';

export default function RedeemScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ code?: string | string[] }>();

  const [prefillReady, setPrefillReady] = useState(false);
  const { code, setCode, busy, error, unlock, setError } = useGuestGalleryUnlock();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const fromParam = normalizeRedeemCode(params.code);
      const fromStash = await peekStashedRedeemCode();
      const initial = fromParam ?? fromStash;
      if (!cancelled && initial) {
        setCode(initial);
        await stashRedeemCode(initial);
      }
      if (!cancelled) setPrefillReady(true);
    })();
    return () => { cancelled = true; };
  }, [params.code, setCode]);

  if (!prefillReady) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top + 40 }]}>
        <ActivityIndicator color="#00BFFF" />
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

        <Text style={styles.title}>Enter event code</Text>
        <Text style={styles.body}>
          Type the code from your photographer. No signup — your gallery opens immediately.
        </Text>

        <Text style={styles.fieldLabel}>Event code</Text>
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

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable
          style={[styles.primaryBtn, busy && styles.btnDisabled]}
          onPress={() => void unlock()}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Ionicons name="images-outline" size={18} color="#000" />
              <Text style={styles.primaryBtnText}>Open my gallery</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1, backgroundColor: '#0a0a0a',
    alignItems: 'center', justifyContent: 'center',
  },
  container: { paddingHorizontal: 24, gap: 14 },
  backRow:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  backText:  { fontFamily: brandFonts.bodyMedium, fontSize: 15, color: brandColors.alphaRed },
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
  errorText:  { fontFamily: brandFonts.body, fontSize: 13, color: brandColors.alphaRed, lineHeight: 18 },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#00BFFF', borderRadius: 12,
    paddingVertical: 16, justifyContent: 'center', minHeight: 52,
    marginTop: 4,
  },
  btnDisabled:    { opacity: 0.35 },
  primaryBtnText: { color: '#000', fontSize: 14, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
});
