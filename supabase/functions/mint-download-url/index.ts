/**
 * mint-download-url edge function
 *
 * Generates a short-lived signed URL for an event_photo.
 * Privacy guarantee: verifies assignment AND deleted_at IS NULL before signing.
 * Guessing another attendee's photo UUID returns 403 — no information leakage.
 *
 * Request body: { photoId: string, resolution: 'preview' | 'original' }
 * Response:     { signedUrl: string, expiresIn: number }
 *
 * Buckets:
 *   preview  → event-previews  (watermarked thumbnail)
 *   original → event-originals (full-resolution, free download in v1)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY     = Deno.env.get('SUPABASE_ANON_KEY')!;
const TTL          = 3600; // 1 hour

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors() });

  // ── Authenticate caller ──────────────────────────────────────────────────
  const auth = req.headers.get('Authorization');
  if (!auth) return err('Missing auth', 401);

  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false },
    global: { headers: { Authorization: auth } },
  });
  const { data: { user }, error: uErr } = await userClient.auth.getUser();
  if (uErr || !user) return err('Unauthorized', 401);

  try {
    const { photoId, resolution = 'preview' } =
      await req.json() as { photoId: string; resolution?: 'preview' | 'original' };

    if (!photoId) return err('Missing photoId', 400);

    // ── Fetch photo with join to verify assignment ─────────────────────────
    const { data: photo } = await admin
      .from('event_photos')
      .select(`
        id, storage_path, thumb_path,
        events!inner (photographer_id),
        photo_assignments (
          attendee_id,
          attendees!inner (user_id, deleted_at)
        )
      `)
      .eq('id', photoId)
      .single();

    if (!photo) return err('Photo not found', 404);

    const isPhotographer =
      (photo.events as { photographer_id: string }).photographer_id === user.id;

    const isAssignedAttendee = (photo.photo_assignments as Array<{
      attendees: { user_id: string | null; deleted_at: string | null };
    }>).some(
      a => a.attendees.user_id === user.id && a.attendees.deleted_at === null,
    );

    if (!isPhotographer && !isAssignedAttendee) return err('Access denied', 403);

    // ── Determine bucket + path ───────────────────────────────────────────
    const bucket = resolution === 'original' ? 'event-originals' : 'event-previews';
    const path   = resolution === 'original'
      ? (photo.storage_path as string)
      : (photo.thumb_path   as string);

    const { data: signed, error: sErr } = await admin.storage
      .from(bucket)
      .createSignedUrl(path, TTL);

    if (sErr || !signed) return err('Could not generate signed URL', 500);

    return new Response(
      JSON.stringify({ signedUrl: signed.signedUrl, expiresIn: TTL }),
      { headers: { ...cors(), 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    console.error('[mint-download-url]', e);
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
