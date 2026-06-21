-- =============================================================================
-- 011_storage_event_photos_policies.sql — allow operators to upload originals
-- Run AFTER 006 + 009 + 010. Idempotent.
--
-- Symptom: upload queue stuck at "3 remaining", storage error:
--   "new row violates row-level security policy" on event-originals bucket.
-- Path layout: event-originals/{event_id}/{item_id}/original
-- =============================================================================

drop policy if exists event_originals_operator_insert on storage.objects;
create policy event_originals_operator_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'event-originals'
    and coalesce((storage.foldername(name))[1], '') <> ''
    and user_owns_event(((storage.foldername(name))[1])::uuid)
    and is_event_operator()
  );

drop policy if exists event_originals_operator_select on storage.objects;
create policy event_originals_operator_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'event-originals'
    and coalesce((storage.foldername(name))[1], '') <> ''
    and user_owns_event(((storage.foldername(name))[1])::uuid)
    and is_event_operator()
  );

drop policy if exists event_originals_operator_update on storage.objects;
create policy event_originals_operator_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'event-originals'
    and coalesce((storage.foldername(name))[1], '') <> ''
    and user_owns_event(((storage.foldername(name))[1])::uuid)
    and is_event_operator()
  );

drop policy if exists event_originals_operator_delete on storage.objects;
create policy event_originals_operator_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'event-originals'
    and coalesce((storage.foldername(name))[1], '') <> ''
    and user_owns_event(((storage.foldername(name))[1])::uuid)
    and is_event_operator()
  );

-- Previews are written by the process-photo edge function (service role).
-- Operators may read previews for their own events (upload screen / assign grid).
drop policy if exists event_previews_operator_select on storage.objects;
create policy event_previews_operator_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'event-previews'
    and coalesce((storage.foldername(name))[1], '') <> ''
    and user_owns_event(((storage.foldername(name))[1])::uuid)
    and is_event_operator()
  );
