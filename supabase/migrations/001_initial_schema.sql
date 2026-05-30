-- AVA Media Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  company_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin', 'team')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Project Status Enum
CREATE TYPE project_status AS ENUM (
  'inquiry',
  'quoted',
  'booked',
  'planning',
  'production',
  'editing',
  'review',
  'revisions',
  'delivered',
  'completed',
  'cancelled'
);

-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  package_type TEXT NOT NULL,
  status project_status DEFAULT 'inquiry',
  shoot_date DATE,
  shoot_location TEXT,
  total_amount DECIMAL(10,2),
  deposit_amount DECIMAL(10,2),
  deposit_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Clients can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- Booking Status Enum
CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'deposit_paid',
  'completed',
  'cancelled'
);

-- Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME,
  location TEXT,
  status booking_status DEFAULT 'pending',
  deposit_amount DECIMAL(10,2),
  total_amount DECIMAL(10,2),
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Clients can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- Deliverable Status Enum
CREATE TYPE deliverable_status AS ENUM (
  'pending',
  'processing',
  'ready_for_review',
  'approved',
  'revision_requested',
  'final'
);

-- Deliverables
CREATE TABLE IF NOT EXISTS public.deliverables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status deliverable_status DEFAULT 'pending',
  version INTEGER DEFAULT 1,
  file_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view project deliverables"
  ON public.deliverables FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = deliverables.project_id
      AND client_id = auth.uid()
    )
  );

-- Video Review Comments
CREATE TABLE IF NOT EXISTS public.review_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deliverable_id UUID REFERENCES public.deliverables(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  timestamp_seconds DECIMAL(10,2) NOT NULL,
  comment_text TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.review_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments"
  ON public.review_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.deliverables d
      JOIN public.projects p ON d.project_id = p.id
      WHERE d.id = review_comments.deliverable_id
      AND p.client_id = auth.uid()
    )
  );

CREATE POLICY "Users can create comments"
  ON public.review_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Portfolio (public)
CREATE TABLE IF NOT EXISTS public.portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  client_name TEXT,
  thumbnail_url TEXT NOT NULL,
  video_url TEXT NOT NULL,
  year INTEGER,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published portfolio"
  ON public.portfolio FOR SELECT
  USING (is_published = TRUE);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_project_id ON public.deliverables(project_id);
CREATE INDEX IF NOT EXISTS idx_review_comments_deliverable_id ON public.review_comments(deliverable_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_published ON public.portfolio(is_published, is_featured);
