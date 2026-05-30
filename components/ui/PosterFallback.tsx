/**
 * PosterFallback - Synthetic Poster Generator
 * Never shows broken images. Generates premium-looking posters from any string.
 */

import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function hashHue(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

interface PosterFallbackProps {
  title: string;
  chip?: string;
  height?: number;
}

export function PosterFallback({
  title,
  chip = "VERTIKAL ORIGINAL",
  height = 180,
}: PosterFallbackProps) {
  const hue = useMemo(() => hashHue(title || "VERTIKAL"), [title]);

  // Deterministic gradient based on title hash
  const colors = useMemo(() => {
    const a = `hsl(${hue}, 70%, 18%)`;
    const b = `hsl(${(hue + 35) % 360}, 70%, 10%)`;
    return [a, b];
  }, [hue]);

  return (
    <LinearGradient colors={colors} style={[styles.wrap, { height }]}>
      <View style={styles.chip}>
        <Text style={styles.chipText}>{chip}</Text>
      </View>
      <Text numberOfLines={2} style={styles.title}>
        {title || "UNTITLED"}
      </Text>
      <Text style={styles.sub}>Vertical Cinema</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    borderRadius: 14,
    padding: 12,
    justifyContent: "flex-end",
  },
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  chipText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  title: {
    marginTop: 8,
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  sub: {
    marginTop: 6,
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "600",
  },
});
