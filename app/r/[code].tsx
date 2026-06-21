/**
 * Universal link entry: https://alphavisualartists.com/r/:code
 * Stashes the code and routes to /redeem with it pre-filled.
 */

import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { brandFonts } from '@/constants/theme';
import { normalizeRedeemCode, stashRedeemCode } from '@/lib/redeemDeepLink';

export default function RedeemDeepLinkScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code?: string | string[] }>();

  useEffect(() => {
    const normalized = normalizeRedeemCode(code);
    void (async () => {
      if (normalized) {
        await stashRedeemCode(normalized);
        router.replace({ pathname: '/redeem', params: { code: normalized } } as Href);
      } else {
        router.replace('/redeem' as Href);
      }
    })();
  }, [code, router]);

  return (
    <View style={styles.centered}>
      <ActivityIndicator color="#E8000A" size="large" />
      <Text style={styles.label}>Opening your gallery code…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: '#060606',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  label: {
    fontFamily: brandFonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5)',
  },
});
