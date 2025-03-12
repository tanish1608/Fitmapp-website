/*
  # Fix authentication and RLS policies

  1. Changes
    - Drop all existing policies to start fresh
    - Create simple, non-recursive policies
    - Enable public read access for authentication
    - Maintain proper security for updates and inserts

  2. Security
    - Allow public read access (needed for authentication)
    - Users can only update their own profiles
    - Users can only insert their own profiles
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "Public profiles access" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow public read access" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON profiles;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create new simplified policies
CREATE POLICY "Public read access"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create test user if not exists
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
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change_token_current
) VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'test@example.com',
  crypt('Test123!@#', gen_salt('bf')),
  NOW(),
  NOW(),
  'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Create test profile if not exists
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