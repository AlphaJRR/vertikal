/**
 * BadgeOverlay - React Native Badge Component
 * Matches web badge credibility. Renders badge overlays on avatars/profile images.
 */

import React from "react";
import { Image, View, StyleSheet, ImageSourcePropType } from "react-native";
import { getBadgeSource } from "../../constants/badges";
import { Founding50Creator } from "../../utils/dataLoader";

interface BadgeOverlayProps {
  creator?: Founding50Creator;
  badgeSource?: ImageSourcePropType | null;
  size?: "sm" | "md" | "lg" | number;
}

export function BadgeOverlay({
  creator,
  badgeSource,
  size = "sm",
}: BadgeOverlayProps) {
  // Determine badge source
  let source: ImageSourcePropType | null = null;

  if (badgeSource) {
    source = badgeSource;
  } else if (creator) {
    // Determine badge type from creator
    if (creator.isFounding50) {
      source = getBadgeSource("founding50-gold");
    } else if (creator.type === "network") {
      source = getBadgeSource("network-titanium");
    }
  }

  if (!source) return null;

  // Map size prop to pixel value
  const sizePx =
    typeof size === "number"
      ? size
      : size === "sm"
      ? 20
      : size === "md"
      ? 26
      : 32; // lg

  const containerSize = sizePx + 8;

  return (
    <View style={[styles.wrap, { width: containerSize, height: containerSize }]}>
      <Image
        source={source}
        style={{ width: sizePx, height: sizePx }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    right: -2,
    top: -2,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
});
