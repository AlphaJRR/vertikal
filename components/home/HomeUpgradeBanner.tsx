import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { presentAvaProPaywall } from "../../utils/presentAvaProPaywall";

interface HomeUpgradeBannerProps {
  isSignedIn: boolean;
  onActivated?: () => void;
}

/** Always-visible AVA Pro CTA for free users — not gated by session timers or cooldowns. */
export function HomeUpgradeBanner({
  isSignedIn,
  onActivated,
}: HomeUpgradeBannerProps) {
  const handlePress = () => {
    void presentAvaProPaywall({
      isSignedIn,
      source: "home_modal",
      onActivated,
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.banner, pressed && styles.bannerPressed]}
      accessibilityRole="button"
      accessibilityLabel="Upgrade to AVA Pro"
    >
      <View style={styles.iconWrap}>
        <Ionicons name="diamond-outline" size={18} color="#00d4ff" />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>Upgrade to AVA Pro</Text>
        <Text style={styles.subtitle}>
          Full Creators Toolkit · cheat sheets · pro tools
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#00d4ff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0,212,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(0,212,255,0.35)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bannerPressed: {
    opacity: 0.85,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,212,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 2,
  },
  subtitle: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    lineHeight: 15,
  },
});
