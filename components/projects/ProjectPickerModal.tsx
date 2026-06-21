import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Project } from "@/hooks/useProjects";
import { STAGE_LABELS, eventTypeLabel, formatCents } from "@/types/projects";

interface ProjectPickerModalProps {
  visible:    boolean;
  projects:   Project[];
  onClose:    () => void;
  onSelect:   (projectId: string) => void;
  onCreateNew: () => void;
}

export function ProjectPickerModal({
  visible,
  projects,
  onClose,
  onSelect,
  onCreateNew,
}: ProjectPickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Link to project</Text>
          <Text style={styles.hint}>Save this quote to an existing shoot or create a new one.</Text>

          <ScrollView style={styles.list}>
            {projects.map((p) => (
              <Pressable key={p.id} style={styles.row} onPress={() => onSelect(p.id)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowName}>{p.name}</Text>
                  <Text style={styles.rowMeta}>
                    {STAGE_LABELS[p.meta.stage]}
                    {p.meta.clientName ? ` · ${p.meta.clientName}` : ""}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </Pressable>
            ))}
            {projects.length === 0 ? (
              <Text style={styles.empty}>No projects yet.</Text>
            ) : null}
          </ScrollView>

          <Pressable style={styles.newBtn} onPress={onCreateNew}>
            <Ionicons name="add" size={18} color="#000" />
            <Text style={styles.newBtnText}>Create new from quote</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function projectPickerSubtitle(p: Project): string {
  const parts = [STAGE_LABELS[p.meta.stage], eventTypeLabel(p.meta.eventType)];
  if (p.meta.quote) parts.push(formatCents(p.meta.quote.totalCents));
  return parts.join(" · ");
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#141414",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "70%",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  hint: {
    color: "#888",
    fontSize: 13,
    marginTop: 6,
    marginBottom: 14,
  },
  list: { maxHeight: 280 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  rowName: { color: "#fff", fontSize: 15, fontWeight: "600" },
  rowMeta: { color: "#888", fontSize: 12, marginTop: 2 },
  empty: { color: "#666", textAlign: "center", paddingVertical: 24 },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 14,
    backgroundColor: "#E8000A",
    borderRadius: 12,
    paddingVertical: 14,
  },
  newBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
    textTransform: "uppercase",
  },
});
