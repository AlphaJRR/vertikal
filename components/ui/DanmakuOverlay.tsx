/**
 * Danmaku Overlay Component - "The Daunt Effect" (Premium Adaptive Speed)
 * Live scrolling comments with adaptive speed, collision avoidance, and adaptive spawn rate
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

// ✅ PREMIUM: Danmaku tuning constants
const LANES = 7;
const FONT_SIZE = 16;
const BASE_SPEED_PX_PER_S = 220; // Global "energy" knob (increase to 250 for more hype)
const LANE_HEIGHT = height / LANES;

// ✅ Adaptive speed by length (short faster, long slower)
function lengthSpeedMultiplier(text: string): number {
  const len = text.trim().length;
  if (len <= 16) return 1.25;
  if (len <= 28) return 1.05;
  if (len <= 44) return 0.90;
  return 0.78;
}

// ✅ Estimate text width (decent approximation: average glyph width ~0.55 * fontSize)
function estimateTextWidth(text: string): number {
  return text.trim().length * FONT_SIZE * 0.55;
}

// ✅ Compute duration based on distance and adaptive speed
function computeDurationMs(text: string, containerWidth: number): number {
  const textW = estimateTextWidth(text);
  const dist = containerWidth + textW + 40;
  const speed = BASE_SPEED_PX_PER_S * lengthSpeedMultiplier(text);
  const ms = (dist / speed) * 1000;
  return Math.max(3500, Math.min(8500, Math.round(ms)));
}

// ✅ Minimum gap in px between items in same lane
function minGapPx(text: string): number {
  const len = text.trim().length;
  if (len <= 16) return 70;
  if (len <= 30) return 95;
  return 120;
}

export interface DanmakuComment {
  id: string;
  text: string;
  delay?: number;
  topPosition?: string | number;
  color?: string;
}

interface DanmakuItem {
  id: string;
  text: string;
  lane: number;
  durationMs: number;
  color: string;
}

interface FlyingCommentProps {
  item: DanmakuItem;
  containerWidth: number;
  onComplete: (id: string) => void;
}

// Single Flying Comment Component with adaptive duration
const FlyingComment: React.FC<FlyingCommentProps> = ({ item, containerWidth, onComplete }) => {
  const position = useRef(new Animated.Value(width)).current;
  const textW = estimateTextWidth(item.text);
  const distance = containerWidth + textW + 40;

  useEffect(() => {
    const animation = Animated.timing(position, {
      toValue: -distance,
      duration: item.durationMs,
      useNativeDriver: true,
    });

    animation.start(() => {
      onComplete(item.id);
    });

    return () => {
      animation.stop();
    };
  }, [position, item.durationMs, distance, item.id, onComplete]);

  const topValue = 10 + item.lane * LANE_HEIGHT;

  return (
    <Animated.View 
      style={[
        styles.flyer, 
        { 
          transform: [{ translateX: position }], 
          top: topValue,
        }
      ]}
    >
      <Text style={[styles.commentText, { color: item.color }]}>{item.text}</Text>
    </Animated.View>
  );
};

interface DanmakuOverlayProps {
  comments: DanmakuComment[];
  enabled?: boolean;
}

// The Overlay Container with adaptive spawn and collision avoidance
export const DanmakuOverlay: React.FC<DanmakuOverlayProps> = ({ 
  comments, 
  enabled = true 
}) => {
  const [danmakuItems, setDanmakuItems] = useState<DanmakuItem[]>([]);
  const laneNextFreeAt = useRef<number[]>(Array(LANES).fill(0));
  const spawnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const commentsQueueRef = useRef<DanmakuComment[]>([]);
  const containerWidth = width;

  // ✅ Pick lane with collision avoidance
  function pickLane(now: number): number {
    // Prefer a lane that is already free
    for (let i = 0; i < LANES; i++) {
      if (laneNextFreeAt.current[i] <= now) return i;
    }
    // If all busy, pick the one that frees soonest
    let best = 0;
    let bestTime = laneNextFreeAt.current[0];
    for (let i = 1; i < LANES; i++) {
      if (laneNextFreeAt.current[i] < bestTime) {
        bestTime = laneNextFreeAt.current[i];
        best = i;
      }
    }
    return best;
  }

  // ✅ Spawn one comment with adaptive speed and collision avoidance
  function spawnComment(comment: DanmakuComment) {
    const now = Date.now();
    const lane = pickLane(now);
    const durationMs = computeDurationMs(comment.text, containerWidth);

    // Reserve lane time so next comment won't collide
    const textW = estimateTextWidth(comment.text);
    const speedPxPerS = BASE_SPEED_PX_PER_S * lengthSpeedMultiplier(comment.text);
    const gap = minGapPx(comment.text);
    const laneBlockMs = ((textW + gap) / speedPxPerS) * 1000;

    // Clamp lane block to avoid stalling
    laneNextFreeAt.current[lane] = now + Math.max(600, Math.min(1600, laneBlockMs));

    // ✅ Ensure unique ID even if comment.id exists (prevents duplicate keys)
    const uniqueId = `${comment.id || 'comment'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newItem: DanmakuItem = {
      id: uniqueId,
      text: comment.text,
      lane,
      durationMs,
      color: comment.color || '#FFFFFF',
    };

    setDanmakuItems(prev => [...prev, newItem]);
  }

  // ✅ Adaptive spawn rate (faster when empty, slower when crowded)
  function nextSpawnDelayMs(): number {
    const n = danmakuItems.length;
    if (n <= 3) return 550; // Faster when empty (was 650)
    if (n <= 6) return 800;
    if (n <= 9) return 1000;
    return 1200;
  }

  // ✅ Self-scheduling spawn loop
  function scheduleSpawn() {
    if (!enabled) return;

    // Spawn from queue if available
    if (commentsQueueRef.current.length > 0) {
      const comment = commentsQueueRef.current.shift()!;
      spawnComment(comment);
    }

    const delay = nextSpawnDelayMs();
    spawnTimeoutRef.current = setTimeout(() => {
      scheduleSpawn();
    }, delay);
  }

  // Initialize queue from comments prop
  useEffect(() => {
    if (!enabled || !comments || comments.length === 0) {
      commentsQueueRef.current = [];
      return;
    }

    // ✅ Cap on-screen comments to max 8 for performance
    const MAX_COMMENTS = 8;
    const queuedComments = comments.slice(0, MAX_COMMENTS);

    // Schedule comments based on their delay
    queuedComments.forEach((comment, index) => {
      const delay = comment.delay !== undefined 
        ? comment.delay 
        : index * (650 + Math.random() * 200); // Default spawn interval

      setTimeout(() => {
        commentsQueueRef.current.push(comment);
      }, delay);
    });

    // Start spawn loop
    scheduleSpawn();

    return () => {
      if (spawnTimeoutRef.current) {
        clearTimeout(spawnTimeoutRef.current);
      }
    };
  }, [enabled, comments]);

  // Handle comment completion
  const handleComplete = (id: string) => {
    setDanmakuItems(prev => prev.filter(item => item.id !== id));
  };

  if (!enabled || danmakuItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.overlayContainer} pointerEvents="none">
      {danmakuItems.map(item => (
        <FlyingComment
          key={item.id}
          item={item}
          containerWidth={containerWidth}
          onComplete={handleComplete}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  flyer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  commentText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
