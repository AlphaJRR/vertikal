-- ============================================
-- ANALYTICS VIEWS FOR KPI DASHBOARD
-- VERTIKAL - ATLAS Analytics Infrastructure
-- ============================================
-- 
-- PURPOSE: Create SQL views for KPI calculations
-- INSTRUCTIONS: Run this in Supabase SQL Editor
--
-- ============================================

-- Note: These views assume an analytics_events table exists
-- If using Supabase Analytics, adjust table names accordingly

-- ============================================
-- VIEW 1: WEEKLY CREATOR CONVERSION RATE
-- ============================================
CREATE OR REPLACE VIEW weekly_creator_conversion AS
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

-- ============================================
-- VIEW 2: TRAFFIC SOURCE BREAKDOWN
-- ============================================
-- Note: This requires analytics_events table
-- For now, using waitlist referral_source as proxy
CREATE OR REPLACE VIEW traffic_source_breakdown AS
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

-- ============================================
-- VIEW 3: FOUNDING 50 PROGRESS
-- ============================================
CREATE OR REPLACE VIEW founding_50_progress AS
SELECT 
    COUNT(*) FILTER (WHERE "isFounding50" = true) as total_founding_50,
    COUNT(*) FILTER (WHERE "isFounding50" = true AND "isVerified" = true) as verified_founding_50,
    COUNT(*) FILTER (WHERE "isFounding50" = true AND "avatarUrl" IS NOT NULL) as profiles_with_avatar,
    COUNT(*) FILTER (WHERE "isFounding50" = true AND "bio" IS NOT NULL) as profiles_with_bio,
    ROUND(COUNT(*) FILTER (WHERE "isFounding50" = true AND "avatarUrl" IS NOT NULL) * 100.0 / 
          NULLIF(COUNT(*) FILTER (WHERE "isFounding50" = true), 0), 2) as profile_completion_rate
FROM 
    "Profile"
WHERE 
    "isFounding50" = true;

-- ============================================
-- VIEW 4: WEEKLY SIGNUP FUNNEL
-- ============================================
CREATE OR REPLACE VIEW weekly_signup_funnel AS
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

-- ============================================
-- VIEW 5: CREATOR APPLICATION METRICS
-- ============================================
CREATE OR REPLACE VIEW creator_application_metrics AS
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
-- SELECT * FROM weekly_creator_conversion;
-- SELECT * FROM traffic_source_breakdown;
-- SELECT * FROM founding_50_progress;
-- SELECT * FROM weekly_signup_funnel;
-- SELECT * FROM creator_application_metrics;
-- ============================================

