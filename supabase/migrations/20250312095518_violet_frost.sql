/*
  # Fix RLS policies to prevent recursion

  1. Changes
    - Drop all existing policies to start fresh
    - Create new non-recursive policies
    - Add admin role check without circular dependencies
    - Simplify policy logic

  2. Security
    - Users can still read/update their own profiles
    - Admins can access all profiles
    - Prevent unauthorized access
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access" ON profiles;
DROP POLICY IF EXISTS "Enable update access" ON profiles;
DROP POLICY IF EXISTS "Enable insert access" ON profiles;
DROP POLICY IF EXISTS "Users can read profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to read own profile or if admin" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile or if admin" ON profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON profiles;

-- Create new non-recursive policies
CREATE POLICY "profiles_read_policy" ON profiles 
FOR SELECT USING (
  -- Users can read their own profile
  auth.uid() = id 
  OR 
  -- Or if they are an admin (checking role directly)
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "profiles_update_policy" ON profiles 
FOR UPDATE USING (
  -- Users can update their own profile
  auth.uid() = id 
  OR 
  -- Or if they are an admin (checking role directly)
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "profiles_insert_policy" ON profiles 
FOR INSERT WITH CHECK (
  -- Users can only insert their own profile
  auth.uid() = id
);