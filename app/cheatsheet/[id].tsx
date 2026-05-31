import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { ToolkitCheatSheetContent } from "../../components/toolkit/ToolkitCheatSheetContent";
import { brandColors, brandFonts } from "../../constants/theme";
import { getCheatSheetCards } from "../../data/toolkitCheatSheetCards";
import { getLessonById } from "../../data/toolkitCurriculum";

export default function CheatSheetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const lesson = id ? getLessonById(id) : undefined;
  const cards = lesson?.htmlSlideId ? getCheatSheetCards(lesson.htmlSlideId) : undefined;

  if (!lesson) {
    return (
      <View style={[styles.missing, { paddingTop: insets.top }]}>
        <Text style={styles.missingTitle}>Lesson not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Go back</Text>
        </Pressable>
      </View>
    );
  }

  if (!lesson.htmlSlideId || !cards?.length) {
    return (
      <View style={[styles.missing, { paddingTop: insets.top }]}>
        <Text style={styles.missingTitle}>Cheat sheet unavailable</Text>
        <Text style={styles.missingBody}>This lesson has no bundled cheat sheet yet.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <ToolkitCheatSheetContent
        cards={cards}
        title={lesson.title}
        fallbackLesson={lesson}
        onBack={() => router.back()}
      />
    </ErrorBoundary>
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
    textAlign: "center",
  },
  missingBody: {
    fontFamily: brandFonts.body,
    fontSize: 15,
    color: brandColors.mutedText,
    textAlign: "center",
    marginBottom: 20,
  },
  back: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: brandColors.alphaRed,
  },
});
