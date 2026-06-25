import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { InteractionManager } from "react-native";

const BOOT_DELAY_MS = 500;
const FOCUS_DELAY_MS = 1000;
/** Hard cap so videos eventually mount even if InteractionManager stalls. */
const MAX_DEFER_MS = 3000;

/**
 * Gates Home HLS/native video mounts until after cold-start settles.
 * Requires InteractionManager idle + boot delay + Home focused ≥1s (whichever is slowest),
 * with a 3s fallback so content still appears.
 */
export function useDeferHomeVideos(): boolean {
  const [interactionDone, setInteractionDone] = useState(false);
  const [bootDelayDone, setBootDelayDone] = useState(false);
  const [focusDelayDone, setFocusDelayDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const interaction = InteractionManager.runAfterInteractions(() => {
      setInteractionDone(true);
    });
    const bootTimer = setTimeout(() => setBootDelayDone(true), BOOT_DELAY_MS);
    const maxTimer = setTimeout(() => setReady(true), MAX_DEFER_MS);

    return () => {
      interaction.cancel();
      clearTimeout(bootTimer);
      clearTimeout(maxTimer);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const focusTimer = setTimeout(() => setFocusDelayDone(true), FOCUS_DELAY_MS);
      return () => clearTimeout(focusTimer);
    }, []),
  );

  useEffect(() => {
    if (ready) return;
    if (interactionDone && bootDelayDone && focusDelayDone) {
      setReady(true);
    }
  }, [ready, interactionDone, bootDelayDone, focusDelayDone]);

  return ready;
}
