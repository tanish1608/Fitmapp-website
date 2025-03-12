/*
  # Add dummy data for testing

  1. Data Added
    - Sample clients with diverse profiles
    - Workout plans for different clients
    - Exercise data for workout plans
    - Handles not-null constraints properly

  2. Changes
    - Insert test data for clients table
    - Insert test data for workout_plans table
    - Insert test data for exercises table with proper null handling
*/

-- Insert dummy clients
INSERT INTO clients (trainer_id, name, email, age, gender, weight, height, is_vegetarian, dietary_restrictions, movement_restrictions)
VALUES
  -- Client 1: Young athlete
  ((SELECT id FROM profiles WHERE role = 'trainer' LIMIT 1), 
   'John Smith', 
   'john.smith@example.com',
   25,
   'male',
   75.5,
   '180cm',
   false,
   ARRAY['No dairy']::text[],
   ARRAY['Previous knee injury']::text[]),

  -- Client 2: Middle-aged professional
  ((SELECT id FROM profiles WHERE role = 'trainer' LIMIT 1),
   'Sarah Johnson',
   'sarah.j@example.com',
   42,
   'female',
   65.0,
   '165cm',
   true,
   ARRAY['Gluten-free', 'No nuts']::text[],
   ARRAY['Lower back pain']::text[]),

  -- Client 3: Senior fitness enthusiast
  ((SELECT id FROM profiles WHERE role = 'trainer' LIMIT 1),
   'Robert Chen',
   'robert.c@example.com',
   58,
   'male',
   82.0,
   '175cm',
   false,
   ARRAY['Low sodium']::text[],
   ARRAY['Arthritis in shoulders']::text[]),

  -- Client 4: Young professional
  ((SELECT id FROM profiles WHERE role = 'trainer' LIMIT 1),
   'Emily Davis',
   'emily.d@example.com',
   28,
   'female',
   58.5,
   '162cm',
   true,
   ARRAY['Vegan', 'No soy']::text[],
   ARRAY[]::text[]),

  -- Client 5: Student athlete
  ((SELECT id FROM profiles WHERE role = 'trainer' LIMIT 1),
   'Michael Brown',
   'michael.b@example.com',
   20,
   'male',
   70.0,
   '178cm',
   false,
   ARRAY[]::text[],
   ARRAY['Recovering from ankle sprain']::text[]);

-- Insert workout plans for each client
INSERT INTO workout_plans (client_id, trainer_id, name, start_date, end_date)
SELECT 
  c.id as client_id,
  c.trainer_id,
  CASE
    WHEN c.name = 'John Smith' THEN 'Strength Building Program'
    WHEN c.name = 'Sarah Johnson' THEN 'Weight Loss & Toning'
    WHEN c.name = 'Robert Chen' THEN 'Senior Fitness & Mobility'
    WHEN c.name = 'Emily Davis' THEN 'HIIT & Cardio Mix'
    ELSE 'General Fitness Plan'
  END as name,
  CURRENT_DATE as start_date,
  CURRENT_DATE + INTERVAL '90 days' as end_date
FROM clients c;

-- Insert exercises for each workout plan
INSERT INTO exercises (plan_id, name, sets, reps, weight, time, day_of_week)
SELECT 
  wp.id as plan_id,
  exercise_name,
  sets,
  CASE
    WHEN reps IS NULL THEN 1  -- Default value for exercises without reps
    ELSE reps
  END as reps,
  weight,
  time,
  day_of_week
FROM workout_plans wp
CROSS JOIN (
  VALUES
    ('Bench Press', 3, 12, 60, NULL, 1),
    ('Squats', 4, 10, 80, NULL, 1),
    ('Deadlifts', 3, 8, 100, NULL, 1),
    ('Push-ups', 3, 15, NULL, NULL, 2),
    ('Pull-ups', 3, 8, NULL, NULL, 2),
    ('Plank', 3, 1, NULL, 60, 2),      -- Changed: Added reps=1 for time-based exercise
    ('Running', 1, 1, NULL, 1800, 3),   -- Changed: Added reps=1 for cardio
    ('Cycling', 1, 1, NULL, 2400, 3),   -- Changed: Added reps=1 for cardio
    ('Shoulder Press', 3, 12, 40, NULL, 4),
    ('Lunges', 3, 15, NULL, NULL, 4),
    ('Rowing', 1, 1, NULL, 1200, 5),    -- Changed: Added reps=1 for cardio
    ('Burpees', 3, 20, NULL, NULL, 5)
) as exercises(exercise_name, sets, reps, weight, time, day_of_week);