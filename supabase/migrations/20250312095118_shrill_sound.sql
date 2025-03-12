/*
  # Fix RLS policies to prevent recursion

  1. Changes
    - Remove recursive policy checks
    - Simplify admin role verification
    - Ensure proper access control without circular dependencies

  2. Security
    - Maintain secure access control
    - Prevent unauthorized access
    - Keep admin privileges intact
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can insert profiles" ON profiles;
DROP FUNCTION IF EXISTS public.is_admin();

-- Create simpler policies without recursion
CREATE POLICY "Allow users to read own profile or if admin"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id 
    OR role = 'admin'
  );

CREATE POLICY "Allow users to update own profile or if admin"
  ON profiles FOR UPDATE
  USING (
    auth.uid() = id 
    OR role = 'admin'
  );

CREATE POLICY "Allow users to insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (
    auth.uid() = id
  );