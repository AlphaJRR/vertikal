import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProjects } from "../../hooks/useProjects";
import { EVENT_TYPES } from "@/types/projects";

const C = {
  bg: "#060606",
  cell: "#171717",
  hairline: "rgba(255,255,255,0.07)",
  text: "#fff",
  dim: "rgba(255,255,255,0.32)",
  accent: "#E8000A",
} as const;

export default function NewProjectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createProject } = useProjects();

  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("commercial");
  const [shootDate, setShootDate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    setError(null);
    try {
      const project = await createProject({
        name: trimmed,
        clientName: clientName.trim() || undefined,
        description: description.trim() || undefined,
        eventType,
        shootDate: shootDate.trim() || null,
        targetCompletionDate: targetDate.trim() || null,
      });
      if (project) {
        router.replace(`/projects/${project.id}` as Href);
        return;
      }
      setError("Could not create project. Run migration 013 in Supabase if this keeps failing.");
    } catch (err) {
      console.error("[NewProjectScreen] createProject failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={[s.root, { paddingTop: insets.top }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={s.header}>
          <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </Pressable>
          <Text style={s.title}>NEW PROJECT</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
          <Field label="Project name *">
            <TextInput
              style={s.input}
              value={name}
              onChangeText={setName}
              placeholder="Brand commercial Q2"
              placeholderTextColor={C.dim}
              autoFocus
              maxLength={80}
            />
          </Field>

          <Field label="Client">
            <TextInput
              style={s.input}
              value={clientName}
              onChangeText={setClientName}
              placeholder="Acme Corp"
              placeholderTextColor={C.dim}
            />
          </Field>

          <Field label="Description">
            <TextInput
              style={[s.input, s.inputMulti]}
              value={description}
              onChangeText={setDescription}
              placeholder="2-day shoot, interview + B-roll…"
              placeholderTextColor={C.dim}
              multiline
            />
          </Field>

          <Field label="Event type">
            <View style={s.chipRow}>
              {EVENT_TYPES.map((t) => {
                const active = t.id === eventType;
                return (
                  <Pressable
                    key={t.id}
                    style={[s.chip, active && s.chipActive]}
                    onPress={() => setEventType(t.id)}
                  >
                    <Text style={[s.chipText, active && s.chipTextActive]}>{t.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label="Shoot date (YYYY-MM-DD)">
            <TextInput
              style={s.input}
              value={shootDate}
              onChangeText={setShootDate}
              placeholder="2026-06-15"
              placeholderTextColor={C.dim}
              autoCapitalize="none"
            />
          </Field>

          <Field label="Target completion (YYYY-MM-DD)">
            <TextInput
              style={s.input}
              value={targetDate}
              onChangeText={setTargetDate}
              placeholder="2026-07-01"
              placeholderTextColor={C.dim}
              autoCapitalize="none"
            />
          </Field>

          {error ? <Text style={s.errorText}>{error}</Text> : null}

          <Pressable
            style={[s.createBtn, (!name.trim() || saving) && s.createBtnDisabled]}
            onPress={() => void handleCreate()}
            disabled={!name.trim() || saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={s.createBtnText}>Create Project</Text>
              </>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 6, marginBottom: 16 }}>
      <Text style={s.label}>{label}</Text>
      {children}
    </View>
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
    fontSize: 28,
    color: C.text,
    letterSpacing: 3,
  },
  body: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  label: {
    fontFamily: "DMMono_400Regular",
    fontSize: 10,
    color: C.dim,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: C.cell,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: C.text,
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 16,
    borderWidth: 1,
    borderColor: C.hairline,
  },
  inputMulti: { minHeight: 80, textAlignVertical: "top" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.hairline,
  },
  chipActive: { borderColor: "#E8000A", backgroundColor: "rgba(232,0,10,0.12)" },
  chipText: { fontSize: 11, color: C.dim },
  chipTextActive: { color: "#fff", fontWeight: "700" },
  errorText: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 13,
    color: "#fbbf24",
    lineHeight: 18,
    marginBottom: 12,
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: C.accent,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  createBtnDisabled: { opacity: 0.4 },
  createBtnText: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 15,
    color: "#fff",
    letterSpacing: 0.5,
  },
});
