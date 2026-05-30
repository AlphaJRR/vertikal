import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ToolkitHtmlSlideView } from "../../components/toolkit/ToolkitHtmlSlideView";
import { ToolkitSlideView } from "../../components/toolkit/ToolkitSlideView";
import { getSlideById } from "../../data/toolkitContent";
import { isBundledHtmlSlidePath } from "../../data/toolkitSlideAssets";

export default function SlideDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const slide = id ? getSlideById(id) : undefined;

  if (!slide) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingTitle}>Slide not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Go back</Text>
        </Pressable>
      </View>
    );
  }

  if (slide.htmlPath && isBundledHtmlSlidePath(slide.htmlPath)) {
    return (
      <ToolkitHtmlSlideView
        htmlPath={slide.htmlPath}
        title={slide.title}
        onBack={() => router.back()}
      />
    );
  }

  return <ToolkitSlideView slide={slide} onBack={() => router.back()} />;
}

const styles = StyleSheet.create({
  missing: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  missingTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 12 },
  back: { color: "#00d4ff", fontSize: 15, fontWeight: "600" },
});
