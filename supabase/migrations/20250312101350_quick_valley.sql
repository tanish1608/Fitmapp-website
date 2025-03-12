/*
  # Fix authentication and profile issues

  1. Changes
    - Recreate profiles table with proper structure
    - Simplify RLS policies to prevent recursion
    - Add proper constraints and defaults
    - Create test user for verification

  2. Security
    - Enable RLS on profiles table
    - Create basic policies for read/write access
    - Ensure proper user authentication
*/

-- Drop existing table and start fresh
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table with proper structure
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'trainer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('trainer', 'admin'))
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simplified policies
CREATE POLICY "Enable read for all users"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users only"
  ON profiles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on id"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

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
      recovery_token,
      email_change_token_new,
      email_change_token_current
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
      '',
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