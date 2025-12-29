-- ============================================
-- SEED DATA: FOUNDING 50 PROFILES
-- VERTIKAL - Founder-Led Seed Pack
-- ============================================
-- 
-- PURPOSE: Populate Profile table with Founding 50 creators
-- SECURITY: No real PII. Safe for production.
-- IDEMPOTENT: Uses ON CONFLICT to prevent duplicates
--
-- INSTRUCTIONS:
-- 1. Run this in Supabase SQL Editor
-- 2. Verify: SELECT * FROM "Profile" WHERE "isFounding50" = true;
--
-- ============================================

-- Step 1: Create User records (required for Profile.userId foreign key)
INSERT INTO "User" (id, email, username, "passwordHash", role, "coinBalance", "updatedAt")
VALUES
  ('00000000-0000-0000-0000-000000000001', 'jr@vertikal.app', 'jr_visuals', '$2a$10$placeholder', 'CREATOR', 0, NOW()),
  ('00000000-0000-0000-0000-000000000002', 'sarah@vertikal.app', 'chicago_stories', '$2a$10$placeholder', 'CREATOR', 0, NOW()),
  ('00000000-0000-0000-0000-000000000003', 'marcus@vertikal.app', 'windy_city_drama', '$2a$10$placeholder', 'CREATOR', 0, NOW()),
  ('00000000-0000-0000-0000-000000000004', 'alpha@vertikal.app', 'alpha_life', '$2a$10$placeholder', 'CREATOR', 0, NOW()),
  ('00000000-0000-0000-0000-000000000005', 'davon@vertikal.app', 'visual_poet', '$2a$10$placeholder', 'CREATOR', 0, NOW())
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create Profile records (linked to Users above)
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
-- VERIFICATION QUERY
-- ============================================
-- SELECT "displayName", "isFounding50", "isVerified", "followerCount" 
-- FROM "Profile" 
-- WHERE "isFounding50" = true
-- ORDER BY "followerCount" DESC;
-- ============================================

