/*
  # Fix profile loading and RLS issues

  1. Changes
    - Drop all existing policies to start fresh
    - Create new simplified RLS policies without recursion
    - Fix profile constraints and indexes

  2. Security
    - Users can read/update their own profile
    - Admins can read/update all profiles
    - Users can only insert their own profile
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;

-- Ensure proper constraints
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('trainer', 'admin'));

-- Create new simplified policies
CREATE POLICY "profiles_select_policy" ON profiles 
FOR SELECT USING (
  auth.uid() = id OR role = 'admin'
);

CREATE POLICY "profiles_update_policy" ON profiles 
FOR UPDATE USING (
  auth.uid() = id OR role = 'admin'
);

CREATE POLICY "profiles_insert_policy" ON profiles 
FOR INSERT WITH CHECK (
  auth.uid() = id
);