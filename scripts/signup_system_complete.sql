-- ============================================
-- COMPLETE SIGNUP SYSTEM - END-TO-END
-- JACK — Program Lead / Ship-Now Mode
-- ============================================
-- 
-- PURPOSE: Real signup system that works TONIGHT
-- INSTRUCTIONS: Run this ENTIRE script in Supabase SQL Editor
--
-- ============================================

-- ============================================
-- STEP 1: CREATE TABLES
-- ============================================

-- PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null,
  display_name text,
  avatar_url text,
  role text not null default 'user', -- user | creator | admin
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- CREATOR APPLICATIONS TABLE
create table if not exists public.creator_applications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'submitted', -- submitted | approved | rejected
  notes text,
  created_at timestamptz not null default now()
);

-- BADGES TABLE
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null
);

-- PROFILE BADGES TABLE (Many-to-Many)
create table if not exists public.profile_badges (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (profile_id, badge_id)
);

-- ============================================
-- STEP 2: SEED BADGES
-- ============================================

insert into public.badges (code, label)
values 
  ('FOUNDING_50', 'Founding 50'),
  ('FOUNDING_200', 'Founding 200'),
  ('VERIFIED_CREATOR', 'Verified Creator')
on conflict (code) do nothing;

-- ============================================
-- STEP 3: CREATE TRIGGER FUNCTION
-- ============================================

create or replace function public.set_updated_at()
returns trigger as $$
begin 
  new.updated_at = now(); 
  return new; 
end;
$$ language plpgsql;

-- ============================================
-- STEP 4: CREATE TRIGGER
-- ============================================

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- ============================================
-- STEP 5: ENABLE ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.creator_applications enable row level security;
alter table public.badges enable row level security;
alter table public.profile_badges enable row level security;

-- ============================================
-- STEP 6: DROP EXISTING POLICIES (CLEAN SLATE)
-- ============================================

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_select_public" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;

drop policy if exists "apps_insert_own" on public.creator_applications;
drop policy if exists "apps_select_own" on public.creator_applications;
drop policy if exists "Users can view their own applications" on public.creator_applications;
drop policy if exists "Users can create applications" on public.creator_applications;

drop policy if exists "badges_read_all" on public.badges;
drop policy if exists "Badges are viewable by everyone" on public.badges;

drop policy if exists "profile_badges_read_all" on public.profile_badges;
drop policy if exists "Profile badges are viewable by everyone" on public.profile_badges;

-- ============================================
-- STEP 7: CREATE RLS POLICIES (CRITICAL)
-- ============================================

-- PROFILES: Users can create/read/update only themselves
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

-- Allow public read for profiles (so we can show creator profiles)
create policy "profiles_select_public"
on public.profiles for select
to public
using (true);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- CREATOR APPLICATIONS: Users can submit + read their own
create policy "apps_insert_own"
on public.creator_applications for insert
to authenticated
with check (auth.uid() = profile_id);

create policy "apps_select_own"
on public.creator_applications for select
to authenticated
using (auth.uid() = profile_id);

-- BADGES: Readable by all authenticated users (so UI can render badge names)
create policy "badges_read_all"
on public.badges for select
to authenticated
using (true);

-- Also allow public read for badges
create policy "badges_read_public"
on public.badges for select
to public
using (true);

-- PROFILE BADGES: Readable by all (so we can show badges on profiles)
create policy "profile_badges_read_all"
on public.profile_badges for select
to authenticated
using (true);

create policy "profile_badges_read_public"
on public.profile_badges for select
to public
using (true);

-- ============================================
-- STEP 8: CREATE INDEXES (PERFORMANCE)
-- ============================================

create index if not exists idx_profiles_handle on public.profiles(handle);
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_applications_status on public.creator_applications(status);
create index if not exists idx_applications_profile on public.creator_applications(profile_id);
create index if not exists idx_profile_badges_active on public.profile_badges(active);
create index if not exists idx_profile_badges_profile on public.profile_badges(profile_id);

-- ============================================
-- STEP 9: AUTO-CREATE PROFILE FUNCTION (OPTIONAL BUT RECOMMENDED)
-- ============================================

-- This function can be called from a trigger or from your app
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Profile will be created by frontend after signup
  -- This is here for reference - you can trigger it manually if needed
  return new;
end;
$$ language plpgsql security definer;

-- ============================================
-- VERIFICATION QUERIES (Run separately to test)
-- ============================================

-- Check tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('profiles', 'creator_applications', 'badges', 'profile_badges');

-- Check badges seeded
-- SELECT * FROM public.badges;

-- Check RLS enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('profiles', 'creator_applications', 'badges', 'profile_badges');

-- Check policies exist
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('profiles', 'creator_applications', 'badges', 'profile_badges');

-- ============================================
-- MANUAL ADMIN APPROVAL SQL (For testing)
-- ============================================
-- 
-- Replace 'USER_UUID' with actual user UUID:
--
-- UPDATE public.creator_applications
-- SET status='approved'
-- WHERE profile_id='USER_UUID';
--
-- UPDATE public.profiles
-- SET role='creator'
-- WHERE id='USER_UUID';
--
-- INSERT INTO public.profile_badges (profile_id, badge_id, active)
-- SELECT 'USER_UUID', b.id, true
-- FROM public.badges b
-- WHERE b.code='FOUNDING_50'
-- ON CONFLICT (profile_id, badge_id) DO UPDATE SET active=true;
--
-- ============================================

