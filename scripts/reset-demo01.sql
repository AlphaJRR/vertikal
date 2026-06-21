-- Reset DEMO01 for fresh attendee gallery testing (run in Supabase SQL editor).
-- Use when photos show as assigned in operator UI but gallery stays empty/welcome.

-- 1) Unlink attendee account so redeem works on this device again
UPDATE public.attendees
SET
  user_id          = NULL,
  photo_consent_at = NULL
WHERE upper(redeem_code) = 'DEMO01'
  AND deleted_at IS NULL;

-- 2) Remove photo-release consent written during prior tests
DELETE FROM public.consent_log
WHERE attendee_id IN (
  SELECT id FROM public.attendees WHERE upper(redeem_code) = 'DEMO01'
)
AND consent_type = 'photo_release';

-- Verify assignments still exist (should return rows if operator assigned photos):
-- SELECT pa.*, a.first_name, a.redeem_code
-- FROM photo_assignments pa
-- JOIN attendees a ON a.id = pa.attendee_id
-- WHERE upper(a.redeem_code) = 'DEMO01';

-- After running: open app → Events → enter DEMO01 → complete photo release → gallery.
