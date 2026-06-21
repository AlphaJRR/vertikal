import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import { DMMono_400Regular } from "@expo-google-fonts/dm-mono";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
} from "@expo-google-fonts/space-grotesk";
import { useFonts } from "expo-font";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as ExpoLinking from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppIntroVideo } from "@/components/AppIntroVideo";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PurchasesBootstrap } from "@/components/PurchasesBootstrap";
import { AuthProvider } from "@/contexts/AuthContext";
import { hydrateDemoMode } from "@/lib/demoMode";
import { supabase } from "@/lib/supabase";
import { parseRedeemCodeFromUrl } from "@/lib/redeemDeepLink";
import { markAppIntroPlayed, shouldPlayAppIntro } from "@/utils/introVideoGate";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
const SITE_URL = "https://alphavisualartists.com";
const SITE_HOSTS = new Set([
  "alphavisualartists.com",
  "www.alphavisualartists.com",
  "shop.alphavisualartists.com",
]);

// ava:// deep link paths that should be handled by Expo Router in-app,
// NOT redirected to the marketing site browser.
const IN_APP_PATHS = new Set([
  "attendee",
  "gallery",
  "events",
  "consent",
  "settings",
  "redeem",
  "photo-release",
  "auth",      // auth/callback — Supabase magic link redirect target
  "r",         // ava://r/CODE — redeem deep link (custom scheme fallback)
]);

// Universal link redeem paths must stay in-app (expo-router), not open the browser.
function isRedeemUniversalLink(linkUrl: string): boolean {
  return parseRedeemCodeFromUrl(linkUrl) != null;
}

// Returns true for ava:// deep links that should be handled in-app by Expo Router
function isInAppDeepLink(linkUrl: string): boolean {
  if (!linkUrl.startsWith("ava://")) return false;
  const parsed = ExpoLinking.parse(linkUrl);
  const topSegment = (parsed.hostname ?? parsed.path?.split("/")[1] ?? "").toLowerCase();
  return IN_APP_PATHS.has(topSegment);
}

// Convert any inbound link (custom scheme or universal link) to a full https
// URL on the marketing site. Preserves path, query, and fragment.
function toSiteUrl(linkUrl: string): string | null {
  try {
    if (linkUrl.startsWith("http://") || linkUrl.startsWith("https://")) {
      return linkUrl;
    }
    const parsed = ExpoLinking.parse(linkUrl);
    // For ava://portal, expo-linking puts "portal" in hostname; for ava:///foo
    // it puts "foo" in path. Combine both so all forms route correctly.
    const segments: string[] = [];
    if (parsed.hostname) segments.push(parsed.hostname);
    if (parsed.path) segments.push(parsed.path.replace(/^\/+/, ""));
    const path = segments.filter(Boolean).join("/");

    let qs = "";
    if (parsed.queryParams) {
      const entries = Object.entries(parsed.queryParams).filter(
        ([, v]) => v !== undefined && v !== null,
      );
      if (entries.length > 0) {
        qs =
          "?" +
          entries
            .map(([k, v]) => {
              const value = Array.isArray(v) ? v.join(",") : String(v);
              return `${encodeURIComponent(k)}=${encodeURIComponent(value)}`;
            })
            .join("&");
      }
    }
    return `${SITE_URL}/${path}${qs}`;
  } catch {
    return null;
  }
}

function openInBrowser(url: string) {
  WebBrowser.openBrowserAsync(url, {
    toolbarColor: "#0a0a0a",
    controlsColor: "#00d4ff",
  }).catch(() => {});
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      {/* ── Existing screens ───────────────────────────────────────── */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="lesson/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="cheatsheet/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="slide/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      {/* ── Event Photo Delivery MVP screens ──────────────────────── */}
      <Stack.Screen name="consent" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
      <Stack.Screen name="redeem" options={{ headerShown: false }} />
      <Stack.Screen name="r/[code]" options={{ headerShown: false }} />
      <Stack.Screen name="attendee/join" options={{ headerShown: false }} />
      <Stack.Screen name="gallery" options={{ headerShown: false }} />
      <Stack.Screen name="events/create" options={{ headerShown: false }} />
      <Stack.Screen name="events/[id]/index" options={{ headerShown: false }} />
      <Stack.Screen name="events/[id]/upload" options={{ headerShown: false }} />
      <Stack.Screen name="events/[id]/assign" options={{ headerShown: false }} />
      <Stack.Screen name="events/[id]/create-attendee" options={{ headerShown: false }} />
      <Stack.Screen name="events/[id]/dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="photo-release" options={{ headerShown: false }} />
      {/* ── More / Account section screens ────────────────────────── */}
      <Stack.Screen name="projects/index" options={{ headerShown: false }} />
      <Stack.Screen name="projects/new" options={{ headerShown: false }} />
      <Stack.Screen name="projects/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="how-to" options={{ headerShown: false }} />
      <Stack.Screen name="tutorial" options={{ headerShown: false }} />
      <Stack.Screen name="tutorial/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="faq" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    BebasNeue_400Regular,
    DMMono_400Regular,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
  });
  const handledInitial = useRef(false);
  const [introGate, setIntroGate] = useState<"loading" | "show" | "skip">("loading");

  useEffect(() => {
    void hydrateDemoMode();
  }, []);

  const finishIntro = useCallback(() => {
    void markAppIntroPlayed().finally(() => {
      setIntroGate("skip");
    });
  }, []);

  useEffect(() => {
    // Never check/reload OTA during the intro — reloadAsync was resetting users back to the logo.
    if (__DEV__ || introGate !== "skip") return;

    async function fetchProductionUpdate() {
      if (!Updates.isEnabled) {
        console.log("[EAS Update] updates disabled for this build");
        return;
      }

      console.log("[EAS Update]", {
        updateId: Updates.updateId,
        runtimeVersion: Updates.runtimeVersion,
        channel: Updates.channel,
        isEmbeddedLaunch: Updates.isEmbeddedLaunch,
        createdAt: Updates.createdAt?.toISOString() ?? null,
      });

      try {
        const result = await Updates.checkForUpdateAsync();
        if (!result.isAvailable) {
          console.log("[EAS Update] app is on the latest published update");
          return;
        }

        console.log("[EAS Update] downloading update…");
        await Updates.fetchUpdateAsync();
        // Stage only — reloadAsync mid-session caused intro loops and blank screens.
        console.log("[EAS Update] update staged for next cold start");
      } catch (error) {
        console.warn("[EAS Update] check/fetch failed", error);
      }
    }

    const timer = setTimeout(() => {
      void fetchProductionUpdate();
    }, 3000);

    return () => clearTimeout(timer);
  }, [introGate]);

  useEffect(() => {
    if (!fontsLoaded && !fontError) return;

    let cancelled = false;
    shouldPlayAppIntro()
      .then((play) => {
        if (!cancelled) setIntroGate(play ? "show" : "skip");
      })
      .catch(() => {
        if (!cancelled) setIntroGate("show");
      });

    return () => {
      cancelled = true;
    };
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if ((fontsLoaded || fontError) && introGate !== "loading") {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, introGate]);

  // Handle deep links at the root so all unmatched inbound URLs (custom
  // scheme + universal links) route to the in-app browser.
  useEffect(() => {
    // Supabase magic-link auth callback.
    // When the user taps the link in their email, Supabase redirects to:
    //   ava://auth/callback#access_token=...&refresh_token=...&type=email
    // We extract the tokens and set the session directly — no redirect needed.
    const handleAuthCallback = async (url: string): Promise<boolean> => {
      if (!url.includes("access_token")) return false;
      try {
        // Tokens arrive in the URL fragment (#) or query string
        const fragment = url.includes("#") ? url.split("#")[1] : url.split("?")[1] ?? "";
        const params = new URLSearchParams(fragment);
        const accessToken  = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        if (!accessToken || !refreshToken) return false;

        const { error } = await supabase.auth.setSession({
          access_token:  accessToken,
          refresh_token: refreshToken,
        });
        if (error) {
          console.error("[auth-callback] setSession failed:", error.message);
          return false;
        }
        console.log("[auth-callback] session set from magic link ✓");
        return true;
      } catch (err) {
        console.error("[auth-callback] unexpected error:", err);
        return false;
      }
    };

    const handle = (linkUrl: string | null | undefined) => {
      if (!linkUrl) return;
      // Handle Supabase magic link auth callbacks first (async, non-blocking)
      if (linkUrl.includes("access_token")) {
        void handleAuthCallback(linkUrl);
        return;
      }
      // Universal link /r/:code — handled by expo-router (app/r/[code].tsx)
      if (isRedeemUniversalLink(linkUrl)) return;
      // Let Expo Router handle in-app deep links natively
      if (isInAppDeepLink(linkUrl)) return;
      const target = toSiteUrl(linkUrl);
      if (!target) return;
      // Skip the bare site root from cold start — that's the default launch.
      if (target === `${SITE_URL}/` || target === SITE_URL) return;
      // Skip universal links that aren't for our hosts.
      if (linkUrl.startsWith("http")) {
        try {
          const u = new URL(linkUrl);
          if (!SITE_HOSTS.has(u.hostname)) return;
        } catch {
          return;
        }
      }
      openInBrowser(target);
    };

    ExpoLinking.getInitialURL().then((url) => {
      if (handledInitial.current) return;
      handledInitial.current = true;
      handle(url);
    });
    const sub = ExpoLinking.addEventListener("url", (e) => handle(e.url));
    return () => sub.remove();
  }, []);

  if (!fontsLoaded && !fontError) return null;

  const showMainApp = introGate === "skip";

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <PurchasesBootstrap />
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                {introGate === "loading" ? (
                  <View style={styles.bootScreen} />
                ) : null}
                {showMainApp ? (
                  <View style={styles.mainShell}>
                    <RootLayoutNav />
                  </View>
                ) : null}
                {introGate === "show" ? (
                  <AppIntroVideo onFinish={finishIntro} />
                ) : null}
              </KeyboardProvider>
            </GestureHandlerRootView>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  bootScreen: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  mainShell: {
    flex: 1,
  },
});
