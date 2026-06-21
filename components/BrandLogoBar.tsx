import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Circular lens logo — true alpha PNG (no baked-in background). */
const BRAND_LOGO = require("../assets/images/ava-logo-transparent.png");

type BrandLogoBarProps = {
  /** Compact watermark vs slightly larger on home-adjacent screens */
  size?: "compact" | "standard";
};

export function BrandLogoBar({ size = "compact" }: BrandLogoBarProps) {
  const insets = useSafeAreaInsets();
  const dims =
    size === "standard"
      ? { width: 200, height: 200 }
      : { width: 132, height: 132 };

  return (
    <View
      style={[styles.wrap, { paddingTop: insets.top + 6 }]}
      accessibilityRole="image"
      accessibilityLabel="Alpha Visual Artists logo"
    >
      <Image
        source={BRAND_LOGO}
        style={[styles.logo, dims]}
        contentFit="contain"
        transition={0}
        cachePolicy="memory-disk"
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
