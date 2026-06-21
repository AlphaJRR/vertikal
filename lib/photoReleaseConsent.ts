/**
 * Per-event photo release — SECURITY DEFINER save (bypasses RLS edge cases).
 */

import { supabase } from '@/lib/supabase';

export async function savePhotoReleaseConsent(
  attendeeId: string,
  marketing: boolean,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { error } = await supabase.rpc('save_photo_release_consent', {
    p_attendee_id: attendeeId,
    p_marketing:   marketing,
  });

  if (!error) {
    return { ok: true };
  }

  console.error('[photoRelease] save_photo_release_consent RPC failed:', error);

  const rpcMissing =
    error.code === 'PGRST202'
    || error.message.toLowerCase().includes('save_photo_release_consent');

  if (rpcMissing) {
    const now = new Date().toISOString();
    const { error: updateErr } = await supabase
      .from('attendees')
      .update({ photo_consent_at: now, marketing_opt_in: marketing })
      .eq('id', attendeeId);
    if (updateErr) {
      return { ok: false, message: updateErr.message };
    }
    return { ok: true };
  }

  return { ok: false, message: error.message };
}
