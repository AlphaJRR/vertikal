import type { VideoPlayer } from "expo-video";

/**
 * Guard expo-video play/pause — native player may not be ready on mount or after blur.
 * Matches MamaConnie pattern: never call play() inside useVideoPlayer setup callback.
 */
export function safePause(player: VideoPlayer | null | undefined): void {
  if (!player) return;
  try {
    if (player.status === "error" || player.status === "idle") return;
    if (player.playing || player.status === "readyToPlay") {
      player.pause();
    }
  } catch (error) {
    console.warn("[safeVideoPlayer] pause failed:", error);
  }
}

export function safePlay(player: VideoPlayer | null | undefined): void {
  if (!player) return;
  try {
    if (player.status === "error") return;
    if (player.status === "readyToPlay") {
      player.play();
    }
  } catch (error) {
    console.warn("[safeVideoPlayer] play failed:", error);
  }
}

/** Play now if ready; otherwise wait for readyToPlay. Returns cleanup. */
export function playWhenReady(
  player: VideoPlayer,
  shouldPlay: () => boolean,
): () => void {
  safePlay(player);
  const sub = player.addListener("statusChange", ({ status }) => {
    if (status === "readyToPlay" && shouldPlay()) {
      safePlay(player);
    }
  });
  return () => sub.remove();
}
