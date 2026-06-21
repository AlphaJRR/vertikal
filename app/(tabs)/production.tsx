/**
 * Production tab — merges Shoot + Edit into one screen.
 *
 * Segments and their AsyncStorage keys (unchanged — no data migration):
 *   Pre-Prod  → "ava_shoot_pre_v1"  (from former Shoot tab)
 *   Day Of    → "ava_shoot_day_v1"  (from former Shoot tab)
 *   Post      → "ava_edit_v1"       (from former Edit tab)
 *
 * IMPORTANT: The storage keys are intentionally preserved so any
 * in-progress checklists users had on the old tabs survive intact.
 *
 * Additive — notes.tsx and edit.tsx files are left in place as dead
 * routes. Only the tab entry is replaced in (tabs)/_layout.tsx.
 */

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
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

import { ReminderButton } from "@/components/ReminderButton";
import { cancelNoteReminder } from "@/lib/notify";

type Segment = "pre" | "day" | "post";
type Item    = { id: string; text: string; done: boolean };

// ── Storage keys — DO NOT change these ───────────────────────────────────────
const STORAGE: Record<Segment, string> = {
  pre:  "ava_shoot_pre_v1",
  day:  "ava_shoot_day_v1",
  post: "ava_edit_v1",         // reads the former Edit tab data
};

const SEGMENTS: { key: Segment; label: string; subtitle: string }[] = [
  { key: "pre",  label: "Pre-Prod", subtitle: "Plan the shoot" },
  { key: "day",  label: "Day Of",   subtitle: "Roll cameras" },
  { key: "post", label: "Post",     subtitle: "Log → cut → color → deliver" },
];

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEEDS: Record<Segment, string[]> = {
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
  ],
};

const ADD_PLACEHOLDER: Record<Segment, string> = {
  pre:  "Add to pre-prod…",
  day:  "Add to day-of…",
  post: "Add an edit task…",
};

const HIGHLIGHT_DURATION_MS = 3000;

// ─────────────────────────────────────────────────────────────────────────────

export default function ProductionScreen() {
  const insets = useSafeAreaInsets();

  // Deep-link params injected by notification tap
  const { phase: deepLinkPhase, highlightId } = useLocalSearchParams<{
    phase?:       string;
    highlightId?: string;
  }>();

  const [segment, setSegment]       = useState<Segment>("pre");
  const [data, setData]             = useState<Record<Segment, Item[]>>({ pre: [], day: [], post: [] });
  const [loaded, setLoaded]         = useState<Record<Segment, boolean>>({ pre: false, day: false, post: false });
  const [draft, setDraft]           = useState("");
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  const dismissKeyboard = useCallback(() => {
    inputRef.current?.blur();
    Keyboard.dismiss();
  }, []);

  // Load all three segments from storage on mount
  useEffect(() => {
    (async () => {
      const next: Record<Segment, Item[]> = { pre: [], day: [], post: [] };
      for (const seg of ["pre", "day", "post"] as Segment[]) {
        try {
          const raw = await AsyncStorage.getItem(STORAGE[seg]);
          next[seg] = raw
            ? (JSON.parse(raw) as Item[])
            : SEEDS[seg].map((text, i) => ({ id: `seed-${seg}-${i}`, text, done: false }));
        } catch {
          next[seg] = [];
        }
      }
      setData(next);
      setLoaded({ pre: true, day: true, post: true });
    })();
  }, []);

  // Persist on every change
  useEffect(() => {
    (Object.keys(loaded) as Segment[]).forEach(seg => {
      if (loaded[seg]) {
        AsyncStorage.setItem(STORAGE[seg], JSON.stringify(data[seg])).catch(() => {});
      }
    });
  }, [data, loaded]);

  // Handle deep-link phase / highlight from notification tap
  useEffect(() => {
    if (deepLinkPhase && (["pre", "day", "post"] as string[]).includes(deepLinkPhase)) {
      setSegment(deepLinkPhase as Segment);
    }
  }, [deepLinkPhase]);

  useEffect(() => {
    if (!highlightId) return;
    setActiveHighlight(highlightId);
    const timer = setTimeout(() => setActiveHighlight(null), HIGHLIGHT_DURATION_MS);
    return () => clearTimeout(timer);
  }, [highlightId]);

  const items    = data[segment];
  const remaining = useMemo(() => items.filter(i => !i.done).length, [items]);
  const total    = items.length;
  const pct      = total === 0 ? 0 : Math.round(((total - remaining) / total) * 100);

  const switchSegment = (s: Segment) => {
    dismissKeyboard();
    Haptics.selectionAsync().catch(() => {});
    setSegment(s);
    setDraft("");
  };

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setData(d => ({ ...d, [segment]: [{ id: `${Date.now()}`, text, done: false }, ...d[segment]] }));
    setDraft("");
  };

  const toggle = (id: string) => {
    dismissKeyboard();
    Haptics.selectionAsync().catch(() => {});
    setData(d => ({ ...d, [segment]: d[segment].map(i => i.id === id ? { ...i, done: !i.done } : i) }));
  };

  const remove = (id: string) => {
    dismissKeyboard();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    void cancelNoteReminder(id);  // cancel any scheduled reminder for this item
    setData(d => ({ ...d, [segment]: d[segment].filter(i => i.id !== id) }));
  };

  const clearDone = () => {
    dismissKeyboard();
    const count = items.filter(i => i.done).length;
    if (count === 0) return;
    Alert.alert("Clear completed?", `Remove ${count} checked item${count > 1 ? "s" : ""}.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive",
        onPress: () => setData(d => ({ ...d, [segment]: d[segment].filter(i => !i.done) })) },
    ]);
  };

  const resetSeed = () => {
    dismissKeyboard();
    Alert.alert("Reset to defaults?", "Replaces this list with the starter checklist.", [
      { text: "Cancel", style: "cancel" },
      { text: "Reset", style: "destructive",
        onPress: () => setData(d => ({
          ...d,
          [segment]: SEEDS[segment].map((text, i) => ({ id: `seed-${segment}-${i}-${Date.now()}`, text, done: false })),
        })) },
    ]);
  };

  const activeSeg = SEGMENTS.find(s => s.key === segment)!;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.root}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
        <View style={styles.flex}>

          <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
            <Text style={styles.eyebrow}>AVA</Text>
            <Text style={styles.h1}>Production</Text>
            <Text style={styles.sub}>{activeSeg.subtitle}</Text>

            {/* Segmented control */}
            <View style={styles.seg}>
              {SEGMENTS.map(s => {
                const active = s.key === segment;
                return (
                  <Pressable
                    key={s.key}
                    onPress={() => switchSegment(s.key)}
                    style={[styles.segBtn, active && styles.segBtnActive]}
                  >
                    <Text style={[styles.segTxt, active && styles.segTxtActive]}>
                      {s.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Progress bar */}
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${pct}%` }]} />
              </View>
              <Text style={styles.progressTxt}>{remaining} left · {pct}%</Text>
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
                <Ionicons
                  name={segment === "post" ? "cut-outline" : "add-circle-outline"}
                  size={48}
                  color="#333"
                />
                <Text style={styles.emptyTxt}>
                  Empty list. Add an item below or reset to defaults.
                </Text>
                <Pressable onPress={resetSeed} style={styles.resetBtn}>
                  <Text style={styles.resetTxt}>Load Starter Checklist</Text>
                </Pressable>
              </View>
            ) : (
              <>
                {items.map(item => {
                  const highlighted = item.id === activeHighlight;
                  return (
                    <View
                      key={item.id}
                      style={[styles.row, highlighted && styles.rowHighlighted]}
                    >
                      <Pressable
                        onPress={() => toggle(item.id)}
                        style={[styles.check, item.done && styles.checkDone]}
                        hitSlop={8}
                      >
                        {item.done && <Ionicons name="checkmark" size={16} color="#000" />}
                      </Pressable>
                      <Text
                        style={[styles.itemTxt, item.done && styles.itemTxtDone]}
                        onPress={() => toggle(item.id)}
                      >
                        {item.text}
                      </Text>

                      {/* Reminder bell */}
                      <ReminderButton
                        itemId={item.id}
                        phase={segment}
                        itemText={item.text}
                      />

                      <Pressable onPress={() => remove(item.id)} hitSlop={10}>
                        <Ionicons name="close" size={20} color="#555" />
                      </Pressable>
                    </View>
                  );
                })}

                <View style={styles.actionsRow}>
                  {items.some(i => i.done) && (
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

      {/* Input bar */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          ref={inputRef}
          value={draft}
          onChangeText={setDraft}
          placeholder={ADD_PLACEHOLDER[segment]}
          placeholderTextColor="#555"
          style={styles.input}
          returnKeyType="done"
          blurOnSubmit
          onSubmitEditing={() => { add(); dismissKeyboard(); }}
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

  header: { paddingHorizontal: 20, paddingBottom: 14 },
  eyebrow: {
    color: "#00d4ff", fontSize: 11, fontWeight: "700",
    letterSpacing: 2, textTransform: "uppercase", marginBottom: 4,
  },
  h1:  { color: "#fff", fontSize: 32, fontWeight: "800", letterSpacing: -0.5 },
  sub: { color: "#888", fontSize: 13, marginTop: 4, marginBottom: 16 },

  seg: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 12, padding: 4,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)",
  },
  segBtn:       { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 9 },
  segBtnActive: { backgroundColor: "rgba(0,212,255,0.15)" },
  segTxt:       { color: "#888", fontSize: 12, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
  segTxtActive: { color: "#00d4ff" },

  progressRow:  { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14 },
  progressTrack:{ flex: 1, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#00d4ff" },
  progressTxt:  { color: "#888", fontSize: 11, fontWeight: "600" },

  list: { flex: 1, marginTop: 8 },

  empty:    { alignItems: "center", paddingVertical: 60, gap: 16 },
  emptyTxt: { color: "#555", fontSize: 14, textAlign: "center", maxWidth: 240 },
  resetBtn: {
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: "rgba(0,212,255,0.1)",
    borderRadius: 10, borderWidth: 1, borderColor: "rgba(0,212,255,0.3)",
  },
  resetTxt: { color: "#00d4ff", fontWeight: "700", fontSize: 13 },

  row: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)",
  },
  rowHighlighted: {
    backgroundColor: "rgba(232,0,10,0.15)",
    borderRadius: 8,
  },
  check:       { width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: "#444", alignItems: "center", justifyContent: "center" },
  checkDone:   { backgroundColor: "#00d4ff", borderColor: "#00d4ff" },
  itemTxt:     { flex: 1, color: "#eee", fontSize: 15, lineHeight: 21 },
  itemTxtDone: { color: "#555", textDecorationLine: "line-through" },

  actionsRow: { flexDirection: "row", gap: 8, marginTop: 16, flexWrap: "wrap" },
  smallBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  smallBtnTxt: { color: "#aaa", fontSize: 11, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase" },

  inputBar: {
    flexDirection: "row", gap: 10,
    paddingHorizontal: 20, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.06)",
    backgroundColor: "#0a0a0a",
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
    color: "#fff", fontSize: 15,
    paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 14,
  },
  addBtn: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: "#00d4ff",
    alignItems: "center", justifyContent: "center",
  },
});
