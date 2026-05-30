import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

type Ratio = { label: string; w: number; h: number; platform: string };

const RATIOS: Ratio[] = [
  { label: "9:16", w: 9, h: 16, platform: "Reels • TikTok • Shorts" },
  { label: "1:1", w: 1, h: 1, platform: "Feed Post" },
  { label: "4:5", w: 4, h: 5, platform: "IG Portrait" },
  { label: "16:9", w: 16, h: 9, platform: "YouTube • Web Hero" },
  { label: "2.39:1", w: 2.39, h: 1, platform: "Cinematic" },
];

// Approximate H.264 bitrates in Mbps for common rec configs.
const PRESETS = [
  { label: "1080p / 24fps", mbps: 25 },
  { label: "1080p / 60fps", mbps: 50 },
  { label: "4K / 24fps", mbps: 100 },
  { label: "4K / 60fps", mbps: 200 },
  { label: "ProRes 422 4K", mbps: 471 },
];

function formatGB(gb: number) {
  if (gb < 1) return `${(gb * 1024).toFixed(0)} MB`;
  if (gb < 10) return `${gb.toFixed(2)} GB`;
  return `${gb.toFixed(1)} GB`;
}

export default function ToolsScreen() {
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState("1920");
  const [activeRatio, setActiveRatio] = useState<Ratio>(RATIOS[0]);
  const [minutes, setMinutes] = useState("10");
  const [activePreset, setActivePreset] = useState(PRESETS[2]);

  const computedHeight = useMemo(() => {
    const w = parseFloat(width) || 0;
    return Math.round((w * activeRatio.h) / activeRatio.w);
  }, [width, activeRatio]);

  const storageGB = useMemo(() => {
    const mins = parseFloat(minutes) || 0;
    return (activePreset.mbps * 60 * mins) / 8 / 1024;
  }, [minutes, activePreset]);

  const tap = (fn: () => void) => () => {
    Haptics.selectionAsync().catch(() => {});
    fn();
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 20,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Creator Tools</Text>
        <Text style={styles.h1}>Shoot Smarter</Text>
        <Text style={styles.sub}>
          Quick math for the road. Plan dimensions and storage before you roll.
        </Text>
      </View>

      {/* ASPECT RATIO */}
      <View style={styles.card}>
        <View style={styles.cardHead}>
          <Ionicons name="resize-outline" size={18} color="#00d4ff" />
          <Text style={styles.cardTitle}>Aspect Ratio</Text>
        </View>

        <View style={styles.chipRow}>
          {RATIOS.map((r) => {
            const active = r.label === activeRatio.label;
            return (
              <Pressable
                key={r.label}
                onPress={tap(() => setActiveRatio(r))}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>
                  {r.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.platformHint}>{activeRatio.platform}</Text>

        <Text style={styles.label}>Width (px)</Text>
        <TextInput
          value={width}
          onChangeText={setWidth}
          keyboardType="numeric"
          style={styles.input}
          placeholder="1920"
          placeholderTextColor="#444"
        />

        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Height</Text>
          <Text style={styles.resultValue}>{computedHeight} px</Text>
          <Text style={styles.resultMeta}>
            Final canvas: {width || 0} × {computedHeight}
          </Text>
        </View>
      </View>

      {/* STORAGE */}
      <View style={styles.card}>
        <View style={styles.cardHead}>
          <Ionicons name="server-outline" size={18} color="#00d4ff" />
          <Text style={styles.cardTitle}>Storage Estimator</Text>
        </View>

        <View style={styles.chipRow}>
          {PRESETS.map((p) => {
            const active = p.label === activePreset.label;
            return (
              <Pressable
                key={p.label}
                onPress={tap(() => setActivePreset(p))}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>
                  {p.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Recording length (minutes)</Text>
        <TextInput
          value={minutes}
          onChangeText={setMinutes}
          keyboardType="numeric"
          style={styles.input}
          placeholder="10"
          placeholderTextColor="#444"
        />

        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Card / drive needed</Text>
          <Text style={styles.resultValue}>{formatGB(storageGB)}</Text>
          <Text style={styles.resultMeta}>
            ~{activePreset.mbps} Mbps for {minutes || 0} min
          </Text>
        </View>
      </View>

      {/* QUICK FACTS */}
      <View style={styles.card}>
        <View style={styles.cardHead}>
          <Ionicons name="bulb-outline" size={18} color="#00d4ff" />
          <Text style={styles.cardTitle}>Hooks That Convert</Text>
        </View>
        <Text style={styles.tip}>• First 1.5 seconds decide the scroll.</Text>
        <Text style={styles.tip}>• Lead with motion, not a logo.</Text>
        <Text style={styles.tip}>• Captions on-screen — 85% watch muted.</Text>
        <Text style={styles.tip}>• One idea per clip. Cut everything else.</Text>
        <Text style={styles.tip}>• Shoot in 4K, deliver in the platform's native ratio.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },
  header: { marginBottom: 24 },
  eyebrow: {
    color: "#00d4ff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  h1: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  sub: { color: "#888", fontSize: 14, lineHeight: 20 },
  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 18,
    marginBottom: 16,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  chipActive: {
    backgroundColor: "rgba(0,212,255,0.15)",
    borderColor: "#00d4ff",
  },
  chipTxt: { color: "#aaa", fontSize: 12, fontWeight: "600" },
  chipTxtActive: { color: "#00d4ff" },
  platformHint: {
    color: "#666",
    fontSize: 11,
    marginTop: 4,
    marginBottom: 12,
    fontStyle: "italic",
  },
  label: {
    color: "#888",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  resultBox: {
    backgroundColor: "rgba(0,212,255,0.08)",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,212,255,0.25)",
  },
  resultLabel: {
    color: "#00d4ff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  resultValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  resultMeta: { color: "#888", fontSize: 12, marginTop: 4 },
  tip: { color: "#ccc", fontSize: 14, lineHeight: 22, marginBottom: 4 },
});
