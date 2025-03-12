/*
  # Fix authentication and database schema

  1. Changes
    - Drop all existing tables and start fresh
    - Create profiles table with essential fields
    - Set up proper RLS policies
    - Create test user for development

  2. Security
    - Enable RLS
    - Allow public read access for profiles (needed for auth)
    - Restrict updates and inserts to own profile
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'trainer',
  gender text,
  date_of_birth date,
  languages text,
  description text,
  expertise text[] DEFAULT '{}',
  gender_preferences text,
  age_group_specialization text,
  medical_specializations text,
  years_of_experience text,
  certifications text,
  social_media_links text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access for profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Public read access for avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Auth users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

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