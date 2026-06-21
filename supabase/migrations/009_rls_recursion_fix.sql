-- =============================================================================
-- 009_rls_recursion_fix.sql — break events ↔ attendees RLS infinite recursion
-- Run AFTER 004–006. Idempotent.
--
-- Symptom: select from events → "infinite recursion detected in policy for
-- relation events". Operator grant is fine; Events tab cannot load or create.
-- =============================================================================

create or replace function user_owns_event(p_event_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from events e
    where e.id = p_event_id
      and e.photographer_id = auth.uid()
  );
$$;

create or replace function user_is_attendee_of_event(p_event_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from attendees a
    where a.event_id = p_event_id
      and a.user_id = auth.uid()
      and a.deleted_at is null
  );
$$;

revoke all on function user_owns_event(uuid) from public;
revoke all on function user_is_attendee_of_event(uuid) from public;
grant execute on function user_owns_event(uuid) to authenticated;
grant execute on function user_is_attendee_of_event(uuid) to authenticated;

drop policy if exists events_attendee_read on events;
create policy events_attendee_read on events
  for select using (user_is_attendee_of_event(id));

drop policy if exists attendee_self on attendees;
create policy attendee_self on attendees
  for select using (
    user_id = auth.uid()
    or user_owns_event(event_id)
  );
