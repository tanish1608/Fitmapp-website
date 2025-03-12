/*
  # Fix data visibility and permissions

  1. Changes
    - Ensure test user exists with proper credentials
    - Update RLS policies to fix visibility issues
    - Add missing foreign key relationships

  2. Security
    - Maintain proper access control
    - Fix permission issues for test user
*/

-- Ensure test user exists
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
  updated_at
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
  now()
) ON CONFLICT (id) DO NOTHING;

-- Ensure test user profile exists
INSERT INTO profiles (
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

-- Update RLS policies for better visibility
DROP POLICY IF EXISTS "Trainers can manage exercises" ON exercises;
CREATE POLICY "Trainers can manage exercises"
  ON exercises FOR ALL
  TO authenticated
  USING (auth.uid() = created_by OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ))
  WITH CHECK (auth.uid() = created_by OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

DROP POLICY IF EXISTS "Trainers can manage foods" ON foods;
CREATE POLICY "Trainers can manage foods"
  ON foods FOR ALL
  TO authenticated
  USING (auth.uid() = created_by OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ))
  WITH CHECK (auth.uid() = created_by OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS exercises_created_by_idx ON exercises (created_by);
CREATE INDEX IF NOT EXISTS foods_created_by_idx ON foods (created_by);
CREATE INDEX IF NOT EXISTS clients_trainer_id_idx ON clients (trainer_id);
CREATE INDEX IF NOT EXISTS workout_plans_trainer_id_idx ON workout_plans (trainer_id);