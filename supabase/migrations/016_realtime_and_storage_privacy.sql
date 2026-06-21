-- =============================================================================
-- 016_realtime_and_storage_privacy.sql — upload grid realtime + bucket privacy
-- Run in Supabase SQL Editor. Idempotent.
-- =============================================================================

-- Realtime: upload grid refreshes when process-photo inserts event_photos rows
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'event_photos'
  ) then
    alter publication supabase_realtime add table event_photos;
  end if;
end $$;

-- Buckets must stay private — access only via signed URLs (mint-download-url)
update storage.buckets
set public = false
where id in ('event-originals', 'event-previews');
