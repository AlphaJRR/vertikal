import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { resolveToolkitHtmlUri } from "../../data/toolkitSlideAssets";
import { brandColors } from "../../constants/theme";

interface ToolkitHtmlSlideViewProps {
  htmlPath: string;
  title?: string;
  onBack: () => void;
}

export function ToolkitHtmlSlideView({
  htmlPath,
  title,
  onBack,
}: ToolkitHtmlSlideViewProps) {
  const insets = useSafeAreaInsets();
  const [uri, setUri] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    resolveToolkitHtmlUri(htmlPath)
      .then((resolved) => {
        if (!cancelled) {
          setUri(resolved);
          setError(resolved == null);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [htmlPath]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.toolbar}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>
        {title ? <Text style={styles.title} numberOfLines={1}>{title}</Text> : null}
      </View>

      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Presentation unavailable</Text>
          <Text style={styles.errorBody}>
            This cheat sheet is not bundled in the app yet.
          </Text>
        </View>
      ) : uri == null ? (
        <View style={styles.centered}>
          <ActivityIndicator color={brandColors.alphaRed} />
        </View>
      ) : (
        <WebView
          source={{ uri }}
          style={styles.webview}
          originWhitelist={["*"]}
          allowsInlineMediaPlayback
          javaScriptEnabled
          domStorageEnabled
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  back: {
    color: "#00d4ff",
    fontSize: 15,
    fontWeight: "600",
  },
  title: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  webview: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  errorBody: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
