/*
  # Fix user authentication

  1. Changes
    - Drop existing test user to avoid conflicts
    - Create new test user with proper credentials
    - Ensure profile is created correctly
    - Set up proper role and permissions

  2. Security
    - Password is properly hashed
    - Account is pre-confirmed
    - Proper role assignment
*/

-- First, clean up any existing test user
DELETE FROM auth.users WHERE email = 'test@example.com';
DELETE FROM public.profiles WHERE email = 'test@example.com';

-- Create test user with proper credentials
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
);

-- Create corresponding profile
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  gender,
  date_of_birth,
  languages,
  description,
  expertise,
  gender_preferences,
  age_group_specialization,
  years_of_experience,
  certifications
) VALUES (
  '00000000-0000-0000-0000-000000000002'::uuid,
  'test@example.com',
  'Test Trainer',
  'trainer',
  'male',
  '1990-01-01',
  'English',
  'Experienced fitness trainer specializing in strength training and HIIT workouts.',
  ARRAY['Strength Training', 'HIIT', 'Weight-lifting'],
  'both',
  'young-adults',
  '5',
  'ACE Certified Personal Trainer, NASM Performance Enhancement Specialist'
);