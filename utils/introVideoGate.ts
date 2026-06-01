import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AVA_INTRO_LAST_PLAYED_KEY,
  INTRO_COOLDOWN_MS,
} from "../constants/introVideo";

export async function shouldPlayAppIntro(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(AVA_INTRO_LAST_PLAYED_KEY);
  if (raw == null || raw === "") return true;

  const lastPlayed = Number.parseInt(raw, 10);
  if (!Number.isFinite(lastPlayed)) return true;

  return Date.now() - lastPlayed >= INTRO_COOLDOWN_MS;
}

export async function markAppIntroPlayed(): Promise<void> {
  await AsyncStorage.setItem(AVA_INTRO_LAST_PLAYED_KEY, String(Date.now()));
}
