/*
  # Fix profile loading and schema

  1. Changes
    - Drop and recreate profiles table with minimal fields
    - Simplify RLS policies to prevent recursion
    - Create test user with proper profile

  2. Security
    - Enable RLS
    - Allow public read access
    - Restrict updates and inserts to own profile
*/

-- Drop existing table and start fresh
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table with minimal fields
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'trainer'
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simplified policies
CREATE POLICY "Public read access"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create test user with confirmed email
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  '00000000-0000-0000-0000-000000000002'::uuid,
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('Test123!@#', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  now(),
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Create test profile
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  'test@example.com',
  'Test User',
  'trainer'
) ON CONFLICT (id) DO NOTHING;