/*
  # Library Schema Migration

  1. New Tables
    - Exercise Categories (equipment, muscle groups, movement types)
    - Exercises (with metadata and trainer relationships)
    - Food Categories (diet types, ingredients, allergens)
    - Foods (with nutritional info and trainer relationships)
    - Food Join Tables (diet types, ingredients, allergens)

  2. Security
    - Enable RLS on all tables
    - Public read access for categories
    - Trainers can manage their own content
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS food_allergens CASCADE;
DROP TABLE IF EXISTS food_ingredients CASCADE;
DROP TABLE IF EXISTS food_diet_types CASCADE;
DROP TABLE IF EXISTS foods CASCADE;
DROP TABLE IF EXISTS food_categories CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS exercise_categories CASCADE;

-- Exercise Categories
CREATE TABLE exercise_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('equipment', 'muscle_group', 'movement_type')),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (type, name)
);

-- Exercises
CREATE TABLE exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid NOT NULL REFERENCES profiles(id),
  name text NOT NULL,
  equipment_id uuid REFERENCES exercise_categories(id),
  muscle_group_id uuid REFERENCES exercise_categories(id),
  movement_type_id uuid REFERENCES exercise_categories(id),
  force_type text CHECK (force_type IN ('push', 'pull', 'static', 'explosive')),
  mechanics text CHECK (mechanics IN ('compound', 'isolation', 'cardio')),
  expertise_level integer CHECK (expertise_level BETWEEN 1 AND 3),
  video_url text,
  instructions text,
  secondary_muscles text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Food Categories
CREATE TABLE food_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('diet_type', 'ingredient', 'allergy')),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (type, name)
);

-- Foods
CREATE TABLE foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid NOT NULL REFERENCES profiles(id),
  name text NOT NULL,
  description text,
  calories integer NOT NULL,
  protein numeric NOT NULL,
  carbs numeric NOT NULL,
  fats numeric NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Food Diet Types Join Table
CREATE TABLE food_diet_types (
  food_id uuid REFERENCES foods(id) ON DELETE CASCADE,
  category_id uuid REFERENCES food_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (food_id, category_id)
);

-- Food Ingredients Join Table
CREATE TABLE food_ingredients (
  food_id uuid REFERENCES foods(id) ON DELETE CASCADE,
  category_id uuid REFERENCES food_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (food_id, category_id)
);

-- Food Allergens Join Table
CREATE TABLE food_allergens (
  food_id uuid REFERENCES foods(id) ON DELETE CASCADE,
  category_id uuid REFERENCES food_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (food_id, category_id)
);

-- Enable RLS
ALTER TABLE exercise_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_diet_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_allergens ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access for exercise categories" ON exercise_categories;
DROP POLICY IF EXISTS "Trainers can manage exercises" ON exercises;
DROP POLICY IF EXISTS "Public read access for food categories" ON food_categories;
DROP POLICY IF EXISTS "Trainers can manage foods" ON foods;
DROP POLICY IF EXISTS "Trainers can manage food diet types" ON food_diet_types;
DROP POLICY IF EXISTS "Trainers can manage food ingredients" ON food_ingredients;
DROP POLICY IF EXISTS "Trainers can manage food allergens" ON food_allergens;

-- Create RLS Policies
CREATE POLICY "Public read access for exercise categories"
  ON exercise_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Trainers can manage exercises"
  ON exercises
  FOR ALL
  TO authenticated
  USING (auth.uid() = trainer_id)
  WITH CHECK (auth.uid() = trainer_id);

CREATE POLICY "Public read access for food categories"
  ON food_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Trainers can manage foods"
  ON foods
  FOR ALL
  TO authenticated
  USING (auth.uid() = trainer_id)
  WITH CHECK (auth.uid() = trainer_id);

CREATE POLICY "Trainers can manage food diet types"
  ON food_diet_types
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM foods WHERE id = food_id AND trainer_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM foods WHERE id = food_id AND trainer_id = auth.uid()
  ));

CREATE POLICY "Trainers can manage food ingredients"
  ON food_ingredients
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM foods WHERE id = food_id AND trainer_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM foods WHERE id = food_id AND trainer_id = auth.uid()
  ));

CREATE POLICY "Trainers can manage food allergens"
  ON food_allergens
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM foods WHERE id = food_id AND trainer_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM foods WHERE id = food_id AND trainer_id = auth.uid()
  ));

-- Insert default categories
INSERT INTO exercise_categories (type, name) VALUES
  -- Equipment
  ('equipment', 'Barbell'),
  ('equipment', 'Dumbbell'),
  ('equipment', 'Kettlebell'),
  ('equipment', 'Machine'),
  ('equipment', 'Bodyweight'),
  ('equipment', 'Resistance Band'),
  -- Muscle Groups
  ('muscle_group', 'Chest'),
  ('muscle_group', 'Back'),
  ('muscle_group', 'Shoulders'),
  ('muscle_group', 'Biceps'),
  ('muscle_group', 'Triceps'),
  ('muscle_group', 'Legs'),
  ('muscle_group', 'Core'),
  -- Movement Types
  ('movement_type', 'Push'),
  ('movement_type', 'Pull'),
  ('movement_type', 'Squat'),
  ('movement_type', 'Hinge'),
  ('movement_type', 'Lunge'),
  ('movement_type', 'Carry');

INSERT INTO food_categories (type, name) VALUES
  -- Diet Types
  ('diet_type', 'Vegan'),
  ('diet_type', 'Vegetarian'),
  ('diet_type', 'Pescatarian'),
  ('diet_type', 'Keto'),
  ('diet_type', 'Paleo'),
  -- Common Ingredients
  ('ingredient', 'Chicken'),
  ('ingredient', 'Fish'),
  ('ingredient', 'Rice'),
  ('ingredient', 'Quinoa'),
  ('ingredient', 'Sweet Potato'),
  -- Common Allergens
  ('allergy', 'Gluten'),
  ('allergy', 'Dairy'),
  ('allergy', 'Nuts'),
  ('allergy', 'Eggs'),
  ('allergy', 'Soy');