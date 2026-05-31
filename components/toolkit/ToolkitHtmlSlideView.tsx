import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  InteractionManager,
  Pressable,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { resolveToolkitSlideHtml } from "../../data/toolkitSlideAssets";
import { brandColors } from "../../constants/theme";

interface ToolkitHtmlSlideViewProps {
  htmlPath: string;
  title?: string;
  onBack: () => void;
}

type WebViewComponent = React.ComponentType<{
  source: { html: string; baseUrl?: string };
  style: object;
  originWhitelist: string[];
  allowsInlineMediaPlayback?: boolean;
  javaScriptEnabled?: boolean;
  domStorageEnabled?: boolean;
  scrollEnabled?: boolean;
  setSupportMultipleWindows?: boolean;
  onError?: () => void;
  onHttpError?: () => void;
}>;

export function ToolkitHtmlSlideView({
  htmlPath,
  title,
  onBack,
}: ToolkitHtmlSlideViewProps) {
  const insets = useSafeAreaInsets();
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [WebView, setWebView] = useState<WebViewComponent | null>(null);
  const [webViewReady, setWebViewReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    resolveToolkitSlideHtml(htmlPath)
      .then((document) => {
        if (!cancelled) {
          setHtml(document);
          setError(document == null);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [htmlPath]);

  useEffect(() => {
    if (!html) return;

    let cancelled = false;
    const task = InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        try {
          const { WebView: NativeWebView } = require("react-native-webview");
          setWebView(() => NativeWebView);
          setWebViewReady(true);
        } catch {
          setError(true);
        }
      });
    });

    return () => {
      cancelled = true;
      task.cancel();
    };
  }, [html]);

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
            This cheat sheet could not be loaded. Go back and try again.
          </Text>
        </View>
      ) : html == null || !webViewReady || WebView == null ? (
        <View style={styles.centered}>
          <ActivityIndicator color={brandColors.alphaRed} />
        </View>
      ) : (
        <WebView
          source={{ html, baseUrl: "about:blank" }}
          style={styles.webview}
          originWhitelist={["*"]}
          allowsInlineMediaPlayback
          javaScriptEnabled={false}
          domStorageEnabled={false}
          scrollEnabled
          setSupportMultipleWindows={false}
          onError={() => setError(true)}
          onHttpError={() => setError(true)}
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
