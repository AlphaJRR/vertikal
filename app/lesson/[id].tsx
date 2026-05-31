import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { brandColors, brandFonts } from "../../constants/theme";
import { getLessonById } from "../../data/toolkitCurriculum";
import { useSavedLessons } from "../../hooks/useSavedLessons";
import { toPlainLessonText } from "../../utils/plainLessonText";

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { toggleSaved, isSaved } = useSavedLessons();
  const lesson = id ? getLessonById(id) : undefined;

  if (!lesson) {
    return (
      <View style={[styles.root, styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.missingTitle}>Lesson not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>← Back</Text>
        </Pressable>
      </View>
    );
  }

  const saved = isSaved(lesson.id);
  const hasSlide =
    lesson.type === "html_presentation" &&
    (lesson.htmlSlideId != null || lesson.htmlSlidePath != null);
  const slideId = lesson.htmlSlideId ?? lesson.id;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.backLink}>← Back to lessons</Text>
        </Pressable>

        <Text style={styles.title}>{lesson.title}</Text>

        {hasSlide ? (
          <Pressable
            onPress={() => router.push(`/slide/${slideId}` as Href)}
            style={styles.slideBtn}
          >
            <Ionicons name="easel-outline" size={18} color={brandColors.pureWhite} />
            <Text style={styles.slideBtnText}>Open Cheat Sheet</Text>
            <Ionicons name="chevron-forward" size={16} color="#555555" />
          </Pressable>
        ) : null}

        {lesson.description ? (
          <>
            <Text style={styles.eyebrow}>Description</Text>
            <Text style={styles.body}>{toPlainLessonText(lesson.description)}</Text>
          </>
        ) : null}

        {lesson.guide ? (
          <>
            <Text style={styles.eyebrow}>The Guide</Text>
            <Text style={styles.body}>{toPlainLessonText(lesson.guide)}</Text>
          </>
        ) : null}

        {lesson.keyRule ? (
          <View style={styles.keyRule}>
            <Text style={styles.keyRuleLabel}>Key Rule</Text>
            <Text style={styles.keyRuleText}>{toPlainLessonText(lesson.keyRule)}</Text>
          </View>
        ) : null}

        {(lesson.steps?.length ?? 0) > 0 ? (
          <>
            <Text style={styles.sectionHeader}>How To Do It</Text>
            {lesson.steps.map((step, idx) => (
              <View key={`${lesson.id}-step-${idx}`} style={styles.stepRow}>
                <Text style={styles.stepNum}>{String(idx + 1).padStart(2, "0")}</Text>
                <Text style={styles.stepText}>{toPlainLessonText(step)}</Text>
              </View>
            ))}
          </>
        ) : null}

        {lesson.proTip ? (
          <>
            <Text style={styles.eyebrow}>Pro Tip</Text>
            <Text style={styles.body}>{toPlainLessonText(lesson.proTip)}</Text>
          </>
        ) : null}

        {lesson.commonMistake ? (
          <>
            <Text style={styles.eyebrow}>Common Mistake</Text>
            <Text style={styles.mutedBody}>{toPlainLessonText(lesson.commonMistake)}</Text>
          </>
        ) : null}

        <Pressable
          onPress={() => toggleSaved(lesson.id)}
          style={[styles.saveBtn, saved && styles.saveBtnActive]}
        >
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={18}
            color={saved ? brandColors.alphaRed : brandColors.pureWhite}
          />
          <Text style={styles.saveBtnText}>
            {saved ? "Saved for later" : "Save for later"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: brandColors.avaBlack,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  missingTitle: {
    fontFamily: brandFonts.display,
    fontSize: 24,
    color: brandColors.pureWhite,
    marginBottom: 16,
  },
  backLink: {
    fontFamily: brandFonts.bodyMedium,
    fontSize: 14,
    color: brandColors.alphaRed,
    marginBottom: 16,
  },
  title: {
    fontFamily: brandFonts.display,
    fontSize: 32,
    color: brandColors.pureWhite,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  slideBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: brandColors.alphaRed,
    backgroundColor: "rgba(232, 0, 10, 0.1)",
  },
  slideBtnText: {
    flex: 1,
    fontFamily: brandFonts.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: brandColors.pureWhite,
  },
  eyebrow: {
    fontFamily: brandFonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: brandColors.alphaRed,
    marginBottom: 8,
    marginTop: 8,
  },
  sectionHeader: {
    fontFamily: brandFonts.display,
    fontSize: 22,
    color: brandColors.alphaRed,
    textTransform: "uppercase",
    marginTop: 16,
    marginBottom: 14,
  },
  body: {
    fontFamily: brandFonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: brandColors.secondaryText,
    marginBottom: 16,
  },
  mutedBody: {
    fontFamily: brandFonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: brandColors.mutedText,
    marginBottom: 16,
  },
  keyRule: {
    borderLeftWidth: 3,
    borderLeftColor: brandColors.alphaRed,
    backgroundColor: brandColors.graphite,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  keyRuleLabel: {
    fontFamily: brandFonts.display,
    fontSize: 18,
    color: brandColors.alphaRed,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  keyRuleText: {
    fontFamily: brandFonts.bodySemiBold,
    fontSize: 15,
    lineHeight: 22,
    color: brandColors.pureWhite,
  },
  stepRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  stepNum: {
    fontFamily: brandFonts.display,
    fontSize: 18,
    color: brandColors.alphaRed,
    width: 24,
  },
  stepText: {
    flex: 1,
    fontFamily: brandFonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: brandColors.secondaryText,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: brandColors.borderGray,
    backgroundColor: brandColors.graphite,
  },
  saveBtnActive: {
    borderColor: brandColors.alphaRed,
    backgroundColor: "rgba(232, 0, 10, 0.12)",
  },
  saveBtnText: {
    fontFamily: brandFonts.mono,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: brandColors.pureWhite,
  },
});
