/*
  # Create test user account

  1. Changes
    - Create a test user in auth.users
    - Create corresponding profile in public.profiles
    - Set up as a trainer role

  2. Security
    - Password is hashed
    - Account is pre-confirmed for testing
*/

-- Create test user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  role,
  raw_app_meta_data,
  raw_user_meta_data
) 
SELECT 
  '00000000-0000-0000-0000-000000000002'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'test@example.com',
  crypt('Test123!@#', gen_salt('bf')),
  NOW(),
  NOW(),
  'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{}'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'test@example.com'
);

-- Create test user profile
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
)
SELECT
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
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'test@example.com'
);