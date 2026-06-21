/**
 * lib/notify.ts — Local notification helpers for production note reminders.
 *
 * HOTFIX: expo-notifications native module removed until Push Notifications is
 * enabled on the App Store provisioning profile. Stubs keep the UI from crashing.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const MAP_KEY = 'ava_note_reminders_v1';
const HOTFIX_MSG =
  '[notify] Local reminders are temporarily disabled pending Push capability on the App Store profile.';

export type NotePhase = 'pre' | 'day' | 'post';

export interface ScheduleReminderParams {
  itemId: string;
  phase: NotePhase;
  title: string;
  body?: string;
  date: Date;
}

export async function ensureNotifPermission(): Promise<boolean> {
  if (Platform.OS !== 'web') console.warn(HOTFIX_MSG);
  return false;
}

export async function getPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
  return 'denied';
}

export async function scheduleNoteReminder(_params: ScheduleReminderParams): Promise<string | null> {
  console.warn(HOTFIX_MSG);
  return null;
}

export async function cancelNoteReminder(itemId: string): Promise<void> {
  const map = await loadMap();
  delete map[itemId];
  await saveMap(map);
}

export async function cancelAllNoteReminders(): Promise<void> {
  await saveMap({});
}

export async function listScheduled(): Promise<never[]> {
  return [];
}

export async function getReminderForItem(itemId: string): Promise<{ date: Date } | null> {
  const map = await loadMap();
  const entry = map[itemId];
  if (!entry) return null;
  return { date: new Date(entry.fireDate) };
}

interface ReminderEntry {
  notificationId: string;
  fireDate: string;
}

type ReminderMap = Record<string, ReminderEntry>;

async function loadMap(): Promise<ReminderMap> {
  try {
    const raw = await AsyncStorage.getItem(MAP_KEY);
    return raw ? (JSON.parse(raw) as ReminderMap) : {};
  } catch {
    return {};
  }
}

async function saveMap(map: ReminderMap): Promise<void> {
  await AsyncStorage.setItem(MAP_KEY, JSON.stringify(map));
}
