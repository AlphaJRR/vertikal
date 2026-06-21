import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import type { Project } from "@/hooks/useProjects";

interface ProjectScopeBarProps {
  activeProject: Project | null;
  projects:      Project[];
  loading:         boolean;
  onSwitch:        (id: string) => void;
}

export function ProjectScopeBar({
  activeProject,
  projects,
  loading,
  onSwitch,
}: ProjectScopeBarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const label = loading
    ? "Loading projects…"
    : activeProject?.name ?? "No project selected";

  return (
    <>
      <Pressable
        style={styles.bar}
        onPress={() => setOpen(true)}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Switch production project"
      >
        <Ionicons name="folder-outline" size={16} color="#00d4ff" />
        <Text style={styles.label} numberOfLines={1}>{label}</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#00d4ff" />
        ) : (
          <Ionicons name="chevron-down" size={16} color="#888" />
        )}
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
            <Text style={styles.sheetTitle}>Production project</Text>
            <Text style={styles.sheetHint}>
              Each shoot gets its own checklist — switch between podcast, commercial, etc.
            </Text>

            <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
              {projects.map(p => {
                const active = p.id === activeProject?.id;
                return (
                  <Pressable
                    key={p.id}
                    style={[styles.row, active && styles.rowActive]}
                    onPress={() => {
                      onSwitch(p.id);
                      setOpen(false);
                    }}
                  >
                    <Text style={[styles.rowName, active && styles.rowNameActive]} numberOfLines={1}>
                      {p.name}
                    </Text>
                    {active ? (
                      <Ionicons name="checkmark-circle" size={18} color="#00d4ff" />
                    ) : null}
                  </Pressable>
                );
              })}

              {projects.length === 0 ? (
                <Text style={styles.empty}>No projects yet — create one below.</Text>
              ) : null}
            </ScrollView>

            <Pressable
              style={styles.newBtn}
              onPress={() => {
                setOpen(false);
                router.push("/projects/new" as Href);
              }}
            >
              <Ionicons name="add-circle-outline" size={18} color="#000" />
              <Text style={styles.newBtnText}>New project</Text>
            </Pressable>

            <Pressable style={styles.manageBtn} onPress={() => {
              setOpen(false);
              router.push("/projects" as Href);
            }}>
              <Text style={styles.manageBtnText}>Manage all projects</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  label: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#141414",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: "70%",
  },
  sheetTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sheetHint: {
    color: "#888",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 14,
  },
  list: { maxHeight: 280 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  rowActive: {
    backgroundColor: "rgba(0,212,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(0,212,255,0.25)",
  },
  rowName: {
    flex: 1,
    color: "#ccc",
    fontSize: 15,
    fontWeight: "600",
  },
  rowNameActive: { color: "#fff" },
  empty: {
    color: "#666",
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 20,
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
    backgroundColor: "#00d4ff",
    borderRadius: 12,
    paddingVertical: 14,
  },
  newBtnText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  manageBtn: {
    alignItems: "center",
    paddingVertical: 14,
  },
  manageBtnText: {
    color: "#888",
    fontSize: 13,
    textDecorationLine: "underline",
  },
});
