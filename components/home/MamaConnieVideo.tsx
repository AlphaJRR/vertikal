import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import {
  MAMA_CONNIE_HOME_LABEL,
  MAMA_CONNIE_HOME_STREAM_ID,
  cloudflareStreamHls,
} from "../../constants/homeStream";

const VIDEO_ASPECT = 16 / 9;

export function MamaConnieVideo() {
  const { width: screenWidth } = useWindowDimensions();
  const videoHeight = screenWidth / VIDEO_ASPECT;
  const [muted, setMuted] = useState(true);

  const source = cloudflareStreamHls(MAMA_CONNIE_HOME_STREAM_ID);

  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  useEffect(() => {
    player.muted = muted;
  }, [muted, player]);

  useFocusEffect(
    useCallback(() => {
      player.play();
      return () => {
        player.pause();
      };
    }, [player]),
  );

  const toggleMute = () => {
    setMuted((current) => !current);
  };

  return (
    <View style={[styles.wrap, { height: videoHeight }]}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        nativeControls={false}
        allowsPictureInPicture={false}
      />
      <View style={styles.labelRow} pointerEvents="none">
        <Text style={styles.labelEyebrow}>Featured Film</Text>
        <Text style={styles.labelTitle} numberOfLines={2}>
          {MAMA_CONNIE_HOME_LABEL}
        </Text>
      </View>
      <Pressable
        onPress={toggleMute}
        style={styles.unmuteBtn}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={muted ? "Unmute video" : "Mute video"}
      >
        <Ionicons
          name={muted ? "volume-mute" : "volume-high"}
          size={20}
          color="#fff"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    backgroundColor: "#111",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "#111",
  },
  labelRow: {
    position: "absolute",
    left: 16,
    bottom: 14,
    right: 56,
  },
  labelEyebrow: {
    color: "#00d4ff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  labelTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 18,
  },
  unmuteBtn: {
    position: "absolute",
    right: 16,
    bottom: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
});
