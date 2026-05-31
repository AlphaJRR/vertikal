import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { brandColors, brandFonts } from "../../constants/theme";

export type ToolsErrorFallbackProps = {
  error: Error;
  resetError: () => void;
};

/** Lightweight fallback — no theme hooks that can fail during error recovery. */
export function ToolsErrorFallback({ resetError }: ToolsErrorFallbackProps) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Tools unavailable</Text>
      <Text style={styles.message}>
        Something went wrong loading this screen. Tap retry or switch tabs and come back.
      </Text>
      <Pressable onPress={resetError} style={styles.button}>
        <Text style={styles.buttonText}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: brandColors.avaBlack,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    minHeight: 280,
  },
  title: {
    fontFamily: brandFonts.display,
    fontSize: 28,
    color: brandColors.pureWhite,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  message: {
    fontFamily: brandFonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: brandColors.subtleText,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: brandColors.alphaRed,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: brandFonts.bodySemiBold,
    fontSize: 15,
    color: brandColors.pureWhite,
  },
});
