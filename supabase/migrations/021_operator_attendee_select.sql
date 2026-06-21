-- =============================================================================
-- 021_operator_attendee_select.sql
-- Run in Supabase SQL Editor (idempotent).
--
-- Symptom: Assign screen opens but attendee list is empty / assignment toggles fail
-- for operators on seeded demo events when photographer_id UUID mismatch.
-- Operators are admin-granted; allow read of attendee rows for assign/POS screens.
-- =============================================================================

drop policy if exists attendees_operator_select on public.attendees;
create policy attendees_operator_select on public.attendees
  for select to authenticated
  using (
    public.is_event_operator()
    and deleted_at is null
  );
