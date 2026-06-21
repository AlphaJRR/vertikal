/**
 * Invisible guest session — no email, no password.
 * Supabase anonymous auth satisfies redeem_attendee_code (needs auth.uid()).
 *
 * Enable in Supabase Dashboard → Authentication → Providers → Anonymous sign-ins.
 */

import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

export async function ensureGuestSession(): Promise<Session> {
  const { data: existing, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr) {
    console.error('[guestSession] getSession failed:', sessionErr.message);
  }
  if (existing.session) {
    return existing.session;
  }

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    if (error.message.toLowerCase().includes('anonymous')) {
      throw new Error(
        'Guest access is not enabled on the server. Turn on Anonymous sign-ins in Supabase Auth settings.',
      );
    }
    throw error;
  }
  if (!data.session) {
    throw new Error('Could not start a guest session. Try again.');
  }
  return data.session;
}

export function isAnonymousSession(session: Session | null): boolean {
  return session?.user?.is_anonymous === true;
}
