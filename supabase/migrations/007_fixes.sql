-- =============================================================================
-- 007_event_fixes.sql — fixes for consent model + QR event lookup
-- Run AFTER 001–006. Additive + idempotent.
--
-- Resolves three reported bugs:
--   * profiles missing tos_accepted_at / age_gate_confirmed_at / marketing_opt_in
--   * consent flow querying attendees (which doesn't exist yet for new users)
--   * QR join screen can't resolve an event pre-auth under 004 RLS
--
-- CONSENT MODEL (the clean split):
--   • ACCOUNT-level consent (18+ age gate, Terms) → profiles, captured ONCE at signup.
--   • PHOTO-RELEASE consent (per event) → attendees.photo_consent_at + consent_log,
--     captured at redeem time before that event's gallery opens.
-- =============================================================================
-- ----------------------------------------------------------------------------
-- 1) ACCOUNT-LEVEL CONSENT COLUMNS ON profiles
-- ----------------------------------------------------------------------------
alter table profiles add column if not exists age_gate_confirmed_at timestamptz;
alter table profiles add column if not exists tos_accepted_at        timestamptz;
alter table profiles add column if not exists marketing_opt_in       boolean not null default false;
-- Make sure a user can UPDATE their own profile row (needed to persist consent).
-- Only added if no UPDATE policy already exists, to avoid duplicating/loosening.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and cmd = 'UPDATE'
  ) then
    execute 'create policy profiles_self_update on profiles
             for update using (id = auth.uid()) with check (id = auth.uid())';
  end if;
end $$;
-- ----------------------------------------------------------------------------
-- 2) PUBLIC EVENT LOOKUP BY QR TOKEN  (join screen, pre-auth / pre-redeem)
--    qr_token is an unguessable 24-hex secret, so resolving minimal public
--    fields for a known token is safe. Never returns photographer_id/access_code.
-- ----------------------------------------------------------------------------
create or replace function get_event_public(p_qr_token text)
returns table (id uuid, name text, cover_image_url text, event_date date, status text)
language sql
security definer
set search_path = public
as $$
  select e.id, e.name, e.cover_image_url, e.event_date, e.status
  from events e
  where e.qr_token = p_qr_token
  limit 1;
$$;
revoke all on function get_event_public(text) from public;
grant execute on function get_event_public(text) to anon, authenticated;
-- ----------------------------------------------------------------------------
-- NOTE: no schema change needed for photo-release consent — attendees already
-- has photo_consent_at (004). The fix for "gallery opens without photo consent"
-- is in app code: after redeem, if photo_consent_at is null, show the photo-
-- release step (write photo_consent_at + a consent_log row) BEFORE /gallery.
-- =============================================================================
