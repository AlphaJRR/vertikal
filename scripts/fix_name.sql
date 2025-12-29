-- Fix the typo in the display name
-- Run this in Supabase Dashboard → SQL Editor → New Query

UPDATE "Profile"
SET "displayName" = 'J.R. Roberts'
WHERE "displayName" LIKE 'J.R.R%';

-- Verify the fix
SELECT id, "displayName", "userId" FROM "Profile" WHERE "displayName" = 'J.R. Roberts';

