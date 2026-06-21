/**
 * lib/notify.ts — Production checklist reminders + gallery photo-ready alerts.
 *
 * Uses expo-notifications when the native module is present (App Store build).
 * Lazy-loads the module so OTA bundles on builds without it do not crash on launch.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, Platform } from 'react-native';

const MAP_KEY = 'ava_note_reminders_v1';

export type NotePhase = 'pre' | 'day' | 'post';

export interface ScheduleReminderParams {
  itemId: string;
  phase: NotePhase;
  title: string;
  body?: string;
  date: Date;
}

export type NotificationAvailability = 'available' | 'unavailable' | 'web';

type ExpoNotifications = typeof import('expo-notifications');

let notificationsModule: ExpoNotifications | null | undefined;

async function getNotifications(): Promise<ExpoNotifications | null> {
  if (Platform.OS === 'web') return null;
  if (notificationsModule !== undefined) return notificationsModule;

  try {
    const mod = await import('expo-notifications');
    mod.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    notificationsModule = mod;
    return mod;
  } catch (err) {
    console.warn('[notify] expo-notifications unavailable:', err);
    notificationsModule = null;
    return null;
  }
}

export async function getNotificationAvailability(): Promise<NotificationAvailability> {
  if (Platform.OS === 'web') return 'web';
  const mod = await getNotifications();
  return mod ? 'available' : 'unavailable';
}

export async function getPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
  const mod = await getNotifications();
  if (!mod) return 'undetermined';
  const { status } = await mod.getPermissionsAsync();
  if (status === 'granted') return 'granted';
  if (status === 'denied') return 'denied';
  return 'undetermined';
}

export async function ensureNotifPermission(): Promise<boolean> {
  const mod = await getNotifications();
  if (!mod) return false;

  const { status } = await mod.getPermissionsAsync();
  if (status === 'granted') return true;

  if (status === 'undetermined') {
    const req = await mod.requestPermissionsAsync();
    return req.status === 'granted';
  }

  await Linking.openSettings();
  return false;
}

export async function scheduleNoteReminder(params: ScheduleReminderParams): Promise<string | null> {
  const mod = await getNotifications();
  if (!mod) return null;

  const granted = await ensureNotifPermission();
  if (!granted) return null;

  if (params.date.getTime() <= Date.now()) return null;

  await cancelNoteReminder(params.itemId);

  const notificationId = await mod.scheduleNotificationAsync({
    content: {
      title: params.title,
      body:  params.body ?? 'Tap to open AVA.',
      sound: true,
    },
    trigger: {
      type: mod.SchedulableTriggerInputTypes.DATE,
      date: params.date,
    } as import('expo-notifications').DateTriggerInput,
  });

  const map = await loadMap();
  map[params.itemId] = { notificationId, fireDate: params.date.toISOString() };
  await saveMap(map);
  return notificationId;
}

export async function cancelNoteReminder(itemId: string): Promise<void> {
  const mod = await getNotifications();
  const map = await loadMap();
  const entry = map[itemId];
  if (entry && mod) {
    try {
      await mod.cancelScheduledNotificationAsync(entry.notificationId);
    } catch (err) {
      console.warn('[notify] cancel failed:', err);
    }
  }
  delete map[itemId];
  await saveMap(map);
}

export async function cancelAllNoteReminders(): Promise<void> {
  const mod = await getNotifications();
  if (mod) {
    try {
      await mod.cancelAllScheduledNotificationsAsync();
    } catch (err) {
      console.warn('[notify] cancelAll failed:', err);
    }
  }
  await saveMap({});
}

export async function listScheduled(): Promise<unknown[]> {
  const mod = await getNotifications();
  if (!mod) return [];
  try {
    return await mod.getAllScheduledNotificationsAsync();
  } catch {
    return [];
  }
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
