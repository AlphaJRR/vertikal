-- =============================================================================
-- 010_attendee_operator_insert.sql — operator POS: create attendees + photo RLS
-- Run AFTER 009. Idempotent.
--
-- Symptom: "Could not create attendee" — 42501 RLS (no INSERT policy on attendees).
-- Also fixes event_photos / photo_assignments owner policies that recurse via events.
-- =============================================================================

-- ── Attendees: operator inserts buyer rows at the sale station ───────────────
drop policy if exists attendees_operator_insert on attendees;
create policy attendees_operator_insert on attendees
  for insert with check (
    user_owns_event(event_id)
    and is_event_operator()
  );

-- Photographer may update attendee rows in their own events (assign, notes, etc.)
drop policy if exists attendees_operator_update on attendees;
create policy attendees_operator_update on attendees
  for update using (
    user_owns_event(event_id)
    and is_event_operator()
  );

-- ── event_photos: use SECURITY DEFINER helper (avoid events subquery recursion) ─
drop policy if exists photos_owner_all on event_photos;
create policy photos_owner_all on event_photos
  for all using (user_owns_event(event_id))
  with check (user_owns_event(event_id));

-- ── photo_assignments: helper for owner checks ───────────────────────────────
create or replace function user_owns_photo(p_photo_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from event_photos p
    join events e on e.id = p.event_id
    where p.id = p_photo_id
      and e.photographer_id = auth.uid()
  );
$$;

revoke all on function user_owns_photo(uuid) from public;
grant execute on function user_owns_photo(uuid) to authenticated;

drop policy if exists assign_owner_all on photo_assignments;
create policy assign_owner_all on photo_assignments
  for all using (user_owns_photo(photo_id))
  with check (user_owns_photo(photo_id));

drop policy if exists assign_attendee_read on photo_assignments;
create policy assign_attendee_read on photo_assignments
  for select using (
    exists (
      select 1 from attendees a
      where a.id = photo_assignments.attendee_id
        and a.user_id = auth.uid()
        and a.deleted_at is null
    )
    or user_owns_photo(photo_id)
  );
