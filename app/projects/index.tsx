import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useProjects } from "@/hooks/useProjects";
import type { Project } from "@/hooks/useProjects";

const C = {
  bg: "#060606",
  text: "#fff",
  muted: "rgba(255,255,255,0.5)",
  dim: "rgba(255,255,255,0.32)",
  accent: "#E8000A",
} as const;

export default function ProjectsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    projects,
    activeProject,
    loading,
    switchProject,
    renameProject,
    deleteProject,
    migrationBanner,
    dismissMigrationBanner,
  } = useProjects();
  const [, forceUpdate] = useState(0);

  const handleLongPress = (project: Project) => {
    Alert.alert(project.name, "What do you want to do?", [
      {
        text: "Open details",
        onPress: () => router.push(`/projects/${project.id}` as Href),
      },
      {
        text: "Set active",
        onPress: () => { void switchProject(project.id); },
      },
      {
        text: "Rename",
        onPress: () => {
          Alert.prompt(
            "Rename Project",
            "Enter a new name:",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Save",
                onPress: (name: string | undefined) => {
                  if (name?.trim()) void renameProject(project.id, name.trim());
                },
              },
            ],
            "plain-text",
            project.name,
          );
        },
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Alert.alert(
            "Delete Project",
            `Delete "${project.name}"? This cannot be undone.`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => { void deleteProject(project.id); },
              },
            ],
          );
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
    forceUpdate((n) => n + 1);
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={[s.root, { paddingTop: insets.top }]}>
        <View style={s.header}>
          <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </Pressable>
          <Text style={s.title}>MY PROJECTS</Text>
          <View style={{ width: 44 }} />
        </View>

        <Text style={s.subtitle}>
          Track each shoot from prospect to delivery — quotes, deposits, and checklists in one place.
        </Text>

        {migrationBanner ? (
          <View style={s.banner}>
            <Text style={s.bannerText}>
              Your checklists were saved as "My First Project"
            </Text>
            <Pressable onPress={dismissMigrationBanner} hitSlop={10}>
              <Ionicons name="close" size={18} color={C.muted} />
            </Pressable>
          </View>
        ) : null}

        <FlatList
          data={projects}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <ProjectCard
              project={item}
              isActive={item.id === activeProject?.id}
              onPress={() => router.push(`/projects/${item.id}` as Href)}
              onLongPress={() => handleLongPress(item)}
            />
          )}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: insets.bottom + 120 }}
          style={{ flex: 1 }}
          ListEmptyComponent={
            loading ? null : (
              <View style={s.emptyState}>
                <Ionicons name="folder-open-outline" size={48} color={C.dim} />
                <Text style={s.emptyText}>No projects yet.</Text>
                <Text style={s.emptySubtext}>Create one for each shoot you have on the books.</Text>
              </View>
            )
          }
        />

        <Pressable
          style={[s.fab, { bottom: insets.bottom + 32 }]}
          onPress={() => router.push("/projects/new" as Href)}
          hitSlop={8}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  backBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  title: {
    fontFamily: "BebasNeue_400Regular",
    fontSize: 30,
    color: C.text,
    letterSpacing: 3,
  },
  subtitle: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 13,
    lineHeight: 19,
    color: C.muted,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    backgroundColor: "rgba(232,0,10,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(232,0,10,0.25)",
    gap: 12,
  },
  bannerText: {
    flex: 1,
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 13,
    color: C.text,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 80,
    gap: 8,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 18,
    color: C.muted,
    marginTop: 8,
  },
  emptySubtext: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 14,
    color: C.dim,
    textAlign: "center",
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.accent,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});
