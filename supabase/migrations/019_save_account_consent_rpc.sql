-- =============================================================================
-- 019_save_account_consent_rpc.sql — bulletproof account consent save
-- Run in Supabase SQL Editor after 017/018.
--
-- Fixes persistent "Could not save your preferences" on /consent:
--   • Ensures profile row exists (anonymous users have no email)
--   • Writes profiles + consent_log via SECURITY DEFINER (bypasses RLS edge cases)
--   • Re-applies consent_log NULL attendee_id policies
-- =============================================================================

alter table public.profiles
  add column if not exists age_gate_confirmed_at timestamptz;

alter table public.profiles
  add column if not exists tos_accepted_at timestamptz;

alter table public.profiles
  add column if not exists marketing_opt_in boolean not null default false;

alter table public.profiles
  add column if not exists subscription_tier text not null default 'free';

-- Ensure profile exists for current user (anonymous-safe email)
create or replace function public.ensure_profile_for_user()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_meta_name text;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select
    coalesce(
      nullif(trim(u.email), ''),
      'guest-' || replace(u.id::text, '-', '') || '@guest.alphavisualartists.com'
    ),
    coalesce(u.raw_user_meta_data->>'full_name', '')
  into v_email, v_meta_name
  from auth.users u
  where u.id = v_uid;

  if v_email is null then
    v_email := 'guest-' || replace(v_uid::text, '-', '') || '@guest.alphavisualartists.com';
  end if;

  insert into public.profiles (id, email, full_name, subscription_tier, marketing_opt_in)
  values (v_uid, v_email, coalesce(v_meta_name, ''), 'free', false)
  on conflict (id) do update
    set email = excluded.email
    where public.profiles.email is null
       or trim(public.profiles.email) = '';
end;
$$;

revoke all on function public.ensure_profile_for_user() from public;
grant execute on function public.ensure_profile_for_user() to authenticated;

-- Single RPC used by app/consent.tsx
create or replace function public.save_account_consent(
  p_age_confirm boolean,
  p_terms       boolean,
  p_marketing   boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_now timestamptz := now();
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  if not coalesce(p_age_confirm, false) or not coalesce(p_terms, false) then
    raise exception 'Required consent not granted';
  end if;

  perform public.ensure_profile_for_user();

  update public.profiles
  set
    age_gate_confirmed_at = case when p_age_confirm then v_now else age_gate_confirmed_at end,
    tos_accepted_at       = case when p_terms then v_now else tos_accepted_at end,
    marketing_opt_in      = coalesce(p_marketing, false),
    updated_at            = v_now
  where id = v_uid;

  if not found then
    raise exception 'Profile not found after ensure';
  end if;

  insert into public.consent_log (attendee_id, consent_type, granted, granted_at)
  values
    (null, 'age_confirm', p_age_confirm, v_now),
    (null, 'terms',       p_terms,       v_now),
    (null, 'marketing',   coalesce(p_marketing, false), v_now);
end;
$$;

revoke all on function public.save_account_consent(boolean, boolean, boolean) from public;
grant execute on function public.save_account_consent(boolean, boolean, boolean) to authenticated;

-- Per-event photo release (gallery gate after redeem)
create or replace function public.save_photo_release_consent(
  p_attendee_id uuid,
  p_marketing   boolean default false
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_now timestamptz := now();
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  if p_attendee_id is null then
    raise exception 'Missing attendee id';
  end if;

  update public.attendees
  set
    photo_consent_at = v_now,
    marketing_opt_in = coalesce(p_marketing, false)
  where id = p_attendee_id
    and user_id = v_uid
    and deleted_at is null;

  if not found then
    raise exception 'Attendee not found or not owned by this session';
  end if;

  insert into public.consent_log (attendee_id, consent_type, granted, granted_at)
  values
    (p_attendee_id, 'photo_release', true,  v_now),
    (p_attendee_id, 'marketing',     coalesce(p_marketing, false), v_now);
end;
$$;

revoke all on function public.save_photo_release_consent(uuid, boolean) from public;
grant execute on function public.save_photo_release_consent(uuid, boolean) to authenticated;

-- consent_log — account-level rows MUST allow attendee_id IS NULL
alter table public.consent_log enable row level security;

drop policy if exists consent_log_attendee_read on public.consent_log;
create policy consent_log_attendee_read on public.consent_log
  for select to authenticated
  using (
    attendee_id is null
    or exists (
      select 1 from public.attendees a
      where a.id = consent_log.attendee_id
        and a.user_id = auth.uid()
        and a.deleted_at is null
    )
  );

drop policy if exists consent_log_self_insert on public.consent_log;
create policy consent_log_self_insert on public.consent_log
  for insert to authenticated
  with check (
    attendee_id is null
    or exists (
      select 1 from public.attendees a
      where a.id = consent_log.attendee_id
        and a.user_id = auth.uid()
        and a.deleted_at is null
    )
  );

-- Backfill profiles for any auth user still missing one
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
where not exists (select 1 from public.profiles p where p.id = u.id);
