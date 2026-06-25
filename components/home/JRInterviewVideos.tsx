import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { playWhenReady, safePause, safePlay } from "../../utils/safeVideoPlayer";
import {
  JR_INTERVIEW_STREAMS,
  type InterviewStream,
  interviewStreamSource,
} from "../../constants/interviewStreams";

const VIDEO_ASPECT = 16 / 9;
const TABLET_MIN_WIDTH = 768;

type InterviewCardProps = {
  interview: InterviewStream;
  width: number;
};

function InterviewCard({ interview, width }: InterviewCardProps) {
  const videoHeight = width / VIDEO_ASPECT;
  const [started, setStarted] = useState(false);

  return (
    <View style={[styles.card, { width }]}>
      <View style={[styles.videoWrap, { height: videoHeight }]}>
        {started ? (
          <InterviewPlayer interview={interview} />
        ) : (
          <Pressable
            onPress={() => setStarted(true)}
            style={styles.playOverlay}
            accessibilityRole="button"
            accessibilityLabel={`Play ${interview.label}`}
          >
            <View style={styles.playBtn}>
              <Ionicons name="play" size={28} color="#000" />
            </View>
            <Text style={styles.tapHint}>Tap to play</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.labelEyebrow}>{interview.eyebrow}</Text>
        <Text style={styles.labelTitle} numberOfLines={2}>
          {interview.label}
        </Text>
      </View>
    </View>
  );
}

type InterviewPlayerProps = {
  interview: InterviewStream;
};

/** Native player mounts only after tap — avoids cold-start player stampede on Home. */
function InterviewPlayer({ interview }: InterviewPlayerProps) {
  const [muted, setMuted] = useState(false);

  const source = interviewStreamSource(interview.streamId);

  const player = useVideoPlayer(source, (p) => {
    p.loop = false;
    p.muted = false;
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
    <>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        nativeControls
        allowsPictureInPicture={false}
      />
      <Pressable
        onPress={toggleMute}
        style={styles.unmuteBtn}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={muted ? "Unmute video" : "Mute video"}
      >
        <Ionicons
          name={muted ? "volume-mute" : "volume-high"}
          size={18}
          color="#fff"
        />
      </Pressable>
    </>
  );
}

type JRInterviewVideosProps = {
  /** When false, native players are not mounted (cold-start stability). */
  ready?: boolean;
};

export function JRInterviewVideos({ ready = true }: JRInterviewVideosProps) {
  const { width: screenWidth } = useWindowDimensions();
  const horizontalPadding = 20;
  const gap = 12;
  const isTablet = screenWidth >= TABLET_MIN_WIDTH;
  const cardWidth = isTablet
    ? (screenWidth - horizontalPadding * 2 - gap) / 2
    : screenWidth - horizontalPadding * 2;
  const videoHeight = cardWidth / VIDEO_ASPECT;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionEyebrow}>About JR</Text>
      <Text style={styles.sectionTitle}>Interviews</Text>
      <View
        style={[
          styles.row,
          {
            paddingHorizontal: horizontalPadding,
            flexDirection: isTablet ? "row" : "column",
            gap,
          },
        ]}
      >
        {ready
          ? JR_INTERVIEW_STREAMS.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                width={cardWidth}
              />
            ))
          : JR_INTERVIEW_STREAMS.map((interview) => (
              <View key={interview.id} style={[styles.card, { width: cardWidth }]}>
                <View style={[styles.videoWrap, styles.placeholderWrap, { height: videoHeight }]}>
                  <View style={styles.playBtn}>
                    <Ionicons name="play" size={28} color="#000" />
                  </View>
                </View>
                <View style={styles.labelRow}>
                  <Text style={styles.labelEyebrow}>{interview.eyebrow}</Text>
                  <Text style={styles.labelTitle} numberOfLines={2}>
                    {interview.label}
                  </Text>
                </View>
              </View>
            ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionEyebrow: {
    color: "#00d4ff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  row: {
    alignItems: "center",
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  videoWrap: {
    width: "100%",
    backgroundColor: "#0a0a0a",
    overflow: "hidden",
  },
  placeholderWrap: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0a0a0a",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#00d4ff",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 4,
  },
  tapHint: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 10,
    letterSpacing: 0.5,
  },
  unmuteBtn: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  labelRow: {
    padding: 14,
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
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 17,
  },
});
