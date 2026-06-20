-- =============================================================================
-- 005_triggers.sql — CODE-UNLOCK / OFFLINE-PAYMENT MODEL
-- Run AFTER the 004 schema migration. Additive + idempotent (safe to re-run).
--
-- Model: payment happens OFFLINE. The photographer creates an attendee, the
-- system generates a unique redeem_code (their "receipt"), photos are assigned,
-- and the buyer enters that code in the app to unlock ONLY their assigned photos.
-- The CODE is the sole authorization. No email auto-linking, no payments in-app.
-- =============================================================================

-- ----------------------------------------------------------------------------
-- 1) REDEEM CODE GENERATOR  (short, human-typable, no ambiguous chars 0/O/1/I)
-- ----------------------------------------------------------------------------
create or replace function gen_redeem_code()
returns text
language sql
as $$
  select string_agg(
    substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
           (floor(random()*32)+1)::int, 1), '')
  from generate_series(1, 6);   -- 6 chars ≈ 1B combinations; bump to 8 for more entropy
$$;

-- Add the column if 004 doesn't already define it, backfill, enforce uniqueness
alter table attendees add column if not exists redeem_code text;

update attendees
set redeem_code = gen_redeem_code()
where redeem_code is null;

create unique index if not exists idx_attendees_redeem_code
  on attendees(redeem_code);

-- ----------------------------------------------------------------------------
-- 2) AUTO-ASSIGN A UNIQUE CODE ON INSERT  (collision-safe loop)
-- ----------------------------------------------------------------------------
create or replace function set_redeem_code()
returns trigger
language plpgsql
as $$
begin
  if new.redeem_code is null then
    loop
      new.redeem_code := gen_redeem_code();
      exit when not exists (
        select 1 from attendees where redeem_code = new.redeem_code
      );
    end loop;
  end if;
  return new;
end $$;

drop trigger if exists trg_set_redeem_code on attendees;
create trigger trg_set_redeem_code
  before insert on attendees
  for each row execute function set_redeem_code();

-- ----------------------------------------------------------------------------
-- 3) REDEMPTION RPC  (the app calls this when the buyer enters their code)
--    SECURITY DEFINER so it can claim the row past RLS — but it is gated by
--    possession of the valid code, and a claimed code can't be stolen.
-- ----------------------------------------------------------------------------
create or replace function redeem_attendee_code(p_code text)
returns table (attendee_id uuid, event_id uuid, event_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_att attendees%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_att
  from attendees
  where upper(redeem_code) = upper(trim(p_code))
    and deleted_at is null
  limit 1;

  if not found then
    raise exception 'Invalid code';
  end if;

  -- First redemption claims the gallery for this user.
  -- Same user re-entering = fine. A different user = blocked (already claimed).
  if v_att.user_id is null then
    update attendees set user_id = auth.uid() where id = v_att.id;
  elsif v_att.user_id <> auth.uid() then
    raise exception 'Code already claimed';
  end if;

  return query
    select a.id, a.event_id, e.name
    from attendees a
    join events e on e.id = a.event_id
    where a.id = v_att.id;
end $$;

revoke all on function redeem_attendee_code(text) from public;
grant execute on function redeem_attendee_code(text) to authenticated;

-- ----------------------------------------------------------------------------
-- NOTES
-- * NO email auto-linking trigger by design: the CODE is the authorization,
--   not the email. This prevents anyone from claiming a gallery by guessing an
--   email at signup. Do not add an auth.users email-match trigger for access.
-- * After redemption, RLS (policy photos_attendee_read in 004) resolves the
--   gallery: attendee.user_id = auth.uid() → only assigned photos are visible.
-- * No payments anywhere. orders / order_items / print_jobs / event_products /
--   discount_codes are UNUSED in v1 (offline payment). Leave them or ignore them.
-- * Optional hardening for production: log failed redeem attempts + rate-limit
--   the RPC at the edge to deter brute-forcing 6-char codes.
-- =============================================================================
