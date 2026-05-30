import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getCategoriesByTab,
  TOOLKIT_TABS,
  ToolkitLesson,
  ToolkitTab,
} from "../../data/toolkitCurriculum";
import { useSavedLessons } from "../../hooks/useSavedLessons";
import { creatorTrainingStyles as s } from "./creatorTrainingStyles";
import { LessonExpandedView } from "./LessonExpandedView";

export function CreatorTraining() {
  const [activeTab, setActiveTab] = useState<ToolkitTab>("camera");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [selectedLesson, setSelectedLesson] = useState<ToolkitLesson | null>(null);
  const { toggleSaved, isSaved } = useSavedLessons();

  const categories = getCategoriesByTab(activeTab);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <Text style={s.sectionEyebrow}>Creator Training</Text>
        <Text style={s.sectionTitle}>Creators Toolkit</Text>
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
                {cat.lessons.map((lesson) => (
                  <Pressable
                    key={lesson.id}
                    onPress={() => setSelectedLesson({ ...lesson, saved: isSaved(lesson.id) })}
                    style={s.lessonCard}
                  >
                    <View style={s.lessonBadge}>
                      <Text style={s.lessonBadgeText}>{lesson.number}</Text>
                    </View>
                    <View style={s.lessonBody}>
                      <Text style={s.lessonTitle}>{lesson.title}</Text>
                      <Text style={s.lessonDesc} numberOfLines={2}>
                        {lesson.description}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#555555" />
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}

      <Modal
        visible={selectedLesson !== null}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setSelectedLesson(null)}
      >
        {selectedLesson ? (
          <LessonExpandedView
            lesson={selectedLesson}
            saved={isSaved(selectedLesson.id)}
            onBack={() => setSelectedLesson(null)}
            onToggleSave={() => toggleSaved(selectedLesson.id)}
          />
        ) : null}
      </Modal>
    </View>
  );
}
