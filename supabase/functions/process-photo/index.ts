/**
 * process-photo edge function
 *
 * Called by the upload queue after an original is in the event-originals bucket.
 * 1. Downloads original from event-originals
 * 2. Generates a 400px-wide thumbnail using imagescript (pure Deno, no native deps)
 * 3. Applies a text watermark: "© [event name]"
 * 4. Uploads thumbnail to event-previews bucket
 * 5. INSERTs the event_photos row with both storage_path + thumb_path
 *    (thumb_path NOT NULL constraint met — no placeholder needed)
 *
 * Request body: { eventId, storagePath, filename?, source? }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Image }        from 'https://deno.land/x/imagescript@1.2.17/index.js';

const SUPABASE_URL  = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ORIGINALS     = 'event-originals';
const PREVIEWS      = 'event-previews';
const THUMB_W       = 400;

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors() });

  try {
    const { eventId, storagePath, filename, source = 'manual' } =
      await req.json() as { eventId: string; storagePath: string; filename?: string; source?: string };

    if (!eventId || !storagePath) return err('Missing eventId or storagePath', 400);

    // ── Verify event exists ──────────────────────────────────────────────────
    const { data: event } = await admin.from('events').select('name').eq('id', eventId).single();
    if (!event) return err('Event not found', 404);

    // ── Download original ────────────────────────────────────────────────────
    const { data: file, error: dlErr } = await admin.storage
      .from(ORIGINALS)
      .download(storagePath);
    if (dlErr || !file) return err(`Download failed: ${dlErr?.message}`, 500);

    const original = new Uint8Array(await file.arrayBuffer());

    // ── Decode + resize ──────────────────────────────────────────────────────
    let img: InstanceType<typeof Image>;
    try {
      img = await Image.decode(original);
    } catch (e) {
      return err(`Decode failed: ${String(e)}`, 422);
    }

    const aspect = img.height / img.width;
    const thumb  = img.clone().resize(THUMB_W, Math.round(THUMB_W * aspect));

    // ── Watermark (text bar at bottom) ────────────────────────────────────────
    const watermarked = img.clone();
    const barH   = Math.max(36, Math.round(img.height * 0.055));
    const barY   = img.height - barH;
    watermarked.fill((_, y) => (y >= barY ? 0x00000099 : null));
    await watermarked.drawText(`© ${event.name as string}`, {
      x:     10,
      y:     barY + 8,
      size:  Math.max(13, Math.round(img.width * 0.024)),
      color: 0xFFFFFFCC,
    }).catch(() => { /* drawText may not exist in all imagescript builds — non-fatal */ });

    const thumbBytes = await thumb.encode(1 /* JPEG */);
    const wmBytes    = await watermarked.encode(1 /* JPEG */);

    // ── Upload preview (watermarked thumbnail) to event-previews ─────────────
    const thumbPath = storagePath.replace('/original', '/thumb');
    const { error: upErr } = await admin.storage
      .from(PREVIEWS)
      .upload(thumbPath, thumbBytes, { contentType: 'image/jpeg', upsert: true });
    if (upErr) return err(`Preview upload failed: ${upErr.message}`, 500);

    // Optionally also store a full-watermarked version alongside the preview
    const wmPath = storagePath.replace('/original', '/watermarked');
    await admin.storage
      .from(PREVIEWS)
      .upload(wmPath, wmBytes, { contentType: 'image/jpeg', upsert: true });

    // ── INSERT event_photos row (both paths now exist — NOT NULL satisfied) ───
    const { error: insErr } = await admin.from('event_photos').insert({
      event_id:     eventId,
      storage_path: storagePath,
      thumb_path:   thumbPath,
      filename:     filename ?? null,
      source:       source,
    });
    if (insErr) return err(`DB insert failed: ${insErr.message}`, 500);

    return new Response(JSON.stringify({ ok: true, thumbPath }), {
      headers: { ...cors(), 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[process-photo] unhandled:', e);
    return err('Internal server error', 500);
  }
});

function err(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status, headers: { ...cors(), 'Content-Type': 'application/json' },
  });
}
function cors() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}
