-- ============================================
-- SECURITY FIX MIGRATION
-- Fixes Supabase Advisor Security Issues
-- ============================================

-- ============================================
-- PART 1: ENABLE RLS ON ALL PUBLIC TABLES
-- ============================================

-- Enable RLS on all tables that are missing it
ALTER TABLE IF EXISTS "public"."Device" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."Season" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."Show" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."Interaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."AnalyticsLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."Comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."investor_quarantine" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."network_applications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "public"."videos" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 2: CREATE RLS POLICIES FOR ALL TABLES
-- ============================================

-- USER TABLE POLICIES
-- Users can read their own data, admins can read all
CREATE POLICY IF NOT EXISTS "Users can read own data"
ON "public"."User" FOR SELECT
TO authenticated
USING (auth.uid()::text = id);

CREATE POLICY IF NOT EXISTS "Users can update own data"
ON "public"."User" FOR UPDATE
TO authenticated
USING (auth.uid()::text = id)
WITH CHECK (auth.uid()::text = id);

-- PROFILE TABLE POLICIES
-- Public read, own write
CREATE POLICY IF NOT EXISTS "Profiles are publicly readable"
ON "public"."Profile" FOR SELECT
TO public
USING (true);

CREATE POLICY IF NOT EXISTS "Users can update own profile"
ON "public"."Profile" FOR UPDATE
TO authenticated
USING (auth.uid()::text = "userId")
WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY IF NOT EXISTS "Users can create own profile"
ON "public"."Profile" FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

-- DEVICE TABLE POLICIES
CREATE POLICY IF NOT EXISTS "Users can manage own devices"
ON "public"."Device" FOR ALL
TO authenticated
USING (auth.uid()::text = "userId")
WITH CHECK (auth.uid()::text = "userId");

-- SHOW TABLE POLICIES
-- Public read, creators can manage their own
CREATE POLICY IF NOT EXISTS "Shows are publicly readable"
ON "public"."Show" FOR SELECT
TO public
USING (true);

CREATE POLICY IF NOT EXISTS "Creators can manage own shows"
ON "public"."Show" FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."Profile"
    WHERE "Profile".id = "Show"."creatorId"
    AND "Profile"."userId" = auth.uid()::text
    AND "Profile".type = 'CREATOR'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "public"."Profile"
    WHERE "Profile".id = "Show"."creatorId"
    AND "Profile"."userId" = auth.uid()::text
    AND "Profile".type = 'CREATOR'
  )
);

-- SEASON TABLE POLICIES
CREATE POLICY IF NOT EXISTS "Seasons are publicly readable"
ON "public"."Season" FOR SELECT
TO public
USING (true);

CREATE POLICY IF NOT EXISTS "Creators can manage seasons for own shows"
ON "public"."Season" FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."Show"
    JOIN "public"."Profile" ON "Profile".id = "Show"."creatorId"
    WHERE "Show".id = "Season"."showId"
    AND "Profile"."userId" = auth.uid()::text
    AND "Profile".type = 'CREATOR'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "public"."Show"
    JOIN "public"."Profile" ON "Profile".id = "Show"."creatorId"
    WHERE "Show".id = "Season"."showId"
    AND "Profile"."userId" = auth.uid()::text
    AND "Profile".type = 'CREATOR'
  )
);

-- COMMENT TABLE POLICIES
CREATE POLICY IF NOT EXISTS "Comments are publicly readable"
ON "public"."Comment" FOR SELECT
TO public
USING (true);

CREATE POLICY IF NOT EXISTS "Users can create own comments"
ON "public"."Comment" FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY IF NOT EXISTS "Users can update own comments"
ON "public"."Comment" FOR UPDATE
TO authenticated
USING (auth.uid()::text = "userId")
WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY IF NOT EXISTS "Users can delete own comments"
ON "public"."Comment" FOR DELETE
TO authenticated
USING (auth.uid()::text = "userId");

-- INTERACTION TABLE POLICIES
CREATE POLICY IF NOT EXISTS "Interactions are publicly readable"
ON "public"."Interaction" FOR SELECT
TO public
USING (true);

CREATE POLICY IF NOT EXISTS "Users can create own interactions"
ON "public"."Interaction" FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY IF NOT EXISTS "Users can delete own interactions"
ON "public"."Interaction" FOR DELETE
TO authenticated
USING (auth.uid()::text = "userId");

-- TRANSACTION TABLE POLICIES
-- Users can only see their own transactions
CREATE POLICY IF NOT EXISTS "Users can view own transactions"
ON "public"."Transaction" FOR SELECT
TO authenticated
USING (
  auth.uid()::text = "senderId" 
  OR auth.uid()::text = "receiverId"
);

CREATE POLICY IF NOT EXISTS "Users can create transactions"
ON "public"."Transaction" FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "senderId");

-- SUBSCRIPTION TABLE POLICIES
CREATE POLICY IF NOT EXISTS "Users can view own subscriptions"
ON "public"."Subscription" FOR SELECT
TO authenticated
USING (auth.uid()::text = "userId");

CREATE POLICY IF NOT EXISTS "Users can create subscriptions"
ON "public"."Subscription" FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY IF NOT EXISTS "Users can update own subscriptions"
ON "public"."Subscription" FOR UPDATE
TO authenticated
USING (auth.uid()::text = "userId")
WITH CHECK (auth.uid()::text = "userId");

-- MESSAGE TABLE POLICIES
-- Users can only see messages they sent or received
CREATE POLICY IF NOT EXISTS "Users can view own messages"
ON "public"."Message" FOR SELECT
TO authenticated
USING (
  auth.uid()::text = "senderId" 
  OR auth.uid()::text = "receiverId"
);

CREATE POLICY IF NOT EXISTS "Users can send messages"
ON "public"."Message" FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "senderId");

CREATE POLICY IF NOT EXISTS "Users can update own messages"
ON "public"."Message" FOR UPDATE
TO authenticated
USING (
  auth.uid()::text = "senderId" 
  OR auth.uid()::text = "receiverId"
)
WITH CHECK (
  auth.uid()::text = "senderId" 
  OR auth.uid()::text = "receiverId"
);

-- ANALYTICS LOG POLICIES
-- Only admins can read analytics
CREATE POLICY IF NOT EXISTS "Admins can read analytics"
ON "public"."AnalyticsLog" FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."User"
    WHERE "User".id = auth.uid()::text
    AND "User".role IN ('ADMIN', 'SUPER_ADMIN')
  )
);

CREATE POLICY IF NOT EXISTS "System can insert analytics"
ON "public"."AnalyticsLog" FOR INSERT
TO authenticated
WITH CHECK (true);

-- INVESTOR QUARANTINE POLICIES
CREATE POLICY IF NOT EXISTS "Admins can manage investor quarantine"
ON "public"."investor_quarantine" FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."User"
    WHERE "User".id = auth.uid()::text
    AND "User".role IN ('ADMIN', 'SUPER_ADMIN')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "public"."User"
    WHERE "User".id = auth.uid()::text
    AND "User".role IN ('ADMIN', 'SUPER_ADMIN')
  )
);

-- NETWORK APPLICATIONS POLICIES
CREATE POLICY IF NOT EXISTS "Network applications are publicly readable"
ON "public"."network_applications" FOR SELECT
TO public
USING (true);

CREATE POLICY IF NOT EXISTS "Users can create network applications"
ON "public"."network_applications" FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Admins can update network applications"
ON "public"."network_applications" FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."User"
    WHERE "User".id = auth.uid()::text
    AND "User".role IN ('ADMIN', 'SUPER_ADMIN')
  )
);

-- VIDEOS TABLE POLICIES
CREATE POLICY IF NOT EXISTS "Videos are publicly readable"
ON "public"."videos" FOR SELECT
TO public
USING (true);

CREATE POLICY IF NOT EXISTS "Creators can manage own videos"
ON "public"."videos" FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."Profile"
    WHERE "Profile".id = "videos"."creator_id"
    AND "Profile"."userId" = auth.uid()::text
    AND "Profile".type = 'CREATOR'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "public"."Profile"
    WHERE "Profile".id = "videos"."creator_id"
    AND "Profile"."userId" = auth.uid()::text
    AND "Profile".type = 'CREATOR'
  )
);

-- ============================================
-- PART 3: FIX SECURITY DEFINER VIEWS
-- ============================================

-- Drop and recreate views without SECURITY DEFINER
-- This ensures RLS policies are enforced

-- 1. weekly_creator_conversion
DROP VIEW IF EXISTS "public"."weekly_creator_conversion";
CREATE VIEW "public"."weekly_creator_conversion" AS
SELECT 
    COUNT(CASE WHEN type = 'creator' THEN 1 END) AS submitted_count,
    COUNT(CASE WHEN type = 'user' THEN 1 END) AS user_submitted_count,
    COUNT(*) FILTER (WHERE type = 'creator' AND status = 'accepted') AS accepted_count,
    COUNT(*) FILTER (WHERE type = 'creator' AND status = 'pending') AS pending_count,
    (COUNT(*) FILTER (WHERE type = 'creator' AND status = 'accepted') * 100.0) / 
    NULLIF(COUNT(CASE WHEN type = 'creator' THEN 1 END), 0) AS acceptance_rate
FROM 
    public.waitlist
WHERE 
    created_at >= DATE_TRUNC('week', CURRENT_DATE);

-- 2. traffic_source_breakdown
DROP VIEW IF EXISTS "public"."traffic_source_breakdown";
CREATE VIEW "public"."traffic_source_breakdown" AS
SELECT 
    referral_source,
    COUNT(*) as total_signups,
    COUNT(*) FILTER (WHERE type = 'creator') as creator_signups,
    COUNT(*) FILTER (WHERE type = 'user') as user_signups,
    ROUND(COUNT(*) FILTER (WHERE type = 'creator') * 100.0 / NULLIF(COUNT(*), 0), 2) as creator_percentage
FROM 
    public.waitlist
WHERE 
    created_at >= DATE_TRUNC('week', CURRENT_DATE)
GROUP BY 
    referral_source
ORDER BY 
    total_signups DESC;

-- 3. founding_50_progress
DROP VIEW IF EXISTS "public"."founding_50_progress";
CREATE VIEW "public"."founding_50_progress" AS
SELECT 
    COUNT(*) FILTER (WHERE "isFounding50" = true) as total_founding_50,
    COUNT(*) FILTER (WHERE "isFounding50" = true AND "isVerified" = true) as verified_founding_50,
    COUNT(*) FILTER (WHERE "isFounding50" = true AND "avatarUrl" IS NOT NULL) as profiles_with_avatar,
    COUNT(*) FILTER (WHERE "isFounding50" = true AND "bio" IS NOT NULL) as profiles_with_bio,
    ROUND(COUNT(*) FILTER (WHERE "isFounding50" = true AND "avatarUrl" IS NOT NULL) * 100.0 / 
          NULLIF(COUNT(*) FILTER (WHERE "isFounding50" = true), 0), 2) as profile_completion_rate
FROM 
    "public"."Profile"
WHERE 
    "isFounding50" = true;

-- 4. weekly_signup_funnel
DROP VIEW IF EXISTS "public"."weekly_signup_funnel";
CREATE VIEW "public"."weekly_signup_funnel" AS
SELECT 
    DATE_TRUNC('day', created_at) as signup_date,
    type,
    COUNT(*) as signups,
    COUNT(*) FILTER (WHERE status = 'accepted') as accepted,
    COUNT(*) FILTER (WHERE status = 'pending') as pending,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected
FROM 
    public.waitlist
WHERE 
    created_at >= DATE_TRUNC('week', CURRENT_DATE)
GROUP BY 
    DATE_TRUNC('day', created_at), type
ORDER BY 
    signup_date DESC, type;

-- 5. creator_application_metrics
DROP VIEW IF EXISTS "public"."creator_application_metrics";
CREATE VIEW "public"."creator_application_metrics" AS
SELECT 
    COUNT(*) as total_applications,
    COUNT(*) FILTER (WHERE handle IS NOT NULL) as with_social_handle,
    COUNT(*) FILTER (WHERE city IS NOT NULL) as with_city,
    COUNT(*) FILTER (WHERE status = 'accepted') as accepted,
    COUNT(*) FILTER (WHERE status = 'pending') as pending,
    ROUND(COUNT(*) FILTER (WHERE handle IS NOT NULL) * 100.0 / NULLIF(COUNT(*), 0), 2) as handle_provided_rate,
    ROUND(COUNT(*) FILTER (WHERE status = 'accepted') * 100.0 / NULLIF(COUNT(*), 0), 2) as acceptance_rate
FROM 
    public.waitlist
WHERE 
    type = 'creator'
    AND created_at >= DATE_TRUNC('week', CURRENT_DATE);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify RLS is enabled on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verify views don't have SECURITY DEFINER
SELECT 
  schemaname,
  viewname,
  definition
FROM pg_views
WHERE schemaname = 'public'
AND viewname IN (
  'traffic_source_breakdown',
  'creator_application_metrics',
  'weekly_signup_funnel',
  'founding_50_progress',
  'weekly_creator_conversion'
);

