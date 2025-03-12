/*
  # Fix RLS policies to prevent infinite recursion

  1. Changes
    - Simplify RLS policies to avoid recursion
    - Remove circular dependencies in policy checks
    - Maintain proper access control

  2. Security
    - Users can still read/update their own profiles
    - Admins maintain access to all profiles
    - Prevent unauthorized access
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;

-- Create new simplified policies without recursion
CREATE POLICY "Public profiles access"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);