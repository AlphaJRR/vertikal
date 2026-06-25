import React, { Component, useCallback, useEffect, useState, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { playWhenReady, safePause, safePlay } from "../../utils/safeVideoPlayer";
import {
  CLOUDFLARE_STREAM_CUSTOMER,
  MAMA_CONNIE_HOME_LABEL,
  MAMA_CONNIE_HOME_STREAM_ID,
  cloudflareStreamHls,
} from "../../constants/homeStream";

const VIDEO_ASPECT = 16 / 9;

const STREAM_UID_RE = /^[a-f0-9]{32}$/i;

function homeStreamSourceValid(): boolean {
  const uid = MAMA_CONNIE_HOME_STREAM_ID?.trim() ?? "";
  return (
    uid.length > 0 &&
    STREAM_UID_RE.test(uid) &&
    Boolean(CLOUDFLARE_STREAM_CUSTOMER?.trim())
  );
}


type MamaConnieBoundaryState = { crashed: boolean };

/**
 * Isolates Mama Connie from the root ErrorBoundary — returns null on player failure.
 */
class MamaConnieBoundary extends Component<
  { children: ReactNode },
  MamaConnieBoundaryState
> {
  state: MamaConnieBoundaryState = { crashed: false };

  static getDerivedStateFromError(): MamaConnieBoundaryState {
    return { crashed: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }): void {
    console.error(
      "[MamaConnieVideo] player render failed:",
      error.message,
      error.stack,
      info.componentStack,
    );
  }

  render() {
    if (this.state.crashed) {
      return <MamaConnieFallback />;
    }
    return this.props.children;
  }
}

function MamaConnieFallback() {
  const { width: screenWidth } = useWindowDimensions();
  const videoHeight = screenWidth / VIDEO_ASPECT;

  return (
    <View style={[styles.wrap, styles.fallbackWrap, { height: videoHeight }]}>
      <Ionicons name="videocam-outline" size={32} color="#00d4ff" />
      <Text style={styles.fallbackEyebrow}>Featured Film</Text>
      <Text style={styles.fallbackTitle}>{MAMA_CONNIE_HOME_LABEL}</Text>
      <Text style={styles.fallbackHint}>Video unavailable — scroll for more content</Text>
    </View>
  );
}

export function MamaConnieVideo() {
  const { width: screenWidth } = useWindowDimensions();
  const videoHeight = screenWidth / VIDEO_ASPECT;

  return (
    <MamaConnieBoundary>
      <MamaConnieVideoPlayer videoHeight={videoHeight} />
    </MamaConnieBoundary>
  );
}

type MamaConnieVideoPlayerProps = {
  videoHeight: number;
};

/**
 * Matches FEATURED_REELS / ReelVideoCover: never call play() inside useVideoPlayer setup.
 * Setup runs synchronously during render (expo-video useReleasingSharedObject factory).
 */
function MamaConnieVideoPlayer({ videoHeight }: MamaConnieVideoPlayerProps) {
  const [muted, setMuted] = useState(true);

  const source = cloudflareStreamHls(MAMA_CONNIE_HOME_STREAM_ID);

  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    player.muted = muted;
  }, [muted, player]);

  useEffect(() => {
    return playWhenReady(player, () => true);
  }, [player]);

  useFocusEffect(
    useCallback(() => {
      safePlay(player);
      return () => {
        safePause(player);
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
  fallbackWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 6,
  },
  fallbackEyebrow: {
    color: "#00d4ff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 8,
  },
  fallbackTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 20,
  },
  fallbackHint: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
  },
});
