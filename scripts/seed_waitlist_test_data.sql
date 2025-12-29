-- ============================================
-- SEED DATA: TEST WAITLIST ENTRIES
-- VERTIKAL - Founder-Led Test Data
-- ============================================
-- 
-- PURPOSE: Populate waitlist table with test entries
-- SECURITY: No real PII. Safe for production.
-- IDEMPOTENT: Uses ON CONFLICT to prevent duplicates
--
-- INSTRUCTIONS:
-- 1. Run this in Supabase SQL Editor
-- 2. Verify: SELECT * FROM public.waitlist ORDER BY created_at DESC;
--
-- ============================================

INSERT INTO public.waitlist (name, email, city, handle, type, referral_source, status)
VALUES
  -- Test User Signups
  ('Test User 1', 'test1@vertikal.com', 'Chicago', NULL, 'user', 'manual_seed', 'pending'),
  ('Test User 2', 'test2@vertikal.com', 'New York', NULL, 'user', 'manual_seed', 'pending'),
  ('Test User 3', 'test3@vertikal.com', 'Los Angeles', NULL, 'user', 'manual_seed', 'pending'),
  
  -- Test Creator Applications
  ('Test Creator 1', 'creator1@vertikal.com', 'Chicago', '@filmmaker_joe', 'creator', 'manual_seed', 'pending'),
  ('Test Creator 2', 'creator2@vertikal.com', 'Atlanta', '@cinema_queen', 'creator', 'manual_seed', 'pending'),
  ('Test Creator 3', 'creator3@vertikal.com', 'Miami', '@docu_maker', 'creator', 'manual_seed', 'pending'),
  
  -- High-Value Creator (Should be reviewed)
  ('High Value Creator', 'highvalue@vertikal.com', 'Los Angeles', '@premium_content', 'creator', 'manual_seed', 'pending')
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- SELECT type, COUNT(*) as count, status
-- FROM public.waitlist
-- GROUP BY type, status
-- ORDER BY type, status;
-- ============================================

