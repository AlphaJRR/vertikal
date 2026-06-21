-- =============================================================================
-- 012_attendee_report.sql — POS photo count + optional contact requirement + report
-- Run AFTER 011. Idempotent.
--
-- photos_purchased: how many digital photos the buyer paid for offline (POS).
-- require_attendee_contact: event flag — buyer must supply phone OR email at POS.
-- =============================================================================

alter table attendees
  add column if not exists photos_purchased int not null default 0;

alter table attendees
  drop constraint if exists attendees_photos_purchased_nonneg;

alter table attendees
  add constraint attendees_photos_purchased_nonneg
  check (photos_purchased >= 0);

alter table events
  add column if not exists require_attendee_contact boolean not null default false;

-- AVA Demo Shoot: require phone or email so ops can reach buyers manually.
update public.events
set require_attendee_contact = true
where id = 'a0000000-de00-de00-de00-000000000001';

create or replace function enforce_attendee_contact()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1 from events e
    where e.id = new.event_id
      and e.require_attendee_contact
  ) then
    if coalesce(trim(new.email), '') = ''
       and coalesce(trim(new.phone), '') = '' then
      raise exception 'Phone or email is required for this event'
        using errcode = '23514';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enforce_attendee_contact on attendees;
create trigger trg_enforce_attendee_contact
  before insert or update on attendees
  for each row execute function enforce_attendee_contact();
