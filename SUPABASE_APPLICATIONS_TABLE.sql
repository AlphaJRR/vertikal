-- Create applications table for VERTIKAL apply form
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  applying_as text NOT NULL,
  portfolio_url text,
  why_vertikal text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert applications (public form submission)
CREATE POLICY "Anyone can submit applications" ON public.applications
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can view applications
CREATE POLICY "Authenticated users can view applications" ON public.applications
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

