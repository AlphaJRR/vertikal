import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Paywall } from "../components/Paywall";
import { FREE_LAUNCH } from "../constants/proAccess";
import { useAvaPro } from "../hooks/useAvaPro";

/**
 * Full-screen AVA Pro plans — visible without sign-in.
 * Purchase actions inside Paywall remain auth-gated.
 * Anonymous RevenueCat configure happens here only (not in PurchasesBootstrap).
 */
export default function ProScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { status, isSignedIn } = useAvaPro();
  const [anonymousRcReady, setAnonymousRcReady] = useState(isSignedIn);

  useEffect(() => {
    if (FREE_LAUNCH || isSignedIn) {
      setAnonymousRcReady(true);
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const { initPurchases } = await import("../lib/purchases");
        await initPurchases();
      } catch (error) {
        console.error("[ProScreen] anonymous initPurchases failed:", error);
      } finally {
        if (!cancelled) {
          setAnonymousRcReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {anonymousRcReady ? (
        <Paywall
          status={status}
          isSignedIn={isSignedIn}
          onBack={() => router.back()}
        />
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator color="#00BFFF" size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
