-- =============================================================================
-- 013_projects_mobile_schema.sql — align projects table with mobile app (008 intent)
-- Run AFTER 008. Idempotent.
--
-- Symptom: create project fails — PGRST204 "Could not find the 'data' column".
-- Cause: 001_initial_schema created projects with client_id; 008 used IF NOT EXISTS
-- and never added user_id / data jsonb.
-- =============================================================================

alter table public.projects
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.projects
  add column if not exists data jsonb not null default '{"shoot_pre":[],"shoot_day":[],"edit":[]}'::jsonb;

-- Backfill user_id from legacy client_id
update public.projects
set user_id = client_id
where user_id is null
  and client_id is not null;

-- Mobile-created projects don't need booking package fields
alter table public.projects alter column package_type drop not null;
alter table public.projects alter column package_type set default 'creator';

-- Replace legacy client-only RLS with owner policy (user_id or client_id)
drop policy if exists "Clients can view own projects" on public.projects;
drop policy if exists "Clients can create projects" on public.projects;
drop policy if exists "projects_owner_all" on public.projects;

create policy "projects_owner_all" on public.projects
  for all using (
    auth.uid() = user_id
    or auth.uid() = client_id
  )
  with check (
    auth.uid() = coalesce(user_id, client_id)
  );

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.touch_updated_at();
