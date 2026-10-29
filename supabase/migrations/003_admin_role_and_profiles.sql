-- ====================================================================
-- Manekshaw.Vision – Migration 003: Profiles Table & Admin Role RLS
-- Run in Supabase Dashboard → SQL Editor → New query → Run
-- ====================================================================

-- 1. Create profiles table if it does not already exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'individual' CHECK (role IN ('individual', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add role column if table already existed without it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'individual' CHECK (role IN ('individual', 'admin'));
  END IF;
END $$;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies (Users can read all profiles or own profile, only service_role can elevate to admin)
DROP POLICY IF EXISTS profiles_select_all ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_auth ON public.profiles;
DROP POLICY IF EXISTS profiles_service_all ON public.profiles;

-- Everyone authenticated can read profiles (needed for avatar/name/role display)
CREATE POLICY profiles_select_all ON public.profiles
  FOR SELECT
  USING (true);

-- Users can update their own basic profile info (full_name) but CANNOT self-elevate role
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
  );

-- Automatically create profile row when user signs up (via trigger)
CREATE POLICY profiles_insert_auth ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Full access for service_role backend operations
CREATE POLICY profiles_service_all ON public.profiles
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- --------------------------------------------------------------------
-- HOW TO GRANT ADMIN PRIVILEGES TO YOUR ACCOUNT:
-- --------------------------------------------------------------------
-- Run this single SQL statement with your account email:
--
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'your-email@example.com';
--
-- Also set app_metadata role for instant token reflection:
-- UPDATE auth.users
-- SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
-- WHERE email = 'your-email@example.com';
