/*
  # Update profiles table with additional fields

  1. Changes
    - Add new columns for trainer profiles:
      - gender
      - date_of_birth
      - languages
      - description
      - expertise (array)
      - gender_preferences
      - age_group_specialization
      - medical_specializations
      - years_of_experience
      - certifications
      - social_media_links
    - Remove old columns:
      - specialization
      - client_preferences
      - qualifications
      - achievements

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS languages text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS expertise text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gender_preferences text,
ADD COLUMN IF NOT EXISTS age_group_specialization text,
ADD COLUMN IF NOT EXISTS medical_specializations text,
ADD COLUMN IF NOT EXISTS years_of_experience text,
ADD COLUMN IF NOT EXISTS certifications text,
ADD COLUMN IF NOT EXISTS social_media_links text;

-- Drop old columns if they exist
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'specialization') THEN
    ALTER TABLE profiles DROP COLUMN specialization;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'client_preferences') THEN
    ALTER TABLE profiles DROP COLUMN client_preferences;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'qualifications') THEN
    ALTER TABLE profiles DROP COLUMN qualifications;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'achievements') THEN
    ALTER TABLE profiles DROP COLUMN achievements;
  END IF;
END $$;