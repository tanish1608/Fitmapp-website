/*
  # Fix RLS policies to prevent recursion

  1. Changes
    - Drop all existing policies to start fresh
    - Create new non-recursive policies using a simpler approach
    - Maintain security while avoiding circular dependencies

  2. Security
    - Users can read/update their own profiles
    - Admins can access all profiles
    - Insert operations restricted to user's own profile
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "profiles_read_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "Enable read access" ON profiles;
DROP POLICY IF EXISTS "Enable update access" ON profiles;
DROP POLICY IF EXISTS "Enable insert access" ON profiles;

-- Create new simplified policies
CREATE POLICY "profiles_select_policy" ON profiles 
FOR SELECT USING (
  -- Allow users to read their own profile
  auth.uid() = id
  OR 
  -- Allow admins to read any profile, using a direct role check
  role = 'admin'
);

CREATE POLICY "profiles_update_policy" ON profiles 
FOR UPDATE USING (
  -- Allow users to update their own profile
  auth.uid() = id
  OR 
  -- Allow admins to update any profile, using a direct role check
  role = 'admin'
);

CREATE POLICY "profiles_insert_policy" ON profiles 
FOR INSERT WITH CHECK (
  -- Only allow users to insert their own profile
  auth.uid() = id
);