/**
 * delete-account edge function
 *
 * App Store Guideline 5.1.1(v): in-app account deletion required.
 *
 * Process (mirrors PRD Section 10):
 *   1. Soft-delete attendee rows: set deleted_at = now()
 *   2. Purge PII: null out first_name, last_name, email, phone on deleted rows
 *   3. Delete originals from event-originals for events they photographed
 *   4. Delete the auth.users row (cascades profiles; also cascades attendees
 *      via ON DELETE CASCADE but PII is already purged in step 2)
 *
 * Caller must be authenticated (their own JWT in Authorization header).
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY     = Deno.env.get('SUPABASE_ANON_KEY')!;

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors() });

  const auth = req.headers.get('Authorization');
  if (!auth) return err('Missing auth', 401);

  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false },
    global: { headers: { Authorization: auth } },
  });
  const { data: { user }, error: uErr } = await userClient.auth.getUser();
  if (uErr || !user) return err('Unauthorized', 401);

  try {
    const now = new Date().toISOString();

    // ── 1. Soft-delete attendee rows ──────────────────────────────────────
    await admin
      .from('attendees')
      .update({ deleted_at: now })
      .eq('user_id', user.id)
      .is('deleted_at', null);

    // ── 2. Purge PII on soft-deleted rows ─────────────────────────────────
    await admin
      .from('attendees')
      .update({
        first_name: null,
        last_name:  null,
        email:      null,
        phone:      null,
      })
      .eq('user_id', user.id);

    // ── 3. Delete original photos for events they photographed ────────────
    const { data: events } = await admin
      .from('events')
      .select('id')
      .eq('photographer_id', user.id);

    for (const event of (events ?? [])) {
      const { data: files } = await admin.storage
        .from('event-originals')
        .list(event.id as string, { limit: 1000 });

      if (files && files.length > 0) {
        const paths = files.map((f: { name: string }) => `${event.id as string}/${f.name}`);
        await admin.storage.from('event-originals').remove(paths);
      }
    }

    // ── 4. Delete auth user (cascades all remaining DB rows) ──────────────
    const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
    if (delErr) return err('Failed to delete auth user', 500);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...cors(), 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[delete-account]', e);
    return err('Internal server error', 500);
  }
});

function err(m: string, s: number) {
  return new Response(JSON.stringify({ error: m }), {
    status: s, headers: { ...cors(), 'Content-Type': 'application/json' },
  });
}
function cors() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}
