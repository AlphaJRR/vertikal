/**
 * VibeOverlay - Standardized VIBE™ Component
 * Single source of truth for VIBE (Danmaku) overlay with mode control.
 * Wraps existing DanmakuOverlay with standardized API.
 */

import React, { useMemo } from "react";
import { View } from "react-native";
import { DanmakuOverlay, DanmakuComment } from "./DanmakuOverlay";

export type VibeMode = "clean" | "vibe" | "vibePlus";

interface VibeOverlayProps {
  videoId?: string;
  mode?: VibeMode;
  comments?: DanmakuComment[];
  seed?: string; // For demo/seed mode
  enabled?: boolean;
}

// Demo seed comments (fallback if no comments provided)
const DEMO_SEED_COMMENTS: DanmakuComment[] = [
  { id: "1", text: "🔥 This is fire", color: "#FFD700" },
  { id: "2", text: "Vertical cinema is the future", color: "#FFFFFF" },
  { id: "3", text: "The Daunt Effect is real", color: "#FFD700" },
  { id: "4", text: "This hits different", color: "#FFFFFF" },
  { id: "5", text: "VERTIKAL 🎬", color: "#FFD700" },
  { id: "6", text: "Cinema rotating", color: "#FFFFFF" },
  { id: "7", text: "Premium content", color: "#FFD700" },
  { id: "8", text: "Founding 50 here", color: "#FFFFFF" },
];

export function VibeOverlay({
  videoId,
  mode = "vibe",
  comments,
  seed,
  enabled = true,
}: VibeOverlayProps) {
  // Determine if VIBE should be active
  const isVibeEnabled = enabled && (mode === "vibe" || mode === "vibePlus");

  // Select comments based on mode and props
  const activeComments = useMemo(() => {
    if (!isVibeEnabled) return [];

    // Use provided comments if available
    if (comments && comments.length > 0) {
      return comments;
    }

    // Use seed-based comments if seed provided
    if (seed) {
      // Deterministic shuffle based on seed
      const shuffled = [...DEMO_SEED_COMMENTS].sort(() => {
        const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return (hash % 2) - 0.5;
      });
      return shuffled;
    }

    // Fallback to demo seed
    return DEMO_SEED_COMMENTS;
  }, [isVibeEnabled, comments, seed]);

  if (!isVibeEnabled || activeComments.length === 0) {
    return null;
  }

  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
      <DanmakuOverlay comments={activeComments} enabled={isVibeEnabled} />
    </View>
  );
}
