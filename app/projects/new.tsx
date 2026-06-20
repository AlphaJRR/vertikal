import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

export default function NewProjectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createProject } = useProjects();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      const project = await createProject(trimmed);
      if (project) {
        router.replace("/projects" as Href);
      }
    } catch (err) {
      console.error("[NewProjectScreen] createProject failed:", err);
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
        {/* Header */}
        <View style={s.header}>
          <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </Pressable>
          <Text style={s.title}>NEW PROJECT</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={s.body}>
          <Text style={s.label}>PROJECT NAME</Text>
          <TextInput
            style={s.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Wedding Season 2026"
            placeholderTextColor={C.dim}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleCreate}
            maxLength={80}
          />

          <Pressable
            style={[s.createBtn, (!name.trim() || saving) && s.createBtnDisabled]}
            onPress={handleCreate}
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
        </View>
      </KeyboardAvoidingView>
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
    fontSize: 28,
    color: C.text,
    letterSpacing: 3,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  label: {
    fontFamily: "DMMono_400Regular",
    fontSize: 10,
    color: C.dim,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  input: {
    backgroundColor: C.cell,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: C.text,
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 16,
    borderWidth: 1,
    borderColor: C.hairline,
    marginBottom: 24,
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: C.accent,
    borderRadius: 12,
    paddingVertical: 16,
  },
  createBtnDisabled: {
    opacity: 0.4,
  },
  createBtnText: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 15,
    color: "#fff",
    letterSpacing: 0.5,
  },
});
