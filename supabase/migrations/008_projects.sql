-- =============================================================================
-- 008_projects.sql — Multi-project cloud sync
-- =============================================================================
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  data        jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_projects_user on public.projects(user_id);

alter table public.projects enable row level security;

create policy "projects_owner_all" on public.projects
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.touch_updated_at();
