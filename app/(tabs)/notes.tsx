import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

type Phase = "pre" | "day" | "post";

type Shot = { id: string; text: string; done: boolean };

const PHASES: { key: Phase; label: string; subtitle: string }[] = [
  { key: "pre", label: "Pre-Prod", subtitle: "Plan the shoot" },
  { key: "day", label: "Day Of", subtitle: "Roll cameras" },
  { key: "post", label: "Post", subtitle: "Wrap & deliver" },
];

const STORAGE_KEYS: Record<Phase, string> = {
  pre: "ava_shoot_pre_v1",
  day: "ava_shoot_day_v1",
  post: "ava_shoot_post_v1",
};

const SEEDS: Record<Phase, string[]> = {
  pre: [
    "Lock concept + creative brief with client",
    "Build shot list / storyboard",
    "Scout location (light, sound, power)",
    "Confirm talent + wardrobe",
    "Pull permits + insurance if needed",
    "Send call sheet 24h ahead",
    "Pack gear: cameras, lenses, audio, lights",
    "Charge ALL batteries, format ALL cards",
  ],
  day: [
    "Arrive 30 min early — scout sun + outlets",
    "Set up audio first, monitor levels",
    "White balance + expose for skin tones",
    "Slate every take (scene + take #)",
    "Capture B-roll: wide, medium, detail",
    "Get safety takes — always one more",
    "Back up cards to SSD before leaving set",
    "Confirm talent release signed",
  ],
  post: [
    "Offload + back up footage (3-2-1 rule)",
    "Sync audio, organize bins by scene",
    "String-out selects, build rough cut",
    "Lock picture, send to client for notes",
    "Color grade + mix audio",
    "Render masters: 16:9, 9:16, 1:1",
    "Upload to client portal for approval",
    "Archive project to cold storage",
  ],
};

export default function ShootScreen() {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>("pre");
  const [data, setData] = useState<Record<Phase, Shot[]>>({
    pre: [],
    day: [],
    post: [],
  });
  const [loaded, setLoaded] = useState<Record<Phase, boolean>>({
    pre: false,
    day: false,
    post: false,
  });
  const [draft, setDraft] = useState("");
  const inputRef = useRef<TextInput>(null);

  const dismissKeyboard = useCallback(() => {
    inputRef.current?.blur();
    Keyboard.dismiss();
  }, []);

  // Load each phase from storage on mount
  useEffect(() => {
    (async () => {
      const next: Record<Phase, Shot[]> = { pre: [], day: [], post: [] };
      for (const p of ["pre", "day", "post"] as Phase[]) {
        try {
          const raw = await AsyncStorage.getItem(STORAGE_KEYS[p]);
          if (raw) {
            next[p] = JSON.parse(raw);
          } else {
            next[p] = SEEDS[p].map((text, i) => ({
              id: `seed-${p}-${i}`,
              text,
              done: false,
            }));
          }
        } catch {
          next[p] = [];
        }
      }
      setData(next);
      setLoaded({ pre: true, day: true, post: true });
    })();
  }, []);

  // Persist whenever a loaded phase changes
  useEffect(() => {
    (Object.keys(loaded) as Phase[]).forEach((p) => {
      if (loaded[p]) {
        AsyncStorage.setItem(STORAGE_KEYS[p], JSON.stringify(data[p])).catch(
          () => {},
        );
      }
    });
  }, [data, loaded]);

  const items = data[phase];
  const remaining = useMemo(() => items.filter((i) => !i.done).length, [items]);
  const total = items.length;
  const pct = total === 0 ? 0 : Math.round(((total - remaining) / total) * 100);

  const switchPhase = (p: Phase) => {
    dismissKeyboard();
    Haptics.selectionAsync().catch(() => {});
    setPhase(p);
    setDraft("");
  };

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setData((d) => ({
      ...d,
      [phase]: [{ id: `${Date.now()}`, text, done: false }, ...d[phase]],
    }));
    setDraft("");
  };

  const toggle = (id: string) => {
    dismissKeyboard();
    Haptics.selectionAsync().catch(() => {});
    setData((d) => ({
      ...d,
      [phase]: d[phase].map((s) =>
        s.id === id ? { ...s, done: !s.done } : s,
      ),
    }));
  };

  const remove = (id: string) => {
    dismissKeyboard();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setData((d) => ({
      ...d,
      [phase]: d[phase].filter((s) => s.id !== id),
    }));
  };

  const clearDone = () => {
    dismissKeyboard();
    const doneCount = items.filter((s) => s.done).length;
    if (doneCount === 0) return;
    Alert.alert(
      "Clear completed?",
      `Remove ${doneCount} checked item${doneCount > 1 ? "s" : ""}.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () =>
            setData((d) => ({
              ...d,
              [phase]: d[phase].filter((s) => !s.done),
            })),
        },
      ],
    );
  };

  const resetSeed = () => {
    dismissKeyboard();
    Alert.alert(
      "Reset to defaults?",
      "Replaces this list with the starter checklist.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () =>
            setData((d) => ({
              ...d,
              [phase]: SEEDS[phase].map((text, i) => ({
                id: `seed-${phase}-${i}-${Date.now()}`,
                text,
                done: false,
              })),
            })),
        },
      ],
    );
  };

  const activePhase = PHASES.find((p) => p.key === phase)!;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.root}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
        <View style={styles.flex}>
      <View style={[styles.header, { paddingTop: 12 }]}>
        <Text style={styles.eyebrow}>Production</Text>
        <Text style={styles.h1}>Shoot</Text>
        <Text style={styles.sub}>{activePhase.subtitle}</Text>

        {/* Segmented control */}
        <View style={styles.seg}>
          {PHASES.map((p) => {
            const active = p.key === phase;
            return (
              <Pressable
                key={p.key}
                onPress={() => switchPhase(p.key)}
                style={[styles.segBtn, active && styles.segBtnActive]}
              >
                <Text
                  style={[styles.segTxt, active && styles.segTxtActive]}
                >
                  {p.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Progress */}
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
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={dismissKeyboard}
      >
        {items.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="add-circle-outline" size={48} color="#333" />
            <Text style={styles.emptyTxt}>
              Empty list. Add an item below or reset to defaults.
            </Text>
            <Pressable onPress={resetSeed} style={styles.resetBtn}>
              <Text style={styles.resetTxt}>Load Starter Checklist</Text>
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
        </View>
      </TouchableWithoutFeedback>

      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          ref={inputRef}
          value={draft}
          onChangeText={setDraft}
          placeholder={`Add to ${activePhase.label.toLowerCase()}…`}
          placeholderTextColor="#555"
          style={styles.input}
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={() => {
            add();
            dismissKeyboard();
          }}
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
  flex: { flex: 1 },
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
  sub: { color: "#888", fontSize: 13, marginTop: 4, marginBottom: 16 },
  seg: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  segBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 9,
  },
  segBtnActive: { backgroundColor: "rgba(0,212,255,0.15)" },
  segTxt: {
    color: "#888",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  segTxtActive: { color: "#00d4ff" },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
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
