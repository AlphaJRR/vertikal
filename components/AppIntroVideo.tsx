import React, { useCallback, useEffect, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import { markAppIntroPlayed } from "../utils/introVideoGate";

const INTRO_SOURCE = require("../assets/videos/ava-logo-intro.mp4");

type AppIntroVideoProps = {
  onFinish: () => void;
};

export function AppIntroVideo({ onFinish }: AppIntroVideoProps) {
  const insets = useSafeAreaInsets();
  const finishedRef = useRef(false);

  const finish = useCallback(async () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    try {
      await markAppIntroPlayed();
    } catch {
      // Still dismiss if storage fails.
    }
    onFinish();
  }, [onFinish]);

  const player = useVideoPlayer(INTRO_SOURCE, (p) => {
    p.loop = false;
    p.muted = false;
    p.play();
  });

  useEffect(() => {
    const endSub = player.addListener("playToEnd", () => {
      void finish();
    });
    const statusSub = player.addListener("statusChange", ({ status, error }) => {
      if (error) void finish();
      if (status === "idle" && player.duration > 0 && player.currentTime >= player.duration - 0.25) {
        void finish();
      }
    });
    const safetyTimer = setTimeout(() => {
      void finish();
    }, 15000);
    return () => {
      clearTimeout(safetyTimer);
      endSub.remove();
      statusSub.remove();
    };
  }, [player, finish]);

  return (
    <View style={styles.overlay}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        nativeControls={false}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />
      <Pressable
        onPress={() => void finish()}
        style={[styles.skipBtn, { top: insets.top + 12 }]}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Skip intro"
      >
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0a0a0a",
    zIndex: 100,
  },
  video: {
    flex: 1,
    width: "100%",
  },
  skipBtn: {
    position: "absolute",
    right: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  skipText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
