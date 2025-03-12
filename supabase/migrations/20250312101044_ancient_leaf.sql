/*
  # Fix Authentication Schema and Policies

  1. Changes
    - Recreate profiles table with minimal required fields
    - Set up basic RLS policies
    - Create test user for development

  2. Security
    - Enable RLS on profiles table
    - Allow public read access
    - Restrict write access to own profile
*/

-- Drop existing table and start fresh
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table with minimal fields
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'trainer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
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

-- Create test user
DO $$
BEGIN
  -- Create user in auth.users if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'test@example.com') THEN
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
    );
  END IF;

  -- Create profile if not exists
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'test@example.com') THEN
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
    );
  END IF;
END $$;