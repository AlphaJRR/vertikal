-- ============================================
-- CREATE WAITLIST TABLE FOR LANDING PAGE
-- VERTIKAL - Founder-Led Signup Capture
-- ============================================
-- 
-- PURPOSE: Store creator applications and user waitlist signups
-- INSTRUCTIONS: Run this in Supabase SQL Editor
--
-- ============================================

-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT,
  handle TEXT, -- Social handle (for creators)
  type TEXT NOT NULL CHECK (type IN ('creator', 'user')),
  referral_source TEXT DEFAULT 'landing_page',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  notes TEXT, -- For manual review notes
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_type ON public.waitlist(type);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON public.waitlist(status);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for signups)
CREATE POLICY "Allow public inserts"
ON public.waitlist
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Only authenticated users can read (for admin dashboard)
CREATE POLICY "Allow authenticated reads"
ON public.waitlist
FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- VERIFICATION QUERY (Run separately):
-- ============================================
-- SELECT * FROM public.waitlist ORDER BY created_at DESC LIMIT 10;
-- ============================================

