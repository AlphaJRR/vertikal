-- ============================================
-- SUPABASE SCHEMA FOR JAN 1 CREATOR FUNNEL
-- GEMI — VP Data & Infrastructure
-- ============================================
-- 
-- PURPOSE: DB foundation for Jan 1 funnel + badges + future Stream support
-- INSTRUCTIONS: Run this in Supabase SQL Editor
--
-- ============================================

-- PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null,
  display_name text,
  avatar_url text,
  role text not null default 'user', -- user | creator
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- CREATOR APPLICATIONS
create table if not exists public.creator_applications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'submitted', -- submitted | approved | rejected
  notes text,
  created_at timestamptz not null default now()
);

-- BADGES
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null
);

create table if not exists public.profile_badges (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (profile_id, badge_id)
);

-- VIDEOS (stores Cloudflare Stream IDs later)
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  creator_profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  stream_video_id text,
  thumbnail_url text,
  visibility text not null default 'public',
  created_at timestamptz not null default now()
);

-- SEED BADGES
insert into public.badges (code, label)
values
  ('FOUNDING_50', 'Founding 50'),
  ('FOUNDING_200', 'Founding 200'),
  ('VERIFIED_CREATOR', 'Verified Creator')
on conflict (code) do nothing;

-- UPDATED_AT TRIGGER FUNCTION
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- UPDATED_AT TRIGGER
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.creator_applications enable row level security;
alter table public.badges enable row level security;
alter table public.profile_badges enable row level security;
alter table public.videos enable row level security;

-- POLICIES: Profiles (public read, own write)
create policy "Public profiles are viewable by everyone"
on public.profiles for select
using (true);

create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id);

create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

-- POLICIES: Creator Applications (own read/write, admin read all)
create policy "Users can view their own applications"
on public.creator_applications for select
using (auth.uid() = (select id from public.profiles where id = profile_id));

create policy "Users can create applications"
on public.creator_applications for insert
with check (auth.uid() = (select id from public.profiles where id = profile_id));

-- POLICIES: Badges (public read)
create policy "Badges are viewable by everyone"
on public.badges for select
using (true);

create policy "Profile badges are viewable by everyone"
on public.profile_badges for select
using (true);

-- POLICIES: Videos (public read, creator write)
create policy "Videos are viewable by everyone"
on public.videos for select
using (visibility = 'public' or auth.uid() = creator_profile_id);

create policy "Creators can insert their own videos"
on public.videos for insert
with check (auth.uid() = creator_profile_id);

-- INDEXES
create index if not exists idx_profiles_handle on public.profiles(handle);
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_applications_status on public.creator_applications(status);
create index if not exists idx_applications_profile on public.creator_applications(profile_id);
create index if not exists idx_profile_badges_active on public.profile_badges(active);
create index if not exists idx_videos_creator on public.videos(creator_profile_id);

-- ============================================
-- VERIFICATION QUERIES (Run separately):
-- ============================================
-- SELECT * FROM public.badges;
-- SELECT * FROM public.profiles LIMIT 10;
-- SELECT * FROM public.creator_applications ORDER BY created_at DESC LIMIT 10;
-- ============================================

