/**
 * Account-level consent (Before we start screen).
 * Guests with anonymous auth skip this — per-event photo-release covers them.
 */

import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface SaveAccountConsentInput {
  ageConfirm: boolean;
  terms:      boolean;
  marketing:  boolean;
}

/** Anonymous guests redeem by code only — no account consent gate. */
export function skipAccountConsent(user: User | null | undefined): boolean {
  return user?.is_anonymous === true;
}

export async function hasCompletedAccountConsent(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('tos_accepted_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('[accountConsent] profile read failed:', error.message);
    return false;
  }

  return Boolean(data?.tos_accepted_at);
}

export async function saveAccountConsent(
  input: SaveAccountConsentInput,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { error } = await supabase.rpc('save_account_consent', {
    p_age_confirm: input.ageConfirm,
    p_terms:       input.terms,
    p_marketing:   input.marketing,
  });

  if (!error) {
    return { ok: true };
  }

  console.error('[accountConsent] save_account_consent RPC failed:', error);

  const rpcMissing =
    error.code === 'PGRST202'
    || error.message.toLowerCase().includes('save_account_consent');

  if (!rpcMissing) {
    return { ok: false, message: error.message };
  }

  // Fallback until migration 019 is applied in Supabase SQL Editor
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, message: 'Not signed in' };
  }

  const now = new Date().toISOString();
  const email =
    user.email?.trim()
    || `guest-${user.id.replace(/-/g, '').slice(0, 12)}@guest.alphavisualartists.com`;

  const { error: upsertError } = await supabase.from('profiles').upsert({
    id:                    user.id,
    email,
    age_gate_confirmed_at: input.ageConfirm ? now : null,
    tos_accepted_at:       input.terms ? now : null,
    marketing_opt_in:      input.marketing,
  }, { onConflict: 'id' });

  if (upsertError) {
    return { ok: false, message: upsertError.message };
  }

  return { ok: true };
}

/** Route helper: should we show /consent before continuing? */
export async function needsAccountConsentScreen(
  user: User | null | undefined,
): Promise<boolean> {
  if (!user) return false;
  if (skipAccountConsent(user)) return false;
  return !(await hasCompletedAccountConsent(user.id));
}
