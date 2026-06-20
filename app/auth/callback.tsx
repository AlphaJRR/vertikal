/**
 * Auth callback route — target of Supabase magic-link redirects.
 * Deep link: ava://auth/callback#access_token=...&refresh_token=...
 *
 * The actual session extraction is handled in app/_layout.tsx
 * (handleAuthCallback) which fires before this screen renders.
 * This screen is a visual fallback shown briefly while the session
 * is being set and the AuthProvider re-renders.
 *
 * In practice users see this for < 1 second, then the app routes
 * them to /consent (new account) or /(tabs) (returning user).
 */

import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { brandColors, brandFonts } from "@/constants/theme";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Poll for session — _layout.tsx sets it asynchronously from the URL
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        clearInterval(interval);
        // Check consent
        const { data: profile } = await supabase
          .from("profiles")
          .select("tos_accepted_at")
          .eq("id", session.user.id)
          .single();

        if (!profile?.tos_accepted_at) {
          router.replace("/consent" as Href);
        } else {
          router.replace("/(tabs)" as Href);
        }
        return;
      }

      // Give up after 10 seconds — something went wrong
      if (attempts > 20) {
        clearInterval(interval);
        router.replace("/sign-in" as Href);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ActivityIndicator color="#00BFFF" size="large" />
      <Text style={styles.label}>Signing you in…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  label: {
    fontFamily: brandFonts.body,
    fontSize: 15,
    color: brandColors.subtleText,
  },
});
