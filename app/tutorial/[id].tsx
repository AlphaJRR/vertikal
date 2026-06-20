import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";

const C = {
  bg: "#060606",
  text: "#fff",
  muted: "rgba(255,255,255,0.5)",
  dim: "rgba(255,255,255,0.32)",
} as const;

export default function TutorialPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // In production, look up the video URL from the TUTORIALS array.
  // For now we use an empty string — the player will show nothing until data is added.
  const videoUrl = "";

  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = false;
  });

  return (
    <>
      <StatusBar style="light" />
      <View style={[s.root, { paddingTop: insets.top }]}>
        <View style={s.header}>
          <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </Pressable>
          <Text style={s.title}>Tutorial {id}</Text>
          <View style={{ width: 44 }} />
        </View>

        {videoUrl ? (
          <VideoView
            player={player}
            style={s.video}
            allowsFullscreen
            allowsPictureInPicture
          />
        ) : (
          <View style={s.placeholder}>
            <Ionicons name="videocam-outline" size={48} color={C.dim} />
            <Text style={s.placeholderText}>Video not yet available</Text>
          </View>
        )}
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
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  placeholderText: {
    fontFamily: "SpaceGrotesk_400Regular",
    fontSize: 15,
    color: C.muted,
  },
});
