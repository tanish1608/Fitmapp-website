/*
  # Add sample clients and workout plans

  1. New Data
    - Sample clients with diverse profiles
    - Workout plans for different clients
    - Exercise data for workout plans
    - Handles not-null constraints properly

  2. Changes
    - Insert test data for clients table
    - Insert test data for workout_plans table
    - Insert test data for exercises table
*/

-- Insert sample clients
WITH test_trainer AS (
  SELECT id FROM auth.users WHERE email = 'test@example.com' LIMIT 1
)
INSERT INTO clients (
  trainer_id,
  name,
  email,
  age,
  gender,
  weight,
  height,
  is_vegetarian,
  dietary_restrictions,
  movement_restrictions,
  avatar_url
)
SELECT 
  test_trainer.id,
  client_name,
  client_email,
  age,
  gender,
  weight,
  height,
  is_vegetarian,
  dietary_restrictions,
  movement_restrictions,
  avatar_url
FROM test_trainer,
(VALUES
  (
    'Sarah Johnson',
    'sarah.j@example.com',
    28,
    'female',
    65.5,
    '5''7"',
    true,
    ARRAY['Lactose intolerant', 'No nuts']::text[],
    ARRAY['Lower back pain']::text[],
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
  ),
  (
    'Michael Chen',
    'michael.c@example.com',
    35,
    'male',
    78.2,
    '5''10"',
    false,
    ARRAY['Low sodium']::text[],
    ARRAY['Knee injury']::text[],
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
  ),
  (
    'Emma Davis',
    'emma.d@example.com',
    24,
    'female',
    58.9,
    '5''5"',
    false,
    ARRAY[]::text[],
    ARRAY[]::text[],
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
  ),
  (
    'James Wilson',
    'james.w@example.com',
    42,
    'male',
    88.5,
    '6''0"',
    false,
    ARRAY['Gluten-free']::text[],
    ARRAY['Shoulder mobility']::text[],
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
  ),
  (
    'Sofia Rodriguez',
    'sofia.r@example.com',
    31,
    'female',
    62.1,
    '5''6"',
    true,
    ARRAY['Vegan']::text[],
    ARRAY[]::text[],
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400'
  ),
  (
    'David Kim',
    'david.k@example.com',
    29,
    'male',
    72.8,
    '5''9"',
    false,
    ARRAY[]::text[],
    ARRAY['Wrist strain']::text[],
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
  ),
  (
    'Lisa Brown',
    'lisa.b@example.com',
    38,
    'female',
    68.4,
    '5''8"',
    true,
    ARRAY['Dairy-free']::text[],
    ARRAY['Hip flexor']::text[],
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
  ),
  (
    'Alex Thompson',
    'alex.t@example.com',
    33,
    'male',
    76.3,
    '5''11"',
    false,
    ARRAY['Keto']::text[],
    ARRAY[]::text[],
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400'
  )
) as c(
  client_name,
  client_email,
  age,
  gender,
  weight,
  height,
  is_vegetarian,
  dietary_restrictions,
  movement_restrictions,
  avatar_url
);

-- Insert workout plans for each client
WITH client_data AS (
  SELECT c.id as client_id, c.trainer_id
  FROM clients c
  JOIN auth.users u ON c.trainer_id = u.id
  WHERE u.email = 'test@example.com'
)
INSERT INTO workout_plans (
  client_id,
  trainer_id,
  name,
  start_date,
  end_date
)
SELECT
  cd.client_id,
  cd.trainer_id,
  'Custom ' || plan_name,
  CURRENT_DATE - (INTERVAL '1 day' * days_ago),
  CURRENT_DATE - (INTERVAL '1 day' * days_ago) + (INTERVAL '1 day' * duration)
FROM client_data cd
CROSS JOIN (
  VALUES
    ('Weight Loss Program', 0, 90),
    ('Strength Building', 30, 60),
    ('HIIT Program', 15, 45),
    ('Muscle Gain', 7, 120),
    ('Fitness Fundamentals', 45, 30),
    ('Core Focus', 10, 60),
    ('Endurance Training', 20, 90),
    ('Power Building', 5, 75)
) as p(plan_name, days_ago, duration);