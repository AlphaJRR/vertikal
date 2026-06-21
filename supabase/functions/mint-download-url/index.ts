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
 *   preview  → event-originals with Storage transform (width 400, never full-res)
 *   original → event-originals full-resolution (explicit download only)
 */

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY     = Deno.env.get('SUPABASE_ANON_KEY')!;
const ORIGINALS    = 'event-originals';
const PREVIEWS     = 'event-previews';
const TTL          = 3600;

const PREVIEW_TRANSFORM = { width: 400, quality: 60, resize: 'cover' as const };

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
    const { photoId, resolution = 'preview' } =
      await req.json() as { photoId: string; resolution?: 'preview' | 'original' };

    if (!photoId) return err('Missing photoId', 400);

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

    const { data: isOperator, error: opErr } = await userClient.rpc('is_event_operator');
    if (opErr) console.warn('[mint-download-url] is_event_operator RPC:', opErr.message);

    const isAssignedAttendee = (photo.photo_assignments as Array<{
      attendees: { user_id: string | null; deleted_at: string | null };
    }>).some(
      a => a.attendees.user_id === user.id && a.attendees.deleted_at === null,
    );

    if (!isPhotographer && !isAssignedAttendee && isOperator !== true) {
      return err('Access denied', 403);
    }

    const storagePath = photo.storage_path as string;
    const thumbPath   = photo.thumb_path as string;

    if (resolution === 'original') {
      const plain = await admin.storage.from(ORIGINALS).createSignedUrl(storagePath, TTL);
      if (plain.error || !plain.data?.signedUrl) {
        return err('Could not generate signed URL', 500);
      }
      return json({ signedUrl: plain.data.signedUrl, expiresIn: TTL });
    }

    // Preview: transformed original (never serve full-res for grid thumbnails)
    const transformed = await admin.storage.from(ORIGINALS).createSignedUrl(
      storagePath,
      TTL,
      { transform: PREVIEW_TRANSFORM },
    );
    if (!transformed.error && transformed.data?.signedUrl) {
      return json({ signedUrl: transformed.data.signedUrl, expiresIn: TTL });
    }

    // Legacy rows: thumb may live in event-previews from v1 process-photo
    if (thumbPath && thumbPath !== storagePath) {
      const legacy = await admin.storage.from(PREVIEWS).createSignedUrl(
        thumbPath,
        TTL,
        { transform: PREVIEW_TRANSFORM },
      );
      if (!legacy.error && legacy.data?.signedUrl) {
        return json({ signedUrl: legacy.data.signedUrl, expiresIn: TTL });
      }
    }

    console.error('[mint-download-url] preview transform failed:', transformed.error?.message);
    return err('Could not generate preview URL', 500);
  } catch (e) {
    console.error('[mint-download-url]', e);
    return err('Internal server error', 500);
  }
});

function json(body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    headers: { ...cors(), 'Content-Type': 'application/json' },
  });
}

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
