import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ToolkitLesson } from "../../data/toolkitCurriculum";
import { brandColors } from "../../constants/theme";
import { creatorTrainingStyles as s } from "./creatorTrainingStyles";

interface LessonExpandedViewProps {
  lesson: ToolkitLesson;
  saved: boolean;
  onBack: () => void;
  onToggleSave: () => void;
}

export function LessonExpandedView({
  lesson,
  saved,
  onBack,
  onToggleSave,
}: LessonExpandedViewProps) {
  const insets = useSafeAreaInsets();

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

        <Text style={s.howToHeader}>How To Do It</Text>
        <Text style={s.expandedTitle}>{lesson.title}</Text>

        {lesson.images.length > 0 ? (
          lesson.images.map((uri) => (
            <Image
              key={uri}
              source={{ uri }}
              style={s.imagePlaceholder}
              resizeMode="cover"
            />
          ))
        ) : (
          <View style={s.imagePlaceholder} />
        )}

        {lesson.steps.map((step, idx) => (
          <View key={idx} style={s.stepRow}>
            <Text style={s.stepNum}>{String(idx + 1).padStart(2, "0")}</Text>
            <Text style={s.stepText}>{step}</Text>
          </View>
        ))}

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
