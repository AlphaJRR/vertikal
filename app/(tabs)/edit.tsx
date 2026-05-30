import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

type Item = { id: string; text: string; done: boolean };

const STORAGE_KEY = "ava_edit_v1";

const SEED = [
  "Offload + back up all cards (3-2-1 rule)",
  "Create project, set sequence to delivery res/fps",
  "Import & label bins: A-cam, B-cam, audio, B-roll, music",
  "Sync audio with PluralEyes / multicam clip",
  "Watch every clip — flag selects + circle takes",
  "Build storyboard / paper edit on the timeline",
  "String-out rough cut to music",
  "Tighten to picture lock — kill 20% of length",
  "Send v1 to client for notes",
  "Apply color: balance → contrast → grade → look",
  "Mix audio: dialogue -12 LUFS, music -24, SFX taste",
  "Add titles, lower thirds, end card",
  "Sound design pass + room tone fills",
  "Final QC: full-screen watch, headphones on",
  "Export masters: 16:9 H.264, 9:16, 1:1, ProRes archive",
  "Upload deliverables to portal + archive project",
];

export default function EditScreen() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setItems(JSON.parse(raw));
        } else {
          setItems(
            SEED.map((text, i) => ({
              id: `seed-${i}`,
              text,
              done: false,
            })),
          );
        }
      } catch {
        setItems([]);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items, loaded]);

  const remaining = useMemo(
    () => items.filter((i) => !i.done).length,
    [items],
  );
  const total = items.length;
  const pct = total === 0 ? 0 : Math.round(((total - remaining) / total) * 100);

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setItems((s) => [{ id: `${Date.now()}`, text, done: false }, ...s]);
    setDraft("");
  };

  const toggle = (id: string) => {
    Haptics.selectionAsync().catch(() => {});
    setItems((s) =>
      s.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
    );
  };

  const remove = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setItems((s) => s.filter((i) => i.id !== id));
  };

  const clearDone = () => {
    const doneCount = items.filter((s) => s.done).length;
    if (doneCount === 0) return;
    Alert.alert("Clear completed?", `Remove ${doneCount} item(s).`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => setItems((s) => s.filter((x) => !x.done)),
      },
    ]);
  };

  const resetSeed = () => {
    Alert.alert("Reset workflow?", "Replaces list with default edit pipeline.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () =>
          setItems(
            SEED.map((text, i) => ({
              id: `seed-${i}-${Date.now()}`,
              text,
              done: false,
            })),
          ),
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.root}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={[styles.header, { paddingTop: 12 }]}>
        <Text style={styles.eyebrow}>Post Production</Text>
        <Text style={styles.h1}>Edit</Text>
        <Text style={styles.sub}>Log → cut → color → deliver</Text>

        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.progressTxt}>
            {remaining} left · {pct}%
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {items.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="cut-outline" size={48} color="#333" />
            <Text style={styles.emptyTxt}>
              Empty workflow. Add a task or load the default pipeline.
            </Text>
            <Pressable onPress={resetSeed} style={styles.resetBtn}>
              <Text style={styles.resetTxt}>Load Default Pipeline</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {items.map((s) => (
              <View key={s.id} style={styles.row}>
                <Pressable
                  onPress={() => toggle(s.id)}
                  style={[styles.check, s.done && styles.checkDone]}
                  hitSlop={8}
                >
                  {s.done && (
                    <Ionicons name="checkmark" size={16} color="#000" />
                  )}
                </Pressable>
                <Text
                  style={[styles.shotTxt, s.done && styles.shotTxtDone]}
                  onPress={() => toggle(s.id)}
                >
                  {s.text}
                </Text>
                <Pressable onPress={() => remove(s.id)} hitSlop={10}>
                  <Ionicons name="close" size={20} color="#555" />
                </Pressable>
              </View>
            ))}

            <View style={styles.actionsRow}>
              {items.some((s) => s.done) && (
                <Pressable onPress={clearDone} style={styles.smallBtn}>
                  <Ionicons name="trash-outline" size={14} color="#aaa" />
                  <Text style={styles.smallBtnTxt}>Clear Done</Text>
                </Pressable>
              )}
              <Pressable onPress={resetSeed} style={styles.smallBtn}>
                <Ionicons name="refresh-outline" size={14} color="#aaa" />
                <Text style={styles.smallBtnTxt}>Reset</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>

      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Add an edit task…"
          placeholderTextColor="#555"
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={add}
          blurOnSubmit={false}
        />
        <Pressable
          onPress={add}
          style={({ pressed }) => [
            styles.addBtn,
            pressed && { opacity: 0.7 },
            !draft.trim() && { opacity: 0.4 },
          ]}
          disabled={!draft.trim()}
        >
          <Ionicons name="add" size={26} color="#000" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  eyebrow: {
    color: "#00d4ff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  h1: { color: "#fff", fontSize: 32, fontWeight: "800", letterSpacing: -0.5 },
  sub: { color: "#888", fontSize: 13, marginTop: 4, marginBottom: 14 },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#00d4ff" },
  progressTxt: { color: "#888", fontSize: 11, fontWeight: "600" },
  list: { flex: 1, marginTop: 8 },
  empty: { alignItems: "center", paddingVertical: 60, gap: 16 },
  emptyTxt: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
    maxWidth: 240,
  },
  resetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "rgba(0,212,255,0.1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,212,255,0.3)",
  },
  resetTxt: { color: "#00d4ff", fontWeight: "700", fontSize: 13 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  checkDone: { backgroundColor: "#00d4ff", borderColor: "#00d4ff" },
  shotTxt: { flex: 1, color: "#eee", fontSize: 15, lineHeight: 21 },
  shotTxtDone: { color: "#555", textDecorationLine: "line-through" },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    flexWrap: "wrap",
  },
  smallBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  smallBtnTxt: {
    color: "#aaa",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  inputBar: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    backgroundColor: "#0a0a0a",
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#00d4ff",
    alignItems: "center",
    justifyContent: "center",
  },
});
