/*
  # Fix RLS policies to avoid recursion

  1. Changes
    - Modify RLS policies to prevent infinite recursion
    - Maintain admin access without circular dependencies
    - Ensure proper access control for all operations

  2. Security
    - Users can still only access their own profiles
    - Admins maintain full access to all profiles
    - Prevent unauthorized access
*/

-- Add admin role to existing enum or as a new value
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('trainer', 'admin'));

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update policies to use the is_admin function
DROP POLICY IF EXISTS "Users can read profiles" ON profiles;
CREATE POLICY "Users can read profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id 
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Users can update profiles" ON profiles;
CREATE POLICY "Users can update profiles"
  ON profiles FOR UPDATE
  USING (
    auth.uid() = id 
    OR public.is_admin()
  );

-- Add policy for admin to insert profiles
DROP POLICY IF EXISTS "Admin can insert profiles" ON profiles;
CREATE POLICY "Admin can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (
    auth.uid() = id 
    OR public.is_admin()
  );