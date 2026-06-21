-- =============================================================================
-- 020_fix_guest_signup_and_realtime.sql
-- Run in Supabase SQL Editor NOW (idempotent).
--
-- P0-A: Anonymous signup 500 — handle_new_user inserted NULL email into profiles
-- P0-B: Operator upload grid never live-updates — event_photos missing from realtime
--
-- Verified gap: 019 RPCs exist; this trigger + publication were still broken/missing.
-- =============================================================================

-- ─── Fix A: signup trigger (must match ensure_profile_for_user guest-email logic) ───

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

  insert into public.profiles (id, email, full_name, subscription_tier, marketing_opt_in)
  values (
    NEW.id,
    v_email,
    coalesce(NEW.raw_user_meta_data->>'full_name', ''),
    'free',
    false
  )
  on conflict (id) do update
    set email = excluded.email
    where public.profiles.email is null
       or trim(public.profiles.email) = '';

  return NEW;
end;
$$;

-- Re-bind trigger (safe if already exists)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill any auth.users still missing profiles (includes failed anonymous signups retried)
insert into public.profiles (id, email, full_name, subscription_tier, marketing_opt_in)
select
  u.id,
  coalesce(
    nullif(trim(u.email), ''),
    'guest-' || replace(u.id::text, '-', '') || '@guest.alphavisualartists.com'
  ),
  coalesce(u.raw_user_meta_data->>'full_name', ''),
  'free',
  false
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;

-- ─── Fix B: realtime publication for operator upload grid ───

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'event_photos'
  ) then
    alter publication supabase_realtime add table public.event_photos;
  end if;
end $$;

-- Buckets stay private (re-assert)
update storage.buckets
set public = false
where id in ('event-originals', 'event-previews');

-- ─── Verification (run output should match comments) ───

-- 1) Trigger function contains guest email fallback:
-- select prosrc from pg_proc where proname = 'handle_new_user';
-- EXPECT: guest-...@guest.alphavisualartists.com in prosrc

-- 2) Realtime publication includes event_photos:
-- select schemaname, tablename from pg_publication_tables
-- where pubname = 'supabase_realtime' and tablename = 'event_photos';
-- EXPECT: 1 row (public, event_photos)

-- 3) RPCs from 019 still present:
-- select proname from pg_proc
-- where proname in ('save_account_consent','save_photo_release_consent','ensure_profile_for_user');
-- EXPECT: 3 rows
