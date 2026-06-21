-- =============================================================================
-- 015_event_welcome_message.sql — per-event welcome copy for empty galleries
-- Run AFTER 004. Idempotent.
-- =============================================================================

alter table public.events
  add column if not exists welcome_message text;

comment on column public.events.welcome_message is
  'Shown to guests after redeem when no photos are assigned yet.';

-- Demo event default copy
update public.events
set welcome_message = coalesce(
  welcome_message,
  'You''re in the right place! Your photos aren''t ready yet — check back soon or turn on alerts below.'
)
where id = 'a0000000-de00-de00-de00-000000000001';
