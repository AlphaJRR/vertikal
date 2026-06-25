import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { playWhenReady } from "../utils/safeVideoPlayer";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: any;
  style?: ViewStyle;
  isVisible?: boolean;
};

/**
 * Muted, looping, autoplay video preview for a reel cover.
 * Native player mounts only when visible — avoids HLS decoder stampede on Home cold start.
 */
export function ReelVideoCover({ source, style, isVisible = true }: Props) {
  if (!isVisible) {
    return <View style={[styles.cover, style]} />;
  }

  return <ReelVideoCoverPlayer source={source} style={style} />;
}

type PlayerProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: any;
  style?: ViewStyle;
};

function ReelVideoCoverPlayer({ source, style }: PlayerProps) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    return playWhenReady(player, () => true);
  }, [player]);

  return (
    <VideoView
      player={player}
      style={[styles.cover, style]}
      contentFit="cover"
      nativeControls={false}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  cover: { width: "100%", height: 280, backgroundColor: "#111" },
});
