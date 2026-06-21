import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Project } from "@/hooks/useProjects";
import { checklistProgress } from "@/lib/projectPipeline";
import { StagePipeline } from "@/components/projects/StagePipeline";
import {
  STAGE_COLORS,
  STAGE_LABELS,
  eventTypeLabel,
  formatCents,
  formatIsoDate,
} from "@/types/projects";

interface ProjectCardProps {
  project:   Project;
  isActive:  boolean;
  onPress:   () => void;
  onLongPress?: () => void;
}

export function ProjectCard({ project, isActive, onPress, onLongPress }: ProjectCardProps) {
  const { meta } = project;
  const progress = checklistProgress(project.data);
  const stageColor = STAGE_COLORS[meta.stage];

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, isActive && styles.active]}
    >
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>{project.name}</Text>
          <Text style={styles.subline} numberOfLines={1}>
            {[meta.clientName, eventTypeLabel(meta.eventType)].filter(Boolean).join(" · ") || "No client yet"}
          </Text>
        </View>
        {isActive ? (
          <View style={styles.activePill}>
            <Text style={styles.activePillText}>ACTIVE</Text>
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
        )}
      </View>

      {meta.description ? (
        <Text style={styles.description} numberOfLines={2}>{meta.description}</Text>
      ) : null}

      <View style={[styles.stageBadge, { borderColor: `${stageColor}55` }]}>
        <View style={[styles.stageDot, { backgroundColor: stageColor }]} />
        <Text style={[styles.stageText, { color: stageColor }]}>{STAGE_LABELS[meta.stage]}</Text>
      </View>

      <StagePipeline stage={meta.stage} compact />

      <View style={styles.metaRow}>
        {meta.shootDate ? (
          <MetaChip icon="calendar-outline" label={`Shoot ${formatIsoDate(meta.shootDate)}`} />
        ) : null}
        {meta.targetCompletionDate ? (
          <MetaChip icon="flag-outline" label={`Due ${formatIsoDate(meta.targetCompletionDate)}`} />
        ) : null}
        {meta.quote ? (
          <MetaChip icon="document-text-outline" label={`Quote ${formatCents(meta.quote.totalCents)}`} />
        ) : null}
        {meta.depositReceived ? (
          <MetaChip icon="checkmark-circle" label="Deposit" accent />
        ) : null}
        {meta.invoiceSentAt ? (
          <MetaChip icon="receipt-outline" label="Invoiced" accent />
        ) : null}
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress.percent}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {progress.done}/{progress.total} tasks
        </Text>
      </View>
    </Pressable>
  );
}

function MetaChip({
  icon,
  label,
  accent,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  accent?: boolean;
}) {
  return (
    <View style={[styles.chip, accent && styles.chipAccent]}>
      <Ionicons name={icon} size={11} color={accent ? "#4ade80" : "rgba(255,255,255,0.5)"} />
      <Text style={[styles.chipText, accent && styles.chipTextAccent]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#171717",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    gap: 10,
  },
  active: {
    borderColor: "rgba(232,0,10,0.45)",
  },
  pressed: { opacity: 0.85 },
  topRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  name: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 17,
    color: "#fff",
  },
  subline: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },
  description: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 13,
    lineHeight: 18,
    color: "rgba(255,255,255,0.65)",
  },
  stageBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  stageDot: { width: 6, height: 6, borderRadius: 3 },
  stageText: {
    fontFamily: "DMMono_400Regular",
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  chipAccent: { backgroundColor: "rgba(74,222,128,0.1)" },
  chipText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    fontFamily: "SpaceGrotesk_400Regular",
  },
  chipTextAccent: { color: "#4ade80" },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#00d4ff" },
  progressText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.45)",
    fontFamily: "DMMono_400Regular",
  },
  activePill: {
    backgroundColor: "#E8000A",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  activePillText: {
    fontFamily: "DMMono_400Regular",
    fontSize: 8,
    color: "#fff",
    letterSpacing: 1,
  },
});
