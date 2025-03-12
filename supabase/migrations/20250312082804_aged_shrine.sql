/*
  # Initial Schema Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `role` (text)
      - `created_at` (timestamp)
    
    - `clients`
      - `id` (uuid, primary key)
      - `trainer_id` (uuid, references profiles)
      - `name` (text)
      - `email` (text)
      - `avatar_url` (text)
      - `age` (integer)
      - `gender` (text)
      - `weight` (numeric)
      - `height` (text)
      - `is_vegetarian` (boolean)
      - `dietary_restrictions` (text[])
      - `movement_restrictions` (text[])
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `workout_plans`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references clients)
      - `trainer_id` (uuid, references profiles)
      - `name` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `exercises`
      - `id` (uuid, primary key)
      - `plan_id` (uuid, references workout_plans)
      - `name` (text)
      - `sets` (integer)
      - `reps` (integer)
      - `weight` (numeric)
      - `time` (integer)
      - `day_of_week` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role text DEFAULT 'trainer',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text,
  avatar_url text,
  age integer,
  gender text,
  weight numeric,
  height text,
  is_vegetarian boolean DEFAULT false,
  dietary_restrictions text[] DEFAULT '{}',
  movement_restrictions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers can manage their clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (auth.uid() = trainer_id);

-- Create workout plans table
CREATE TABLE IF NOT EXISTS workout_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  trainer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers can manage their workout plans"
  ON workout_plans
  FOR ALL
  TO authenticated
  USING (auth.uid() = trainer_id);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES workout_plans(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  sets integer NOT NULL,
  reps integer NOT NULL,
  weight numeric,
  time integer,
  day_of_week integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers can manage exercises in their plans"
  ON exercises
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workout_plans wp
      WHERE wp.id = exercises.plan_id
      AND wp.trainer_id = auth.uid()
    )
  );