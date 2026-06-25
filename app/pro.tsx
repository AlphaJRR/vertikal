import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Paywall } from "../components/Paywall";
import { FREE_LAUNCH } from "../constants/proAccess";
import { useAuth } from "../contexts/AuthContext";
import { useAvaPro } from "../hooks/useAvaPro";

/**
 * Full-screen AVA Pro plans — visible without sign-in.
 * Purchase actions inside Paywall remain auth-gated.
 * Anonymous RevenueCat configure happens here only (not in PurchasesBootstrap).
 */
export default function ProScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { status, isSignedIn } = useAvaPro();
  const [rcReady, setRcReady] = useState(false);

  useEffect(() => {
    if (FREE_LAUNCH) {
      setRcReady(true);
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const { initPurchases } = await import("../lib/purchases");
        await initPurchases(user?.id ?? null);
      } catch (error) {
        console.error("[ProScreen] initPurchases failed:", error);
      } finally {
        if (!cancelled) {
          setRcReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {rcReady ? (
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
