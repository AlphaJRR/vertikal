import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, type Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ToolkitLesson } from "../../data/toolkitCurriculum";
import { brandColors } from "../../constants/theme";
import { parseLessonTextField } from "../../utils/lessonContentParser";
import { creatorTrainingStyles as s } from "./creatorTrainingStyles";
import { LessonGuideImage } from "./LessonGuideImage";
import { LessonRichText } from "./LessonRichText";

export interface LessonExpandedViewProps {
  lesson: ToolkitLesson;
  saved: boolean;
  onBack: () => void;
  onToggleSave: () => void;
  onOpenLesson?: (lessonId: string) => void;
}

export function LessonExpandedView({
  lesson,
  saved,
  onBack,
  onToggleSave,
  onOpenLesson,
}: LessonExpandedViewProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isHtmlPresentation =
    lesson.type === "html_presentation" &&
    (lesson.htmlSlideId != null || lesson.htmlSlidePath != null);
  const presentationSlideId = lesson.htmlSlideId ?? undefined;

  const openPresentation = () => {
    if (presentationSlideId) {
      router.push(`/slide/${presentationSlideId}` as Href);
    }
  };

  const parsedGuide = lesson.guide ? parseLessonTextField(lesson.guide) : null;
  const guideImagePath =
    lesson.imageAfterGuide ?? parsedGuide?.imagePath;
  const guideImageAlt = lesson.imageAlt ?? parsedGuide?.imageAlt;

  const hasRichContent =
    lesson.guide != null ||
    lesson.keyRule != null ||
    lesson.proTip != null ||
    lesson.commonMistake != null;

  const showLegacyPlaceholder =
    !guideImagePath &&
    lesson.images.length === 0 &&
    hasRichContent;

  return (
    <View style={[s.expandedOverlay, { paddingTop: insets.top }]}>
      <ScrollView
        style={s.expandedScroll}
        contentContainerStyle={[
          s.expandedContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={onBack}>
          <Text style={s.backLink}>← Back to lessons</Text>
        </Pressable>

        <Text style={s.expandedTitle}>{lesson.title}</Text>

        {isHtmlPresentation ? (
          <Pressable onPress={openPresentation} style={s.presentationBtn}>
            <Ionicons
              name="easel-outline"
              size={18}
              color={brandColors.pureWhite}
            />
            <Text style={s.presentationBtnText}>Open Cheat Sheet</Text>
            <Ionicons name="chevron-forward" size={16} color="#555555" />
          </Pressable>
        ) : null}

        {lesson.description ? (
          <>
            <Text style={s.lessonSectionEyebrow}>Description</Text>
            <LessonRichText
              text={lesson.description}
              style={s.expandedDescription}
              linkStyle={s.guidedLinkText}
              onOpenLesson={onOpenLesson}
            />
          </>
        ) : null}

        {lesson.guide ? (
          <>
            <Text style={s.lessonSectionEyebrow}>The Guide</Text>
            <LessonRichText
              text={parsedGuide?.cleanText ?? lesson.guide}
              style={s.guideText}
              linkStyle={s.guidedLinkText}
              onOpenLesson={onOpenLesson}
            />
          </>
        ) : null}

        {guideImagePath ? (
          <LessonGuideImage path={guideImagePath} alt={guideImageAlt} />
        ) : null}

        {lesson.keyRule ? (
          <View style={s.keyRuleBlock}>
            <Text style={s.keyRuleLabel}>Key Rule</Text>
            <LessonRichText
              text={lesson.keyRule}
              style={s.keyRuleText}
              linkStyle={s.guidedLinkText}
              onOpenLesson={onOpenLesson}
            />
          </View>
        ) : null}

        {lesson.images.length > 0 ? (
          lesson.images.map((uri) => (
            <LessonGuideImage key={uri} path={uri} />
          ))
        ) : showLegacyPlaceholder ? (
          <View style={s.imagePlaceholder} />
        ) : null}

        {lesson.steps.length > 0 ? (
          <>
            <Text style={s.howToHeader}>How To Do It</Text>
            {lesson.steps.map((step, idx) => (
              <View key={idx} style={s.stepRow}>
                <Text style={s.stepNum}>{String(idx + 1).padStart(2, "0")}</Text>
                <LessonRichText
                  text={step}
                  style={s.stepText}
                  linkStyle={s.guidedLinkText}
                  onOpenLesson={onOpenLesson}
                />
              </View>
            ))}
          </>
        ) : null}

        {lesson.proTip ? (
          <View style={s.proTipBlock}>
            <Text style={s.lessonSectionEyebrow}>Pro Tip</Text>
            <LessonRichText
              text={lesson.proTip}
              style={s.proTipText}
              linkStyle={s.guidedLinkText}
              onOpenLesson={onOpenLesson}
            />
          </View>
        ) : null}

        {lesson.commonMistake ? (
          <View style={s.commonMistakeBlock}>
            <Text style={s.commonMistakeEyebrow}>Common Mistake</Text>
            <LessonRichText
              text={lesson.commonMistake}
              style={s.commonMistakeText}
              linkStyle={s.guidedLinkText}
              onOpenLesson={onOpenLesson}
            />
          </View>
        ) : null}

        <Pressable
          onPress={onToggleSave}
          style={[s.saveBtn, saved && s.saveBtnActive]}
        >
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={18}
            color={saved ? brandColors.alphaRed : brandColors.pureWhite}
          />
          <Text style={s.saveBtnText}>
            {saved ? "Saved for later" : "Save for later"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
