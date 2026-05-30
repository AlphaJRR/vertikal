import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** 2026 AVA app logo asset. */
const BRAND_LOGO = require("../assets/images/ava-app-logo-2026.png");

type BrandLogoBarProps = {
  /** Compact watermark vs slightly larger on home-adjacent screens */
  size?: "compact" | "standard";
};

export function BrandLogoBar({ size = "compact" }: BrandLogoBarProps) {
  const insets = useSafeAreaInsets();
  const dims = size === "standard" ? { width: 160, height: 56 } : { width: 132, height: 46 };

  return (
    <View
      style={[styles.wrap, { paddingTop: insets.top + 6 }]}
      accessibilityRole="image"
      accessibilityLabel="Alpha Visual Artists logo"
    >
      <Image
        source={BRAND_LOGO}
        style={[styles.logo, dims]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    backgroundColor: "transparent",
    paddingBottom: 6,
  },
  logo: {
    backgroundColor: "transparent",
  },
});
