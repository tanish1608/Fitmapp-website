/*
  # Create admin user

  1. Changes
    - Create an admin user in the auth.users table
    - Create corresponding admin profile in profiles table
    - Set up initial admin credentials

  2. Security
    - Admin user has full access to all profiles
    - Secure password hashing handled by Supabase Auth
*/

-- Create admin user if not exists
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  role,
  confirmation_token,
  email_change_token_new,
  recovery_token
) 
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'admin@fitmapp.com',
  crypt('Admin123!@#', gen_salt('bf')),
  NOW(),
  NOW(),
  'authenticated',
  '',
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@fitmapp.com'
);

-- Create admin profile
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role
)
SELECT
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin@fitmapp.com',
  'System Administrator',
  'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'admin@fitmapp.com'
);