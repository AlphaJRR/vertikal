/**
 * process-photo edge function
 *
 * Called after an original lands in event-originals.
 * v2: inserts the event_photos row only — preview grids use Supabase Storage
 * image transforms on the original (width 400) via mint-download-url.
 * No full-res copy into event-previews (privacy + performance).
 *
 * Request body: { eventId, storagePath, filename?, source? }
 */

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ORIGINALS    = 'event-originals';

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors() });

  try {
    const { eventId, storagePath, filename, source = 'manual' } =
      await req.json() as { eventId: string; storagePath: string; filename?: string; source?: string };

    if (!eventId || !storagePath) return err('Missing eventId or storagePath', 400);

    const { data: event } = await admin.from('events').select('name').eq('id', eventId).single();
    if (!event) return err('Event not found', 404);

    const { data: file, error: dlErr } = await admin.storage
      .from(ORIGINALS)
      .download(storagePath);
    if (dlErr || !file) return err(`Download failed: ${dlErr?.message}`, 500);

    const original = new Uint8Array(await file.arrayBuffer());
    if (original.byteLength === 0) return err('Downloaded file is empty', 422);

    const { data: existing } = await admin
      .from('event_photos')
      .select('id')
      .eq('storage_path', storagePath)
      .maybeSingle();
    if (existing) {
      return json({ ok: true, thumbPath: storagePath, duplicate: true });
    }

    const { error: insErr } = await admin.from('event_photos').insert({
      event_id:     eventId,
      storage_path: storagePath,
      thumb_path:   storagePath,
      filename:     filename ?? null,
      source:       source,
    });
    if (insErr) return err(`DB insert failed: ${insErr.message}`, 500);

    return json({ ok: true, thumbPath: storagePath });
  } catch (e) {
    console.error('[process-photo] unhandled:', e);
    return err('Internal server error', 500);
  }
});

function json(body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    headers: { ...cors(), 'Content-Type': 'application/json' },
  });
}

function err(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...cors(), 'Content-Type': 'application/json' },
  });
}

function cors() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}
