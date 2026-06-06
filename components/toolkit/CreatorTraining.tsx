import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  getCategoriesByTab,
  TOOLKIT_TABS,
  toolkitLessonCount,
  ToolkitTab,
} from "../../data/toolkitCurriculum";
import { isLessonProLocked } from "../../constants/proAccess";
import { useAvaPro } from "../../hooks/useAvaPro";
import { showProUpgradeAlert } from "../../utils/showProUpgradeAlert";
import { ProLockBadge } from "./ProLockBadge";
import { creatorTrainingStyles as s } from "./creatorTrainingStyles";

export function CreatorTraining() {
  const router = useRouter();
  const { status, isPro, isSignedIn } = useAvaPro();
  const [activeTab, setActiveTab] = useState<ToolkitTab>("camera");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const categories = getCategoriesByTab(activeTab);
  const tabLessonCount = categories.reduce(
    (total, category) => total + category.lessons.length,
    0,
  );

  useEffect(() => {
    setExpandedCategories(new Set());
  }, [activeTab]);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openLesson = (lessonId: string) => {
    if (status === "loading") return;
    const locked = !isPro && isLessonProLocked(lessonId);
    if (locked) {
      showProUpgradeAlert(isSignedIn, "lesson");
      return;
    }
    router.push(`/lesson/${lessonId}` as Href);
  };

  return (
    <ScrollView
      style={s.trainingScroll}
      contentContainerStyle={s.trainingScrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={s.sectionHeader}>
        <Text style={s.sectionEyebrow}>Creator Training</Text>
        <Text style={s.sectionTitle}>Creators Toolkit</Text>
        <Text style={s.sectionSubtitle}>
          {toolkitLessonCount} lessons · {TOOLKIT_TABS.length} tracks · HTML slide
          decks
        </Text>
      </View>

      <View style={s.tabBar}>
        {TOOLKIT_TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[s.tab, active && s.tabActive]}
            >
              <Text style={[s.tabLabel, active && s.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={s.tabMeta}>{tabLessonCount} lessons in this track</Text>

      {categories.map((cat) => {
        const open = expandedCategories.has(cat.id);
        return (
          <View key={cat.id} style={s.categoryPanel}>
            <Pressable onPress={() => toggleCategory(cat.id)} style={s.categoryHeader}>
              <View style={s.categoryHeaderLeft}>
                <Text style={s.categoryEyebrow}>{cat.eyebrow}</Text>
                <Text style={s.categoryTitle}>{cat.title}</Text>
                <View style={s.categoryDivider}>
                  <View style={s.dividerLine} />
                  <View style={s.dividerDot} />
                  <View style={s.dividerLine} />
                </View>
              </View>
              <Ionicons
                name={open ? "chevron-up" : "chevron-down"}
                size={20}
                color="#555555"
              />
            </Pressable>

            {open ? (
              <View style={s.lessonList}>
                {cat.lessons.map((lesson) => {
                  const locked = !isPro && isLessonProLocked(lesson.id);
                  return (
                    <Pressable
                      key={lesson.id}
                      onPress={() => openLesson(lesson.id)}
                      style={[s.lessonCard, locked && s.lessonCardLocked]}
                    >
                      <View style={s.lessonBadge}>
                        <Text style={s.lessonBadgeText}>{lesson.number}</Text>
                      </View>
                      <View style={s.lessonBody}>
                        <Text
                          style={[s.lessonTitle, locked && s.lessonTitleLocked]}
                        >
                          {lesson.title}
                        </Text>
                        <Text style={s.lessonDesc} numberOfLines={2}>
                          {lesson.description}
                        </Text>
                      </View>
                      <View style={s.lessonCardRight}>
                        {locked ? (
                          <>
                            <ProLockBadge compact />
                            <Ionicons
                              name="lock-closed"
                              size={16}
                              color="#00BFFF"
                            />
                          </>
                        ) : (
                          <Ionicons name="chevron-forward" size={16} color="#555555" />
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}
