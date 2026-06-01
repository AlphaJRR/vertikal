import React from "react";
import { StyleSheet, View } from "react-native";
import { useSegments } from "expo-router";
import { BrandLogoBar } from "./BrandLogoBar";

/** Wraps every tab screen so the AVA logo appears on all main pages. */
export function TabScreenLayout({ children }: { children: React.ReactNode }) {
  const segments = useSegments() as string[];
  const tab = segments.at(-1) ?? "";
  const isHome = tab === "index";

  return (
    <View style={styles.root}>
      {!isHome ? <BrandLogoBar /> : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },
  body: { flex: 1 },
});
