import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = {
  bg: "#060606",
  card: "#141414",
  hairline: "rgba(255,255,255,0.07)",
  text: "#fff",
  muted: "rgba(255,255,255,0.5)",
  dim: "rgba(255,255,255,0.32)",
  accent: "#E8000A",
} as const;

// ─── Content (JR fills copy this week) ───────────────────────────────────────
const SECTIONS: { title: string; body: string }[] = [
  {
    title: "Getting Started",
    body:
      "AVA is your all-in-one production toolkit for Alpha Visual Artists. " +
      "Start by exploring the Tools tab to access the Shoot Calculator, Rate Calculator, " +
      "and Sony Shooting Modes guides. Everything is designed for creators on the move.",
  },
  {
    title: "Using Production checklists",
    body:
      "The Production tab has three segments in one place: Pre-Prod, Day Of, and Edit. " +
      "Pick a project at the top so each shoot (podcast, commercial, etc.) keeps its own lists. " +
      "Check off items as you go — progress syncs when you're signed in.",
  },
  {
    title: "Managing Projects",
    body:
      "Each project stores a separate set of checklists so you can track multiple " +
      "shoots at once. Head to Account → Your Projects to create, switch, or rename projects. " +
      "Your active project is highlighted in red.",
  },
  {
    title: "Events & Photo Delivery",
    body:
      "The Events tab lets you manage photo delivery for live events. " +
      "Attendees receive a unique redeem code to access their gallery. " +
      "Operators can upload, assign, and manage galleries right from the app.",
  },
];

export default function HowToScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="light" />
      <ScrollView
        style={[s.root, { paddingTop: insets.top }]}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </Pressable>
          <Text style={s.title}>HOW TO USE AVA</Text>
          <View style={{ width: 44 }} />
        </View>

        {SECTIONS.map((sec, i) => (
          <View key={i} style={s.section}>
            <Text style={s.sectionTitle}>{sec.title}</Text>
            <Text style={s.sectionBody}>{sec.body}</Text>
          </View>
        ))}
      </ScrollView>
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
    marginBottom: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "BebasNeue_400Regular",
    fontSize: 24,
    color: C.text,
    letterSpacing: 2,
    flex: 1,
    textAlign: "center",
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: C.hairline,
  },
  sectionTitle: {
    fontFamily: "BebasNeue_400Regular",
    fontSize: 22,
    color: C.text,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  sectionBody: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 14,
    color: C.muted,
    lineHeight: 22,
  },
});
