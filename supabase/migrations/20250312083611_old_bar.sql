/*
  # Seed Initial Data

  This migration adds mock data for testing and development:
  1. Sample trainer profile
  2. Sample clients with workout plans and exercises
  3. Uses proper UUID format for all IDs
*/

-- Insert a sample trainer
INSERT INTO auth.users (id, email)
VALUES ('d0d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'trainer@example.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, email, full_name, role)
VALUES ('d0d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'trainer@example.com', 'John Trainer', 'trainer')
ON CONFLICT (id) DO NOTHING;

-- Insert sample clients
INSERT INTO clients (id, trainer_id, name, email, age, gender, weight, height, is_vegetarian, dietary_restrictions, movement_restrictions)
VALUES 
  ('c1d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'd0d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'Sarah Smith', 'sarah@example.com', 28, 'F', 65.5, '5''7"', true, ARRAY['Lactose intolerant', 'No nuts']::text[], ARRAY['Lower back pain']::text[]),
  ('c2d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'd0d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'Mike Johnson', 'mike@example.com', 35, 'M', 82.3, '5''11"', false, ARRAY['Low sodium']::text[], ARRAY['Knee injury']::text[]),
  ('c3d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'd0d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'Emma Davis', 'emma@example.com', 24, 'F', 58.9, '5''5"', false, ARRAY[]::text[], ARRAY[]::text[]);

-- Insert sample workout plans
INSERT INTO workout_plans (id, client_id, trainer_id, name, start_date, end_date)
VALUES 
  ('91d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'c1d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'd0d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'Weight Loss Program', '2025-03-01', '2025-05-31'),
  ('92d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'c2d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'd0d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'Strength Building', '2025-03-01', '2025-05-31'),
  ('93d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'c3d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'd0d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'Fitness Fundamentals', '2025-03-01', '2025-05-31');

-- Insert sample exercises
INSERT INTO exercises (plan_id, name, sets, reps, weight, time, day_of_week)
VALUES 
  ('91d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'Squats', 3, 12, 40, null, 1),
  ('91d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'Bench Press', 3, 10, 30, null, 1),
  ('91d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'Deadlifts', 3, 8, 50, null, 3),
  ('92d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'Pull-ups', 3, 8, null, null, 1),
  ('92d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'Push-ups', 3, 15, null, null, 1),
  ('93d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'Plank', 3, 1, null, 60, 1),
  ('93d7d0e0-0d7d-4d7d-8d7d-9d7d0d7d0d7d', 'Mountain Climbers', 3, 1, null, 45, 1);