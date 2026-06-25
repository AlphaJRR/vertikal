import React, { ComponentType, PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { ErrorFallbackProps } from "@/components/ErrorFallback";

function makeSectionFallback(
  sectionName: string,
): ComponentType<ErrorFallbackProps> {
  return function SectionFailed({ error }: ErrorFallbackProps) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.title}>Section failed: {sectionName}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {error.message}
        </Text>
      </View>
    );
  };
}

type SectionErrorBoundaryProps = PropsWithChildren<{
  name: string;
}>;

/** Isolates a Home section — one crash must not blank the whole screen. */
export function SectionErrorBoundary({
  name,
  children,
}: SectionErrorBoundaryProps) {
  return (
    <ErrorBoundary FallbackComponent={makeSectionFallback(name)}>
      {children}
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "rgba(232,0,10,0.12)",
    borderWidth: 1,
    borderColor: "rgba(232,0,10,0.55)",
  },
  title: {
    color: "#ff6b6b",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 4,
  },
  message: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    lineHeight: 15,
  },
});
