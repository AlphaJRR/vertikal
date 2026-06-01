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
import { shouldPlayAppIntro } from "@/utils/introVideoGate";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
const SITE_URL = "https://alphavisualartists.com";
const SITE_HOSTS = new Set([
  "alphavisualartists.com",
  "www.alphavisualartists.com",
  "shop.alphavisualartists.com",
]);

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
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="lesson/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="cheatsheet/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="slide/[id]" options={{ headerShown: false }} />
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

  const finishIntro = useCallback(() => {
    setIntroGate("skip");
  }, []);

  useEffect(() => {
    if (__DEV__) {
      console.log("[EAS Update] expo-updates unavailable in development mode");
      return;
    }

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
        console.log("[EAS Update] update downloaded, reloading");
        await Updates.reloadAsync();
      } catch (error) {
        console.warn("[EAS Update] check/fetch failed", error);
      }
    }

    void fetchProductionUpdate();
  }, []);

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
    const handle = (linkUrl: string | null | undefined) => {
      if (!linkUrl) return;
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
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              {introGate === "loading" ? (
                <View style={styles.bootScreen} />
              ) : null}
              {showMainApp ? <RootLayoutNav /> : null}
              {introGate === "show" ? (
                <AppIntroVideo onFinish={finishIntro} />
              ) : null}
            </KeyboardProvider>
          </GestureHandlerRootView>
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
});
