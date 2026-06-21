/**
 * Persists the attendee row unlocked by the last successful redeem.
 * Gallery hooks scope to this row so DEMO01 / multi-event users see the right photos.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const ATTENDEE_KEY = 'ava:last_attendee_id';
const EVENT_KEY    = 'ava:last_event_id';
const CODE_KEY     = 'ava:last_redeem_code';

export interface RedeemContext {
  attendeeId: string;
  eventId:    string;
  code:       string;
}

export async function saveRedeemContext(ctx: RedeemContext): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(ATTENDEE_KEY, ctx.attendeeId),
    AsyncStorage.setItem(EVENT_KEY, ctx.eventId),
    AsyncStorage.setItem(CODE_KEY, ctx.code),
  ]);
}

export async function loadRedeemContext(): Promise<RedeemContext | null> {
  try {
    const [attendeeId, eventId, code] = await Promise.all([
      AsyncStorage.getItem(ATTENDEE_KEY),
      AsyncStorage.getItem(EVENT_KEY),
      AsyncStorage.getItem(CODE_KEY),
    ]);
    if (!attendeeId || !eventId || !code) return null;
    return { attendeeId, eventId, code };
  } catch {
    return null;
  }
}

export async function clearRedeemContext(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(ATTENDEE_KEY),
    AsyncStorage.removeItem(EVENT_KEY),
    AsyncStorage.removeItem(CODE_KEY),
  ]);
}
