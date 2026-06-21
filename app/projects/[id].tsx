import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProjects } from "@/hooks/useProjects";
import { StagePipeline } from "@/components/projects/StagePipeline";
import { checklistProgress, suggestStageFromChecklists } from "@/lib/projectPipeline";
import {
  CREATOR_STAGES,
  EVENT_TYPES,
  STAGE_HINTS,
  STAGE_LABELS,
  formatCents,
  formatIsoDate,
  type CreatorProjectStage,
} from "@/types/projects";

const C = {
  bg: "#060606",
  cell: "#171717",
  hairline: "rgba(255,255,255,0.07)",
  text: "#fff",
  muted: "rgba(255,255,255,0.5)",
  accent: "#E8000A",
  cyan: "#00d4ff",
} as const;

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    projects,
    activeProject,
    updateProjectMeta,
    markDepositReceived,
    markInvoiceSent,
    switchProject,
  } = useProjects();

  const project = useMemo(() => projects.find((p) => p.id === id), [projects, id]);
  const [description, setDescription] = useState(project?.meta.description ?? "");
  const [clientName, setClientName] = useState(project?.meta.clientName ?? "");
  const [shootDate, setShootDate] = useState(project?.meta.shootDate ?? "");
  const [targetDate, setTargetDate] = useState(project?.meta.targetCompletionDate ?? "");

  React.useEffect(() => {
    if (!project) return;
    setDescription(project.meta.description ?? "");
    setClientName(project.meta.clientName ?? "");
    setShootDate(project.meta.shootDate ?? "");
    setTargetDate(project.meta.targetCompletionDate ?? "");
  }, [project?.id]);

  if (!project) {
    return (
      <View style={[styles.root, { paddingTop: insets.top, alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ color: C.muted }}>Project not found.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: C.cyan }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const progress = checklistProgress(project.data);
  const suggested = suggestStageFromChecklists(project.meta, project.data);
  const isActive = activeProject?.id === project.id;

  const saveFields = () => {
    void updateProjectMeta(project.id, {
      description:          description.trim() || null,
      clientName:           clientName.trim() || null,
      shootDate:            shootDate.trim() || null,
      targetCompletionDate: targetDate.trim() || null,
    });
  };

  const setStage = (stage: CreatorProjectStage) => {
    void updateProjectMeta(project.id, { stage });
  };

  const openProduction = async () => {
    if (!isActive) await switchProject(project.id);
    router.push("/(tabs)/production" as Href);
  };

  return (
    <>
      <StatusBar style="light" />
      <ScrollView
        style={styles.root}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 40 }}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </Pressable>
          <Text style={styles.title} numberOfLines={1}>{project.name}</Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Pipeline</Text>
          <StagePipeline stage={project.meta.stage} />
          <Text style={styles.stageHint}>{STAGE_HINTS[project.meta.stage]}</Text>
          {suggested && suggested !== project.meta.stage ? (
            <Pressable
              style={styles.suggestBtn}
              onPress={() => setStage(suggested)}
            >
              <Text style={styles.suggestText}>
                Checklists suggest: {STAGE_LABELS[suggested]} — tap to update
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Update stage</Text>
          <View style={styles.stageGrid}>
            {CREATOR_STAGES.map((s) => {
              const active = s === project.meta.stage;
              return (
                <Pressable
                  key={s}
                  style={[styles.stageChip, active && styles.stageChipActive]}
                  onPress={() => setStage(s)}
                >
                  <Text style={[styles.stageChipText, active && styles.stageChipTextActive]}>
                    {STAGE_LABELS[s]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Details</Text>
          <Field label="Client">
            <TextInput
              value={clientName}
              onChangeText={setClientName}
              onBlur={saveFields}
              placeholder="Client or brand name"
              placeholderTextColor="#444"
              style={styles.input}
            />
          </Field>
          <Field label="Description">
            <TextInput
              value={description}
              onChangeText={setDescription}
              onBlur={saveFields}
              placeholder="Podcast ep 12, 3-camera interview…"
              placeholderTextColor="#444"
              style={[styles.input, styles.inputMulti]}
              multiline
            />
          </Field>
          <Field label="Event type">
            <View style={styles.chipRow}>
              {EVENT_TYPES.map((t) => {
                const active = t.id === project.meta.eventType;
                return (
                  <Pressable
                    key={t.id}
                    style={[styles.typeChip, active && styles.typeChipActive]}
                    onPress={() => void updateProjectMeta(project.id, { eventType: t.id })}
                  >
                    <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>{t.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>
          <Field label="Shoot date (YYYY-MM-DD)">
            <TextInput
              value={shootDate}
              onChangeText={setShootDate}
              onBlur={saveFields}
              placeholder="2026-06-15"
              placeholderTextColor="#444"
              style={styles.input}
              autoCapitalize="none"
            />
          </Field>
          <Field label="Target completion (YYYY-MM-DD)">
            <TextInput
              value={targetDate}
              onChangeText={setTargetDate}
              onBlur={saveFields}
              placeholder="2026-07-01"
              placeholderTextColor="#444"
              style={styles.input}
              autoCapitalize="none"
            />
          </Field>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Quote & billing</Text>
          {project.meta.quote ? (
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>
                Quote sent · {formatCents(project.meta.quote.totalCents)}
              </Text>
              <Text style={styles.infoSub}>
                {project.meta.quote.clientName} · {formatIsoDate(project.meta.quote.sentAt.slice(0, 10))}
              </Text>
            </View>
          ) : (
            <Text style={styles.mutedLine}>No quote linked — use Tools → Rate Calculator.</Text>
          )}

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Deposit received</Text>
            <Switch
              value={project.meta.depositReceived}
              onValueChange={(v) => void markDepositReceived(project.id, v)}
              trackColor={{ false: "#333", true: "rgba(74,222,128,0.4)" }}
              thumbColor={project.meta.depositReceived ? "#4ade80" : "#666"}
            />
          </View>

          {project.meta.invoiceSentAt ? (
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Invoice sent</Text>
              <Text style={styles.infoSub}>{formatIsoDate(project.meta.invoiceSentAt.slice(0, 10))}</Text>
            </View>
          ) : (
            <Pressable
              style={styles.actionBtn}
              onPress={() => {
                Alert.alert(
                  "Mark invoice sent?",
                  "Use this after you send the client their invoice outside the app.",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Mark sent", onPress: () => void markInvoiceSent(project.id) },
                  ],
                );
              }}
            >
              <Ionicons name="receipt-outline" size={18} color={C.cyan} />
              <Text style={styles.actionBtnText}>Mark invoice sent</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Production checklists</Text>
          <Text style={styles.mutedLine}>
            {progress.done}/{progress.total} tasks complete
            {isActive ? " · active project" : ""}
          </Text>
          <Pressable style={styles.primaryBtn} onPress={() => void openProduction()}>
            <Ionicons name="film-outline" size={18} color="#000" />
            <Text style={styles.primaryBtnText}>Open in Production tab</Text>
          </Pressable>
          {!isActive ? (
            <Pressable
              style={styles.secondaryBtn}
              onPress={() => void switchProject(project.id)}
            >
              <Text style={styles.secondaryBtnText}>Set as active project</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 6, marginBottom: 14 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  title: {
    flex: 1,
    fontFamily: "BebasNeue_400Regular",
    fontSize: 28,
    color: C.text,
    letterSpacing: 2,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    backgroundColor: C.cell,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.hairline,
    gap: 10,
  },
  sectionLabel: {
    fontFamily: "DMMono_400Regular",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: C.muted,
  },
  stageHint: { fontSize: 13, color: C.muted, lineHeight: 18 },
  suggestBtn: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(251,191,36,0.1)",
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.3)",
  },
  suggestText: { color: "#fbbf24", fontSize: 12, lineHeight: 17 },
  stageGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  stageChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.hairline,
  },
  stageChipActive: {
    borderColor: C.accent,
    backgroundColor: "rgba(232,0,10,0.12)",
  },
  stageChipText: { fontSize: 11, color: C.muted, fontWeight: "600" },
  stageChipTextActive: { color: "#fff" },
  fieldLabel: {
    fontFamily: "DMMono_400Regular",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: C.muted,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: C.hairline,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: C.text,
    fontSize: 15,
  },
  inputMulti: { minHeight: 72, textAlignVertical: "top" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typeChip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.hairline,
  },
  typeChipActive: { borderColor: C.cyan, backgroundColor: "rgba(0,212,255,0.1)" },
  typeChipText: { fontSize: 11, color: C.muted },
  typeChipTextActive: { color: C.cyan, fontWeight: "700" },
  infoBox: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    gap: 4,
  },
  infoTitle: { color: C.text, fontSize: 14, fontWeight: "700" },
  infoSub: { color: C.muted, fontSize: 12 },
  mutedLine: { color: C.muted, fontSize: 13, lineHeight: 18 },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  switchLabel: { color: C.text, fontSize: 14 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,212,255,0.35)",
  },
  actionBtnText: { color: C.cyan, fontWeight: "700", fontSize: 13 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: C.cyan,
    borderRadius: 12,
    paddingVertical: 14,
  },
  primaryBtnText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 13,
    textTransform: "uppercase",
  },
  secondaryBtn: { alignItems: "center", paddingVertical: 12 },
  secondaryBtnText: { color: C.muted, fontSize: 13, textDecorationLine: "underline" },
});
