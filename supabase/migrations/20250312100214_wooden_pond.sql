/*
  # Fix authentication and RLS policies

  1. Changes
    - Simplify RLS policies to prevent recursion
    - Make profiles publicly readable for authentication
    - Maintain proper access control for updates and inserts

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

-- Create new simplified policies
CREATE POLICY "Allow public read access"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow users to update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Allow users to insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);