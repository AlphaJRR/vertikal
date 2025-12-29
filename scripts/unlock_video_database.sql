-- ============================================
-- UNLOCK VIDEO DATABASE (DEV MODE ONLY)
-- VERTIKAL - Emergency Database Access Fix
-- ============================================
-- 
-- PURPOSE: Remove RLS policies blocking Episode reads
-- WARNING: This opens ALL episodes to public read access
-- USE CASE: Development/Testing only
--
-- INSTRUCTIONS:
-- 1. Open Supabase Dashboard → SQL Editor
-- 2. Copy the SQL below (starting from Step 1)
-- 3. Paste into SQL Editor
-- 4. Click "Run"
-- 5. Verify videos appear in Series tab
--
-- ============================================

-- Step 1: DROP EXISTING POLICIES (Clear the way)
DROP POLICY IF EXISTS "Enable read access for all users" ON "Episode";
DROP POLICY IF EXISTS "Public Episodes are viewable by everyone" ON "Episode";
DROP POLICY IF EXISTS "Allow Public Read" ON "Episode";

-- Step 2: OPEN THE GATES (Allow ALL reads)
CREATE POLICY "Allow Public Read"
ON "Episode"
FOR SELECT
USING (true);

-- Step 3: ENSURE RLS IS ON (Required for policy to work)
ALTER TABLE "Episode" ENABLE ROW LEVEL SECURITY;

-- Step 4: VERIFY (Check if episodes are accessible)
-- Run this query separately to verify:
-- SELECT id, title, "videoUrl" FROM "Episode" LIMIT 10;

-- ============================================
-- ROLLBACK (If you need to restore security):
-- ============================================
-- DROP POLICY IF EXISTS "Allow Public Read" ON "Episode";
-- CREATE POLICY "Authenticated users can view episodes"
-- ON "Episode"
-- FOR SELECT
-- TO authenticated
-- USING (true);
-- ============================================
