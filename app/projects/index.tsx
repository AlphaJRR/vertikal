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
import { useProjects } from "../../hooks/useProjects";
import type { Project } from "../../hooks/useProjects";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#060606",
  card: "#141414",
  cell: "#171717",
  hairline: "rgba(255,255,255,0.07)",
  text: "#fff",
  muted: "rgba(255,255,255,0.5)",
  dim: "rgba(255,255,255,0.32)",
  accent: "#E8000A",
} as const;

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

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
                  if (name?.trim()) {
                    renameProject(project.id, name.trim()).catch((err) =>
                      console.error("[ProjectsScreen] rename failed:", err),
                    );
                  }
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
                onPress: () => {
                  deleteProject(project.id).catch((err) =>
                    console.error("[ProjectsScreen] delete failed:", err),
                  );
                },
              },
            ],
          );
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
    // Suppress unused warning
    forceUpdate((n) => n + 1);
  };

  const renderItem = ({ item, index }: { item: Project; index: number }) => {
    const isActive = item.id === activeProject?.id;
    return (
      <Pressable
        onPress={() => {
          switchProject(item.id).catch((err) =>
            console.error("[ProjectsScreen] switchProject failed:", err),
          );
        }}
        onLongPress={() => handleLongPress(item)}
        style={({ pressed }) => [
          s.projectRow,
          index > 0 && s.projectRowBorder,
          pressed && s.pressed,
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={s.projectName}>{item.name}</Text>
          <Text style={s.projectMeta}>
            Last edited {formatDate(item.updated_at)}
          </Text>
        </View>
        <View style={s.projectRight}>
          {isActive && (
            <View style={s.activePill}>
              <Text style={s.activePillText}>ACTIVE</Text>
            </View>
          )}
          <Ionicons
            name="chevron-forward"
            size={16}
            color={isActive ? C.accent : C.dim}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={[s.root, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={s.header}>
          <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </Pressable>
          <Text style={s.title}>PROJECTS</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Migration banner */}
        {migrationBanner && (
          <View style={s.banner}>
            <Text style={s.bannerText}>
              Your checklists were saved as "My First Project"
            </Text>
            <Pressable onPress={dismissMigrationBanner} hitSlop={10}>
              <Ionicons name="close" size={18} color={C.muted} />
            </Pressable>
          </View>
        )}

        {/* List */}
        <FlatList
          data={projects}
          keyExtractor={(p) => p.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
          style={{ flex: 1 }}
          ListEmptyComponent={
            loading ? null : (
              <View style={s.emptyState}>
                <Ionicons name="folder-open-outline" size={48} color={C.dim} />
                <Text style={s.emptyText}>No projects yet.</Text>
                <Text style={s.emptySubtext}>Tap + to create one.</Text>
              </View>
            )
          }
        />

        {/* FAB */}
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
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "BebasNeue_400Regular",
    fontSize: 30,
    color: C.text,
    letterSpacing: 3,
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
  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.cell,
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 64,
  },
  projectRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.hairline,
  },
  pressed: {
    opacity: 0.65,
  },
  projectName: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 16,
    color: C.text,
    marginBottom: 3,
  },
  projectMeta: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 12,
    color: C.muted,
  },
  projectRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  activePill: {
    backgroundColor: C.accent,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activePillText: {
    fontFamily: "DMMono_400Regular",
    fontSize: 9,
    color: "#fff",
    letterSpacing: 1.5,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 8,
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
