import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Paywall } from "../components/Paywall";
import { useAvaPro } from "../hooks/useAvaPro";

/**
 * Full-screen AVA Pro plans — visible without sign-in.
 * Purchase actions inside Paywall remain auth-gated.
 */
export default function ProScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { status, isSignedIn } = useAvaPro();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Paywall
        status={status}
        isSignedIn={isSignedIn}
        onBack={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
});
