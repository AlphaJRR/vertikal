-- =============================================================================
-- 014_operator_photo_preview_access.sql — operators read all event photos + previews
-- Run AFTER 011. Idempotent.
--
-- Symptom: Assign/Upload grids show black tiles; My Gallery works (mint-download-url).
-- Cause: client createSignedUrl on event-previews requires user_owns_event (photographer).
--        Review operators may be event_operators without owning every seeded event.
-- =============================================================================

-- Operators may SELECT every event photo (manage/assign/upload screens).
drop policy if exists photos_operator_select on event_photos;
create policy photos_operator_select on event_photos
  for select to authenticated
  using (is_event_operator());

-- Operators may read preview objects for any event (thumbnail grids).
drop policy if exists event_previews_operator_select on storage.objects;
create policy event_previews_operator_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'event-previews'
    and is_event_operator()
    and coalesce((storage.foldername(name))[1], '') <> ''
  );

-- Operators may assign photos they can see (not only event owners).
create or replace function user_can_manage_photo(p_photo_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select user_owns_photo(p_photo_id) or is_event_operator();
$$;

revoke all on function user_can_manage_photo(uuid) from public;
grant execute on function user_can_manage_photo(uuid) to authenticated;

drop policy if exists assign_owner_all on photo_assignments;
create policy assign_owner_all on photo_assignments
  for all using (user_can_manage_photo(photo_id))
  with check (user_can_manage_photo(photo_id));

drop policy if exists assign_attendee_read on photo_assignments;
create policy assign_attendee_read on photo_assignments
  for select using (
    exists (
      select 1 from attendees a
      where a.id = photo_assignments.attendee_id
        and a.user_id = auth.uid()
        and a.deleted_at is null
    )
    or user_can_manage_photo(photo_id)
  );
