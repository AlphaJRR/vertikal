/**
 * lib/notify.ts — Local notification helpers for production note reminders.
 *
 * LOCAL ONLY. No push server. No EventKit. No Reminders entitlement.
 * Note content never leaves the device.
 * Privacy label does NOT change — no new data collected or transmitted.
 */

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const MAP_KEY = 'ava_note_reminders_v1';

// Configure foreground presentation
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotePhase = 'pre' | 'day' | 'post';

export interface ScheduleReminderParams {
  itemId:  string;
  phase:   NotePhase;
  title:   string;   // note text (shown in notification)
  body?:   string;   // optional subtitle
  date:    Date;     // absolute fire date (stored as-is, timezone-safe)
}

// ─── Permission ───────────────────────────────────────────────────────────────

// expo doesn't export PermissionResponse so the extended fields are hidden at the
// type level. We cast to this local shape which matches the runtime object.
type PermResult = { granted: boolean; canAskAgain: boolean };

export async function ensureNotifPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const existing = await Notifications.getPermissionsAsync() as unknown as PermResult;
  if (existing.granted) return true;
  if (!existing.canAskAgain) return false;  // already denied — don't re-prompt

  const result = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert:  true,
      allowSound:  true,
      allowBadge:  false,  // we don't use badges
    },
  }) as unknown as PermResult;
  return result.granted;
}

export async function getPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
  if (Platform.OS === 'web') return 'denied';
  const result = await Notifications.getPermissionsAsync() as unknown as PermResult;
  if (result.granted) return 'granted';
  if (!result.canAskAgain) return 'denied';
  return 'undetermined';
}

// ─── Schedule / Cancel ────────────────────────────────────────────────────────

export async function scheduleNoteReminder(params: ScheduleReminderParams): Promise<string | null> {
  const { itemId, phase, title, body, date } = params;

  // Guard: only future dates
  if (date.getTime() <= Date.now()) {
    console.warn('[notify] Attempted to schedule a reminder in the past');
    return null;
  }

  const granted = await ensureNotifPermission();
  if (!granted) return null;

  // Cancel any existing reminder for this item first
  await cancelNoteReminder(itemId);

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title:  title,
        body:   body ?? 'Tap to open your production notes.',
        sound:  true,
        data: {
          kind:   'note-reminder',
          phase,
          itemId,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
      },
    });

    await saveReminderMapping(itemId, notificationId, date.toISOString());
    return notificationId;
  } catch (err) {
    console.error('[notify] scheduleNotificationAsync failed:', err);
    return null;
  }
}

export async function cancelNoteReminder(itemId: string): Promise<void> {
  const map = await loadMap();
  const entry = map[itemId];
  if (!entry) return;

  try {
    await Notifications.cancelScheduledNotificationAsync(entry.notificationId);
  } catch {
    // already fired or cancelled — ignore
  }

  delete map[itemId];
  await saveMap(map);
}

export async function cancelAllNoteReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await saveMap({});
}

export async function listScheduled(): Promise<Notifications.NotificationRequest[]> {
  return Notifications.getAllScheduledNotificationsAsync();
}

export async function getReminderForItem(itemId: string): Promise<{ date: Date } | null> {
  const map = await loadMap();
  const entry = map[itemId];
  if (!entry) return null;
  return { date: new Date(entry.fireDate) };
}

// ─── Persistence ──────────────────────────────────────────────────────────────

interface ReminderEntry {
  notificationId: string;
  fireDate:       string;  // ISO string — absolute, timezone-safe
}

type ReminderMap = Record<string, ReminderEntry>;  // itemId → entry

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

async function saveReminderMapping(itemId: string, notificationId: string, fireDate: string): Promise<void> {
  const map = await loadMap();
  map[itemId] = { notificationId, fireDate };
  await saveMap(map);
}
