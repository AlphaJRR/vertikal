import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AVA_INTRO_LAST_PLAYED_KEY,
  INTRO_COOLDOWN_MS,
} from "../constants/introVideo";

/** Set false before production — plays intro on every cold start for QA. */
const FORCE_INTRO_EVERY_LAUNCH = true;

export async function shouldPlayAppIntro(): Promise<boolean> {
  if (FORCE_INTRO_EVERY_LAUNCH) return true;

  const raw = await AsyncStorage.getItem(AVA_INTRO_LAST_PLAYED_KEY);
  if (raw == null || raw === "") return true;

  const lastPlayed = Number.parseInt(raw, 10);
  if (!Number.isFinite(lastPlayed)) return true;

  return Date.now() - lastPlayed >= INTRO_COOLDOWN_MS;
}

export async function markAppIntroPlayed(): Promise<void> {
  await AsyncStorage.setItem(AVA_INTRO_LAST_PLAYED_KEY, String(Date.now()));
}
