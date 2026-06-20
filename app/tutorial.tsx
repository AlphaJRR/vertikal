import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

// ─── Tutorial data (JR adds entries next week) ───────────────────────────────
const TUTORIALS: {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbUrl?: string;
}[] = [
  // Leave empty for now — JR adds entries next week
  // { id: '1', title: 'Getting Started', description: 'Overview of the app', videoUrl: '' }
];

export default function TutorialScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="light" />
      <View style={[s.root, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={s.header}>
          <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </Pressable>
          <Text style={s.title}>TUTORIALS</Text>
          <View style={{ width: 44 }} />
        </View>

        <FlatList
          data={TUTORIALS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
          renderItem={({ item }) => (
            <Pressable
              style={s.tutorialRow}
              onPress={() => router.push(`/tutorial/${item.id}` as Href)}
            >
              <View style={s.thumb}>
                <Ionicons name="play-circle-outline" size={36} color={C.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.tutorialTitle}>{item.title}</Text>
                <Text style={s.tutorialDesc} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={C.dim} />
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={s.emptyState}>
              <Ionicons name="videocam-outline" size={52} color={C.dim} />
              <Text style={s.emptyText}>Tutorials coming soon</Text>
              <Text style={s.emptySubtext}>
                AVA video guides will be available here.
              </Text>
            </View>
          }
        />
      </View>
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
    fontSize: 30,
    color: C.text,
    letterSpacing: 3,
  },
  tutorialRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.cell,
    marginHorizontal: 16,
    marginBottom: 1,
    padding: 16,
    gap: 16,
    borderRadius: 12,
  },
  thumb: {
    width: 64,
    height: 64,
    backgroundColor: C.card,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.hairline,
  },
  tutorialTitle: {
    fontFamily: "SpaceGrotesk_600SemiBold",
    fontSize: 15,
    color: C.text,
    marginBottom: 4,
  },
  tutorialDesc: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 12,
    color: C.muted,
    lineHeight: 17,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyText: {
    fontFamily: "BebasNeue_400Regular",
    fontSize: 26,
    color: C.muted,
    letterSpacing: 2,
    marginTop: 8,
  },
  emptySubtext: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 14,
    color: C.dim,
    textAlign: "center",
    lineHeight: 20,
  },
});
