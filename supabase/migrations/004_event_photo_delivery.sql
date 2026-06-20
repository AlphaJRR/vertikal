-- =============================================================================
-- AVA EVENT PHOTO DELIVERY — MVP MIGRATION
-- Supabase / Postgres. Additive: does NOT touch existing Alpha Creators tables.
-- Privacy is enforced here at the DB layer (RLS), not in app code.
-- Run in Supabase SQL editor or as a migration. Idempotent-safe via IF NOT EXISTS.
-- =============================================================================

-- ----------------------------------------------------------------------------
-- TABLES
-- ----------------------------------------------------------------------------
create table if not exists events (
  id              uuid primary key default gen_random_uuid(),
  photographer_id uuid not null references auth.users(id),
  name            text not null,
  event_date      date,
  cover_image_url text,
  access_code     text not null,
  qr_token        text not null unique default encode(gen_random_bytes(12),'hex'),
  event_type      text not null default 'reunion',
  status          text not null default 'active',   -- draft|active|expired|archived
  expires_at      timestamptz,
  created_at      timestamptz not null default now()
);
create index if not exists idx_events_photographer on events(photographer_id);

create table if not exists event_photos (
  id           uuid primary key default gen_random_uuid(),
  event_id     uuid not null references events(id) on delete cascade,
  storage_path text not null,
  thumb_path   text not null,
  filename     text,
  source       text not null default 'manual',      -- sony|manual|batch
  exif         jsonb,
  uploaded_at  timestamptz not null default now()
);
create index if not exists idx_photos_event on event_photos(event_id);

create table if not exists attendees (
  id                uuid primary key default gen_random_uuid(),
  event_id          uuid not null references events(id) on delete cascade,
  user_id           uuid references auth.users(id),
  first_name        text,
  last_name         text,
  email             text,                            -- name+email required at signup
  phone             text,                            -- OPTIONAL (data minimization)
  is_adult          boolean not null default true,   -- age-gate (minors/COPPA)
  marketing_opt_in  boolean not null default false,  -- explicit, un-pre-checked
  photo_consent_at  timestamptz,
  terms_accepted_at timestamptz,
  deleted_at        timestamptz,
  created_at        timestamptz not null default now(),
  unique (event_id, email)
);
create index if not exists idx_attendees_event on attendees(event_id);
create index if not exists idx_attendees_user  on attendees(user_id);

create table if not exists attendee_interests (
  attendee_id uuid references attendees(id) on delete cascade,
  interest    text,   -- family_portraits|graduation|sports|video_production
  primary key (attendee_id, interest)
);

create table if not exists photo_assignments (
  id          uuid primary key default gen_random_uuid(),
  photo_id    uuid not null references event_photos(id) on delete cascade,
  attendee_id uuid not null references attendees(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  unique (photo_id, attendee_id)
);
create index if not exists idx_assign_attendee on photo_assignments(attendee_id);

create table if not exists event_products (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references events(id) on delete cascade,
  kind       text not null,   -- print_4x6|print_5x7|print_pkg (PHYSICAL → Stripe)
  title      text,
  price_cents int not null default 0,
  metadata   jsonb
);

create table if not exists discount_codes (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid references events(id) on delete cascade,
  code        text not null,
  percent_off int,
  amount_off_cents int,
  max_uses    int,
  used_count  int not null default 0,
  unique (event_id, code)
);

create table if not exists orders (
  id           uuid primary key default gen_random_uuid(),
  event_id     uuid references events(id),
  attendee_id  uuid references attendees(id),
  amount_cents int not null,
  status       text not null default 'pending',   -- pending|paid|refunded
  fulfillment  text not null default 'print',      -- print only in MVP
  stripe_pi    text,
  created_at   timestamptz not null default now()
);

create table if not exists order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid references orders(id) on delete cascade,
  photo_id   uuid references event_photos(id),
  product_id uuid references event_products(id),
  price_cents int
);

create table if not exists print_jobs (
  id          uuid primary key default gen_random_uuid(),
  photo_id    uuid references event_photos(id),
  attendee_id uuid references attendees(id),
  order_id    uuid references orders(id),
  status      text not null default 'queued',   -- queued|printing|done|failed
  created_at  timestamptz not null default now()
);

create table if not exists consent_log (
  id           uuid primary key default gen_random_uuid(),
  attendee_id  uuid references attendees(id) on delete cascade,
  consent_type text,   -- photo_release|marketing|terms|age_confirm
  granted      boolean,
  granted_at   timestamptz not null default now()
);

create table if not exists install_events (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid references events(id),
  type       text,   -- qr_scan|install|account_created
  device_id  text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- ROW-LEVEL SECURITY  (the privacy guarantee)
-- ----------------------------------------------------------------------------
alter table events            enable row level security;
alter table event_photos      enable row level security;
alter table attendees         enable row level security;
alter table photo_assignments enable row level security;
alter table attendee_interests enable row level security;
alter table orders            enable row level security;

-- Helper: is the current user the photographer who owns this event?
-- (inlined in policies below to avoid an extra function dependency)

-- EVENTS: photographer manages own events. Attendees may read an event row only
-- if they belong to it (needed to render event name/cover in their gallery).
drop policy if exists events_owner on events;
create policy events_owner on events
  for all using (photographer_id = auth.uid());

drop policy if exists events_attendee_read on events;
create policy events_attendee_read on events
  for select using (
    exists (select 1 from attendees a
            where a.event_id = events.id
              and a.user_id = auth.uid()
              and a.deleted_at is null)
  );

-- EVENT_PHOTOS: attendee reads ONLY assigned photos; photographer manages all.
drop policy if exists photos_attendee_read on event_photos;
create policy photos_attendee_read on event_photos
  for select using (
    exists (
      select 1
      from photo_assignments pa
      join attendees a on a.id = pa.attendee_id
      where pa.photo_id = event_photos.id
        and a.user_id = auth.uid()
        and a.deleted_at is null
    )
  );

drop policy if exists photos_owner_all on event_photos;
create policy photos_owner_all on event_photos
  for all using (
    exists (select 1 from events e
            where e.id = event_photos.event_id
              and e.photographer_id = auth.uid())
  );

-- ATTENDEES: a user reads/edits own attendee row; photographer reads all in own event.
drop policy if exists attendee_self on attendees;
create policy attendee_self on attendees
  for select using (
    user_id = auth.uid()
    or exists (select 1 from events e
               where e.id = attendees.event_id
                 and e.photographer_id = auth.uid())
  );

drop policy if exists attendee_self_update on attendees;
create policy attendee_self_update on attendees
  for update using (user_id = auth.uid());

-- ASSIGNMENTS: attendee may read their own; photographer manages all in own event.
drop policy if exists assign_attendee_read on photo_assignments;
create policy assign_attendee_read on photo_assignments
  for select using (
    exists (select 1 from attendees a
            where a.id = photo_assignments.attendee_id
              and a.user_id = auth.uid())
    or exists (select 1 from events e
               join event_photos p on p.event_id = e.id
               where p.id = photo_assignments.photo_id
                 and e.photographer_id = auth.uid())
  );

drop policy if exists assign_owner_all on photo_assignments;
create policy assign_owner_all on photo_assignments
  for all using (
    exists (select 1 from event_photos p
            join events e on e.id = p.event_id
            where p.id = photo_assignments.photo_id
              and e.photographer_id = auth.uid())
  );

-- INTERESTS: own only.
drop policy if exists interests_self on attendee_interests;
create policy interests_self on attendee_interests
  for all using (
    exists (select 1 from attendees a
            where a.id = attendee_interests.attendee_id
              and a.user_id = auth.uid())
  );

-- ORDERS: attendee sees own; photographer sees own event orders.
drop policy if exists orders_self on orders;
create policy orders_self on orders
  for select using (
    exists (select 1 from attendees a
            where a.id = orders.attendee_id and a.user_id = auth.uid())
    or exists (select 1 from events e
               where e.id = orders.event_id and e.photographer_id = auth.uid())
  );

-- ----------------------------------------------------------------------------
-- STORAGE BUCKETS (run once; private — access only via signed URLs)
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('event-originals','event-originals', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('event-previews','event-previews', false)
on conflict (id) do nothing;

-- NOTE: full-res downloads and previews are served via signed URLs minted by the
-- `mint-download-url` edge function AFTER an assignment/entitlement check.
-- Never make these buckets public.
