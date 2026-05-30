import React, { useEffect } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: any;
  style?: ViewStyle;
  isVisible?: boolean;
};

/**
 * Muted, looping, autoplay video preview for a reel cover.
 * Playback is gated by `isVisible` so off-screen reels don't decode.
 * Defaults to playing if `isVisible` is omitted (back-compat).
 */
export function ReelVideoCover({ source, style, isVisible = true }: Props) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    if (isVisible) p.play();
  });

  useEffect(() => {
    if (isVisible) player.play();
    else player.pause();
  }, [isVisible, player]);

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
