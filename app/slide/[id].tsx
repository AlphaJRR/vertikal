import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { ToolkitNativeCheatSheetView } from "../../components/toolkit/ToolkitNativeCheatSheetView";
import { ToolkitSlideView } from "../../components/toolkit/ToolkitSlideView";
import { getSlideById } from "../../data/toolkitContent";
import { getLessonByHtmlSlideId } from "../../data/toolkitCurriculum";
import { isBundledHtmlSlidePath } from "../../data/toolkitSlidePaths";

export default function SlideDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const slide = id ? getSlideById(id) : undefined;
  const curriculumLesson = id ? getLessonByHtmlSlideId(id) : undefined;

  if (slide) {
    if (slide.htmlPath && isBundledHtmlSlidePath(slide.htmlPath)) {
      return (
        <ErrorBoundary>
          <ToolkitNativeCheatSheetView
            htmlPath={slide.htmlPath}
            htmlSlideId={slide.id}
            title={slide.title}
            fallbackLesson={curriculumLesson}
            onBack={() => router.back()}
          />
        </ErrorBoundary>
      );
    }

    return <ToolkitSlideView slide={slide} onBack={() => router.back()} />;
  }

  if (
    curriculumLesson?.htmlSlidePath &&
    isBundledHtmlSlidePath(curriculumLesson.htmlSlidePath)
  ) {
    return (
      <ErrorBoundary>
        <ToolkitNativeCheatSheetView
          htmlPath={curriculumLesson.htmlSlidePath}
          htmlSlideId={curriculumLesson.htmlSlideId ?? id}
          title={curriculumLesson.title}
          fallbackLesson={curriculumLesson}
          onBack={() => router.back()}
        />
      </ErrorBoundary>
    );
  }

  return (
    <View style={styles.missing}>
      <Text style={styles.missingTitle}>Slide not found</Text>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Go back</Text>
      </Pressable>
    </View>
  );
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
