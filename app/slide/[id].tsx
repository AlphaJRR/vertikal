import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { ToolkitCheatSheetContent } from "../../components/toolkit/ToolkitCheatSheetContent";
import { ToolkitSlideView } from "../../components/toolkit/ToolkitSlideView";
import { brandColors, brandFonts } from "../../constants/theme";
import { getCheatSheetCards } from "../../data/toolkitCheatSheetCards";
import { getSlideById } from "../../data/toolkitContent";
import { getLessonByHtmlSlideId } from "../../data/toolkitCurriculum";

export default function SlideDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const slideId = id ?? "";
  const cards = slideId ? getCheatSheetCards(slideId) : undefined;
  const curriculumLesson = slideId ? getLessonByHtmlSlideId(slideId) : undefined;
  const legacySlide = slideId ? getSlideById(slideId) : undefined;

  if (cards?.length) {
    const title = curriculumLesson?.title ?? legacySlide?.title ?? "Cheat Sheet";
    return (
      <ErrorBoundary>
        <ToolkitCheatSheetContent
          cards={cards}
          title={title}
          fallbackLesson={curriculumLesson}
          onBack={() => router.back()}
        />
      </ErrorBoundary>
    );
  }

  if (legacySlide) {
    return <ToolkitSlideView slide={legacySlide} onBack={() => router.back()} />;
  }

  return (
    <View style={[styles.missing, { paddingTop: insets.top }]}>
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
    backgroundColor: brandColors.avaBlack,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  missingTitle: {
    fontFamily: brandFonts.display,
    fontSize: 24,
    color: brandColors.pureWhite,
    marginBottom: 12,
  },
  back: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: brandColors.alphaRed,
  },
});
