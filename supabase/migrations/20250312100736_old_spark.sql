/*
  # Fix authentication and database schema

  1. Changes
    - Drop and recreate profiles table with simplified structure
    - Set up basic RLS policies
    - Create test user for development

  2. Security
    - Enable RLS
    - Allow public read access for profiles
    - Restrict updates and inserts to own profile
*/

-- Drop existing table
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table with minimal required fields
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'trainer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies
CREATE POLICY "Public read access"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create test user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  role,
  raw_app_meta_data,
  raw_user_meta_data,
  aud
) VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'test@example.com',
  crypt('Test123!@#', gen_salt('bf')),
  now(),
  now(),
  'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated'
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
  'Test Trainer',
  'trainer'
) ON CONFLICT (id) DO NOTHING;