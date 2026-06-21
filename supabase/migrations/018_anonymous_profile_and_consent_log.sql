-- =============================================================================
-- 018_anonymous_profile_and_consent_log.sql
-- Run in Supabase SQL Editor after 017.
--
-- Fixes "Could not save your preferences" on /consent for anonymous guests:
--   • handle_new_user failed when auth.users.email is NULL (anonymous auth)
--   • profiles.email is NOT NULL — upsert without email was rejected
--   • consent_log must allow attendee_id IS NULL for account-level consent rows
-- =============================================================================

-- 1) Auto-create profiles for anonymous users (no email on auth.users)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
begin
  v_email := coalesce(
    nullif(trim(NEW.email), ''),
    'guest-' || replace(NEW.id::text, '-', '') || '@guest.alphavisualartists.com'
  );

  insert into public.profiles (id, email, full_name, subscription_tier)
  values (
    NEW.id,
    v_email,
    coalesce(NEW.raw_user_meta_data->>'full_name', ''),
    'free'
  )
  on conflict (id) do nothing;

  return NEW;
end;
$$;

-- Backfill any auth users missing a profile row (anonymous + legacy)
insert into public.profiles (id, email, full_name, subscription_tier)
select
  u.id,
  coalesce(
    nullif(trim(u.email), ''),
    'guest-' || replace(u.id::text, '-', '') || '@guest.alphavisualartists.com'
  ),
  coalesce(u.raw_user_meta_data->>'full_name', ''),
  'free'
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
);

-- 2) consent_log — account-level rows use attendee_id NULL (Before we start screen)

drop policy if exists consent_log_attendee_read on public.consent_log;
create policy consent_log_attendee_read on public.consent_log
  for select
  to authenticated
  using (
    attendee_id is null
    or exists (
      select 1
      from public.attendees a
      where a.id = consent_log.attendee_id
        and a.user_id = auth.uid()
        and a.deleted_at is null
    )
  );

drop policy if exists consent_log_self_insert on public.consent_log;
create policy consent_log_self_insert on public.consent_log
  for insert
  to authenticated
  with check (
    attendee_id is null
    or exists (
      select 1
      from public.attendees a
      where a.id = consent_log.attendee_id
        and a.user_id = auth.uid()
        and a.deleted_at is null
    )
  );

-- 3) profiles UPDATE — explicit WITH CHECK (prevent id swap)
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
