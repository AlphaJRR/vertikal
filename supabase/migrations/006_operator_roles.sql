-- =============================================================================
-- 006_operator_roles.sql — WHO CAN MANAGE EVENTS (operator vs. standard user)
-- Run AFTER 004 + 005. Additive + idempotent.
--
-- Security principle: operator status is GRANTED BY AN ADMIN (you), stored in a
-- table users CANNOT write to, and enforced by RLS. It is NOT a signup choice and
-- NOT a column users can flip. This prevents an attendee from granting themselves
-- the photographer dashboard.
-- =============================================================================

-- ----------------------------------------------------------------------------
-- 1) OPERATOR MEMBERSHIP TABLE  (users can READ their own status, never WRITE)
-- ----------------------------------------------------------------------------
create table if not exists event_operators (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  granted_at timestamptz not null default now(),
  note       text
);

alter table event_operators enable row level security;

-- A user may check IF THEY THEMSELVES are an operator. No insert/update/delete
-- policy exists for users → only the service role (Supabase dashboard / admin)
-- can grant operator status. This is the privilege-escalation guard.
drop policy if exists operator_read_self on event_operators;
create policy operator_read_self on event_operators
  for select using (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- 2) HELPER  (reusable in RLS + callable by the app)
-- ----------------------------------------------------------------------------
create or replace function is_event_operator()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from event_operators where user_id = auth.uid());
$$;

revoke all on function is_event_operator() from public;
grant execute on function is_event_operator() to authenticated;

-- ----------------------------------------------------------------------------
-- 3) GATE EVENT CREATION TO OPERATORS ONLY  (server-side, not UI-only)
--    Replaces the broad events_owner policy with explicit per-action policies.
-- ----------------------------------------------------------------------------
drop policy if exists events_owner on events;

create policy events_owner_select on events
  for select using (photographer_id = auth.uid());

create policy events_owner_update on events
  for update using (photographer_id = auth.uid());

create policy events_owner_delete on events
  for delete using (photographer_id = auth.uid());

-- INSERT requires BOTH ownership AND operator status. A non-operator literally
-- cannot create an event row even if they bypass the UI.
create policy events_operator_insert on events
  for insert with check (
    photographer_id = auth.uid() and is_event_operator()
  );

-- NOTE: the attendee-read policy from 004 (events_attendee_read) stays in place;
-- multiple SELECT policies are OR'd, so attendees can still read events they
-- belong to while operators manage their own.

-- ----------------------------------------------------------------------------
-- HOW TO GRANT OPERATOR ACCESS (you, manually, for your team)
--   In Supabase SQL editor (service role bypasses RLS):
--     insert into event_operators (user_id, note)
--     values ('<auth-user-uuid>', 'JR'),
--            ('<teammate-uuid>',  'Team');
--   Users cannot do this themselves — that's the point.
-- =============================================================================
