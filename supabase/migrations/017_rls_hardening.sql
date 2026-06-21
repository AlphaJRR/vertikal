-- =============================================================================
-- 017_rls_hardening.sql — RLS hardening + atomic redeem + public QR filter
-- Run AFTER 001–016 in Supabase SQL Editor. Idempotent (safe to re-run).
--
-- Fixes:
--   • WITH CHECK on events / attendees UPDATE policies
--   • RLS on event_products, discount_codes, order_items, print_jobs,
--     consent_log, install_events
--   • Atomic redeem_attendee_code (race-safe single claim)
--   • get_event_public filters inactive / expired events
--   • consent_log + install_events policies that keep the app working
--     (attendee consent inserts, QR scan attribution)
-- =============================================================================

-- 1) Fix UPDATE policies with explicit WITH CHECK

drop policy if exists events_owner_update on public.events;
create policy events_owner_update on public.events
  for update
  using (photographer_id = auth.uid())
  with check (photographer_id = auth.uid());

drop policy if exists attendee_self_update on public.attendees;
create policy attendee_self_update on public.attendees
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- 2) Enable and secure RLS on remaining event tables

alter table public.event_products enable row level security;
alter table public.discount_codes enable row level security;
alter table public.order_items enable row level security;
alter table public.print_jobs enable row level security;
alter table public.consent_log enable row level security;
alter table public.install_events enable row level security;

-- event_products: owner manages, attendees can read catalog for their event

drop policy if exists event_products_owner_all on public.event_products;
create policy event_products_owner_all on public.event_products
  for all
  using (
    exists (
      select 1 from public.events e
      where e.id = event_products.event_id
        and e.photographer_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.events e
      where e.id = event_products.event_id
        and e.photographer_id = auth.uid()
    )
  );

drop policy if exists event_products_attendee_read on public.event_products;
create policy event_products_attendee_read on public.event_products
  for select
  using (
    exists (
      select 1
      from public.attendees a
      where a.event_id = event_products.event_id
        and a.user_id = auth.uid()
        and a.deleted_at is null
    )
  );

-- discount_codes: owner-only

drop policy if exists discount_codes_owner_all on public.discount_codes;
create policy discount_codes_owner_all on public.discount_codes
  for all
  using (
    exists (
      select 1 from public.events e
      where e.id = discount_codes.event_id
        and e.photographer_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.events e
      where e.id = discount_codes.event_id
        and e.photographer_id = auth.uid()
    )
  );

-- order_items: readable by order visibility; writable by order owner (photographer)

drop policy if exists order_items_order_read on public.order_items;
create policy order_items_order_read on public.order_items
  for select
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id
        and (
          exists (
            select 1 from public.attendees a
            where a.id = o.attendee_id and a.user_id = auth.uid()
          )
          or exists (
            select 1 from public.events e
            where e.id = o.event_id and e.photographer_id = auth.uid()
          )
        )
    )
  );

drop policy if exists order_items_owner_write on public.order_items;
create policy order_items_owner_write on public.order_items
  for all
  using (
    exists (
      select 1
      from public.orders o
      join public.events e on e.id = o.event_id
      where o.id = order_items.order_id
        and e.photographer_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.orders o
      join public.events e on e.id = o.event_id
      where o.id = order_items.order_id
        and e.photographer_id = auth.uid()
    )
  );

-- print_jobs: owner-only

drop policy if exists print_jobs_owner_all on public.print_jobs;
create policy print_jobs_owner_all on public.print_jobs
  for all
  using (
    exists (
      select 1
      from public.orders o
      join public.events e on e.id = o.event_id
      where o.id = print_jobs.order_id
        and e.photographer_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.orders o
      join public.events e on e.id = o.event_id
      where o.id = print_jobs.order_id
        and e.photographer_id = auth.uid()
    )
  );

-- consent_log: attendee reads/writes own; owner reads for their event guests

drop policy if exists consent_log_attendee_read on public.consent_log;
create policy consent_log_attendee_read on public.consent_log
  for select
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

drop policy if exists consent_log_owner_all on public.consent_log;

drop policy if exists consent_log_owner_read on public.consent_log;
create policy consent_log_owner_read on public.consent_log
  for select
  using (
    attendee_id is not null
    and exists (
      select 1
      from public.attendees a
      join public.events e on e.id = a.event_id
      where a.id = consent_log.attendee_id
        and e.photographer_id = auth.uid()
    )
  );

-- install_events: QR/install attribution (anon insert) + owner/operator read

drop policy if exists install_events_owner_all on public.install_events;

drop policy if exists install_events_public_insert on public.install_events;
create policy install_events_public_insert on public.install_events
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from public.events e
      where e.id = install_events.event_id
        and e.status = 'active'
        and (e.expires_at is null or e.expires_at > now())
    )
  );

drop policy if exists install_events_owner_select on public.install_events;
create policy install_events_owner_select on public.install_events
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.events e
      where e.id = install_events.event_id
        and (
          e.photographer_id = auth.uid()
          or public.is_event_operator()
        )
    )
  );

-- 3) Redeem code hardening (atomic claim — prevents double-redemption race)

create or replace function public.redeem_attendee_code(p_code text)
returns table (attendee_id uuid, event_id uuid, event_name text)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_att_id uuid;
  v_event_id uuid;
  v_event_name text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select a.id, a.event_id, e.name
    into v_att_id, v_event_id, v_event_name
  from public.attendees a
  join public.events e on e.id = a.event_id
  where upper(a.redeem_code) = upper(trim(p_code))
    and a.deleted_at is null
    and a.user_id = auth.uid()
  limit 1;

  if found then
    return query select v_att_id, v_event_id, v_event_name;
    return;
  end if;

  with claimed as (
    update public.attendees a
       set user_id = auth.uid()
     where upper(a.redeem_code) = upper(trim(p_code))
       and a.deleted_at is null
       and a.user_id is null
     returning a.id, a.event_id
  )
  select c.id, c.event_id, e.name
    into v_att_id, v_event_id, v_event_name
  from claimed c
  join public.events e on e.id = c.event_id
  limit 1;

  if found then
    return query select v_att_id, v_event_id, v_event_name;
    return;
  end if;

  if exists (
    select 1 from public.attendees a
    where upper(a.redeem_code) = upper(trim(p_code))
      and a.deleted_at is null
      and a.user_id is not null
      and a.user_id <> auth.uid()
  ) then
    raise exception 'Code already claimed';
  end if;

  raise exception 'Invalid code';
end;
$$;

revoke all on function public.redeem_attendee_code(text) from public;
grant execute on function public.redeem_attendee_code(text) to authenticated;

do $$
begin
  if not exists (select 1 from public.attendees where redeem_code is null) then
    alter table public.attendees alter column redeem_code set not null;
  end if;
end $$;

-- 4) Restrict public QR lookup to active / non-expired events

create or replace function public.get_event_public(p_qr_token text)
returns table (id uuid, name text, cover_image_url text, event_date date, status text)
language sql
security definer
set search_path = public, pg_temp
as $$
  select e.id, e.name, e.cover_image_url, e.event_date, e.status
  from public.events e
  where e.qr_token = p_qr_token
    and e.status = 'active'
    and (e.expires_at is null or e.expires_at > now())
  limit 1;
$$;

revoke all on function public.get_event_public(text) from public;
grant execute on function public.get_event_public(text) to anon, authenticated;
