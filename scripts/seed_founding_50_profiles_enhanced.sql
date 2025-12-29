-- ============================================
-- VERTIKAL SEED DATA v1.0 (ENHANCED)
-- Date: 2024-12-13
-- Purpose: Populate initial Founding 50 + test waitlist
-- Safety: Idempotent (safe to run multiple times)
-- ============================================

-- PRE-FLIGHT CHECK: Verify tables exist
DO $$ 
BEGIN
  -- Verify User table exists
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'User') THEN
    RAISE EXCEPTION 'Table public.User does not exist';
  END IF;
  
  -- Verify Profile table exists
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'Profile') THEN
    RAISE EXCEPTION 'Table public.Profile does not exist';
  END IF;
  
  -- Verify waitlist table exists
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'waitlist') THEN
    RAISE EXCEPTION 'Table public.waitlist does not exist';
  END IF;
END $$;

-- ============================================
-- SEED 1: USER RECORDS (Required for Profile.userId FK)
-- ============================================
INSERT INTO "User" (id, email, username, "passwordHash", role, "coinBalance", "updatedAt")
VALUES
  ('00000000-0000-0000-0000-000000000001', 'jr@vertikal.app', 'jr_visuals', '$2a$10$placeholder', 'CREATOR', 0, NOW()),
  ('00000000-0000-0000-0000-000000000002', 'sarah@vertikal.app', 'chicago_stories', '$2a$10$placeholder', 'CREATOR', 0, NOW()),
  ('00000000-0000-0000-0000-000000000003', 'marcus@vertikal.app', 'windy_city_drama', '$2a$10$placeholder', 'CREATOR', 0, NOW()),
  ('00000000-0000-0000-0000-000000000004', 'alpha@vertikal.app', 'alpha_life', '$2a$10$placeholder', 'CREATOR', 0, NOW()),
  ('00000000-0000-0000-0000-000000000005', 'davon@vertikal.app', 'visual_poet', '$2a$10$placeholder', 'CREATOR', 0, NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SEED 2: FOUNDING 50 PROFILES
-- ============================================
INSERT INTO "Profile" (id, "userId", "displayName", bio, "avatarUrl", type, "isVerified", "isFounding50", "followerCount", "totalViews")
VALUES
  -- 1. JR (THE FOUNDER)
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'J.R. Roberts',
    'Founder & Chief Evangelist. Building the platform I needed as a filmmaker.',
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    'CREATOR',
    true,
    true,
    1200000,
    68000000
  ),
  -- 2. EXAMPLE CREATOR (DOCS)
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000002',
    'Sarah Jenkins',
    'Documentary filmmaker. Telling Chicago stories.',
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    'CREATOR',
    true,
    true,
    450000,
    12000000
  ),
  -- 3. EXAMPLE CREATOR (SERIES)
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000003',
    'Marcus Thorne',
    'Scripted series creator. Windy City Drama.',
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    'CREATOR',
    true,
    true,
    320000,
    8500000
  ),
  -- 4. EXAMPLE CREATOR (REALITY)
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000004',
    'Alpha Team',
    'Reality content creators. Alpha Life series.',
    'https://images.pexels.com/photos/2589653/pexels-photo-2589653.jpeg?auto=compress&cs=tinysrgb&w=400',
    'CREATOR',
    true,
    true,
    280000,
    6200000
  ),
  -- 5. EXAMPLE CREATOR (VISUAL ART)
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000005',
    'Davon Lewis',
    'Visual poet. Experimental cinema.',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    'CREATOR',
    false,
    false,
    95000,
    2100000
  )
ON CONFLICT ("userId") DO NOTHING;

-- ============================================
-- SEED 3: TEST WAITLIST ENTRIES
-- ============================================
INSERT INTO public.waitlist (name, email, city, handle, type, referral_source, status, timestamp)
VALUES
  ('Test User 1', 'test1@vertikal.com', 'Chicago', NULL, 'user', 'manual_seed', 'pending', NOW()),
  ('Test User 2', 'test2@vertikal.com', 'New York', NULL, 'user', 'manual_seed', 'pending', NOW()),
  ('Test Creator 1', 'creator1@vertikal.com', 'Chicago', '@filmmaker_joe', 'creator', 'manual_seed', 'pending', NOW()),
  ('Test Creator 2', 'creator2@vertikal.com', 'Atlanta', '@cinema_queen', 'creator', 'manual_seed', 'pending', NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check profiles count
SELECT 
  COUNT(*) as profile_count,
  COUNT(*) FILTER (WHERE "isFounding50" = true) as founding_50_count,
  COUNT(*) FILTER (WHERE "isVerified" = true) as verified_count
FROM "Profile";

-- Check waitlist count
SELECT 
  COUNT(*) as waitlist_count,
  COUNT(*) FILTER (WHERE type = 'creator') as creator_signups,
  COUNT(*) FILTER (WHERE type = 'user') as user_signups
FROM public.waitlist;

-- Display seeded Founding 50 profiles
SELECT 
  "displayName", 
  "isFounding50", 
  "isVerified", 
  "followerCount", 
  "totalViews",
  "avatarUrl"
FROM "Profile"
WHERE "isFounding50" = true
ORDER BY "followerCount" DESC;

-- Display waitlist entries
SELECT 
  name, 
  email, 
  type, 
  referral_source,
  status,
  timestamp
FROM public.waitlist
ORDER BY timestamp DESC;

