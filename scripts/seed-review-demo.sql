-- =============================================================================
-- AVA App Store Review Demo Seed
-- =============================================================================
-- Run this ONCE in the Supabase SQL editor (service-role — bypasses RLS).
-- Run AFTER migrations 001–006 are applied.
--
-- BEFORE running this script you must create two auth accounts manually in
-- Supabase Dashboard → Authentication → Users → "Add user":
--
--   1. reviewer@alphavisualartists.com      (operator / photographer)
--      password: AVAReview2026!
--
--   2. reviewer.attendee@alphavisualartists.com  (standard user / attendee)
--      password: AVAReview2026!
--
-- Then copy their UUIDs into the two variables below.
-- =============================================================================

-- ⚠️ FILL THESE IN from Supabase → Auth → Users:
do $$
declare
  operator_id uuid := '<PASTE-OPERATOR-USER-UUID-HERE>';
  attendee_id uuid := '<PASTE-ATTENDEE-USER-UUID-HERE>';
  demo_event_id uuid := 'a0000000-demo-demo-demo-000000000001';
  demo_attendee_row_id uuid := 'b0000000-demo-demo-demo-000000000001';
begin

  -- ── 1. Grant operator status ──────────────────────────────────────────────
  insert into public.event_operators (user_id, note)
  values (operator_id, 'App Store Reviewer – Operator Demo Account')
  on conflict (user_id) do nothing;

  -- ── 2. Accept ToS + age gate for both accounts (skip consent on review) ───
  update public.profiles
  set
    tos_accepted_at        = now(),
    age_gate_confirmed_at  = now(),
    marketing_opt_in       = false
  where id in (operator_id, attendee_id);

  -- ── 3. Create the demo event ──────────────────────────────────────────────
  insert into public.events (
    id, photographer_id, name, event_date,
    access_code, qr_token, event_type, status
  )
  values (
    demo_event_id,
    operator_id,
    'AVA Demo Shoot',
    current_date,
    'AVADEMO',
    'demo-qr-token-review-2026',
    'reunion',
    'active'
  )
  on conflict (id) do nothing;

  -- ── 4. Create the demo attendee row (linked to the attendee account) ──────
  --    redeem_code is forced to 'DEMO01' so the reviewer knows it.
  --    The trigger in 005 normally auto-generates it; we override here.
  insert into public.attendees (
    id, event_id, user_id,
    first_name, last_name, email,
    redeem_code,
    photo_consent_at, terms_accepted_at,
    is_adult, marketing_opt_in
  )
  values (
    demo_attendee_row_id,
    demo_event_id,
    attendee_id,
    'Demo', 'Reviewer',
    'reviewer.attendee@alphavisualartists.com',
    'DEMO01',
    -- photo_consent_at intentionally NULL so the App Store reviewer
    -- sees the full per-event Photo Release screen when redeeming DEMO01.
    -- (terms_accepted_at covers the account-level ToS; photo consent is
    -- a separate per-event step stored here.)
    null, now(),
    true, false
  )
  on conflict (id) do nothing;

  -- ── 5. Log consent for the attendee (audit trail) ─────────────────────────
  -- NOTE: photo_release is NOT pre-logged here because photo_consent_at is
  -- intentionally null. The real photo_release log row is written by the app
  -- when the reviewer accepts the Photo Release screen at redeem time.
  insert into public.consent_log (attendee_id, consent_type, granted)
  values
    (demo_attendee_row_id, 'age_confirm', true),
    (demo_attendee_row_id, 'terms',       true),
    (demo_attendee_row_id, 'marketing',   false);

  raise notice 'Demo seed complete.';
  raise notice 'Operator UUID: %', operator_id;
  raise notice 'Attendee UUID: %', attendee_id;
  raise notice 'Demo event ID: %', demo_event_id;
  raise notice 'Attendee redeem code: DEMO01';
  raise notice '';
  raise notice 'NEXT STEP: sign in as the operator and upload 2-3 photos to';
  raise notice '"AVA Demo Shoot", then assign them to "Demo Reviewer" (DEMO01).';

end $$;

-- =============================================================================
-- VERIFICATION QUERIES (run after the block above)
-- =============================================================================
-- select * from event_operators;
-- select id, name, access_code, qr_token from events where name = 'AVA Demo Shoot';
-- select id, first_name, redeem_code, photo_consent_at, user_id from attendees where event_id = 'a0000000-demo-demo-demo-000000000001';

-- =============================================================================
-- RESET — run this after each test session to restore full demo state
-- =============================================================================
-- This ensures the App Store reviewer always sees the Photo Release screen
-- when they redeem DEMO01, regardless of how many times the flow was tested.
--
-- UPDATE public.attendees
-- SET
--   user_id          = null,          -- unlinks the attendee account so redeem works fresh
--   photo_consent_at = null           -- ensures photo-release screen appears on next redeem
-- WHERE redeem_code = 'DEMO01';
--
-- Also delete the photo_release consent_log entry written by the app during testing:
-- DELETE FROM public.consent_log
-- WHERE attendee_id = 'b0000000-demo-demo-demo-000000000001'
--   AND consent_type = 'photo_release';
