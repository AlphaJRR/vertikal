-- =============================================================================
-- 021_event_video_support.sql — video delivery in event galleries
-- Run AFTER 004–020. Idempotent.
-- =============================================================================

alter table public.event_photos
  add column if not exists media_kind text not null default 'photo';

comment on column public.event_photos.media_kind is
  'photo | video — attendee gallery + assign flow treat both as event media.';

-- Backfill: infer from filename when obvious
update public.event_photos
set media_kind = 'video'
where media_kind = 'photo'
  and (
    lower(coalesce(filename, storage_path)) like '%.mp4'
    or lower(coalesce(filename, storage_path)) like '%.mov'
    or lower(coalesce(filename, storage_path)) like '%.m4v'
  );
