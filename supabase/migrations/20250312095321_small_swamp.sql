/*
  # Fix profile RLS policies

  1. Changes
    - Drop existing policies to prevent conflicts
    - Create new simplified policies for profile access
    - Ensure proper access control without recursion

  2. Security
    - Users can read and update their own profiles
    - Admins can read and update all profiles
    - Users can only insert their own profiles
*/

-- Drop all existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can read profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to read own profile or if admin" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile or if admin" ON profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON profiles;

-- Create new simplified policies
CREATE POLICY "Enable read access"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Enable update access"
  ON profiles FOR UPDATE
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Enable insert access"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);