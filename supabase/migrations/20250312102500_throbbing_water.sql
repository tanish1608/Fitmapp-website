/*
  # Add plans table

  1. New Tables
    - `plans`
      - `id` (uuid, primary key)
      - `trainer_id` (uuid, references profiles)
      - `name` (text)
      - `duration` (integer, months)
      - `workout_frequency` (integer, days per week)
      - `calories_per_day` (integer)
      - `workouts_count` (integer)
      - `diet_count` (integer)
      - `price` (numeric)
      - `thumbnail_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `plans` table
    - Add policies for trainers to manage their plans
*/

CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  duration integer NOT NULL,
  workout_frequency integer NOT NULL,
  calories_per_day integer NOT NULL,
  workouts_count integer NOT NULL,
  diet_count integer NOT NULL,
  price numeric NOT NULL,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- Trainers can manage their own plans
CREATE POLICY "Trainers can manage their plans"
  ON plans
  FOR ALL
  TO authenticated
  USING (auth.uid() = trainer_id)
  WITH CHECK (auth.uid() = trainer_id);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE
  ON plans
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();