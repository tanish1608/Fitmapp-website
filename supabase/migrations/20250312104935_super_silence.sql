/*
  # Add sample exercises and foods

  1. Changes
    - Insert sample exercises with proper form instructions
    - Insert healthy food options with nutritional info
    - Link foods to diet types without duplicates

  2. Security
    - All data is linked to test user
    - Maintains RLS policies
*/

-- Insert sample exercises for the test user
WITH test_user AS (
  SELECT id FROM auth.users WHERE email = 'test@example.com' LIMIT 1
)
INSERT INTO exercises (
  name,
  equipment_id,
  muscle_group_id,
  movement_type_id,
  force_type,
  mechanics,
  expertise_level,
  instructions,
  created_by
) 
SELECT
  exercise_name,
  eq.id as equipment_id,
  mg.id as muscle_group_id,
  mt.id as movement_type_id,
  force_type,
  mechanics,
  expertise_level,
  instructions,
  test_user.id as created_by
FROM test_user,
(VALUES
  (
    'Barbell Bench Press',
    'Barbell',
    'Chest',
    'Push',
    'push',
    'compound',
    2,
    '1. Lie on bench with feet flat on floor\n2. Grip barbell slightly wider than shoulder width\n3. Lower bar to chest\n4. Press bar up until arms are extended'
  ),
  (
    'Pull-ups',
    'Bodyweight',
    'Back',
    'Pull',
    'pull',
    'compound',
    3,
    '1. Hang from pull-up bar with hands slightly wider than shoulders\n2. Pull yourself up until chin clears the bar\n3. Lower back down with control'
  ),
  (
    'Squats',
    'Barbell',
    'Legs',
    'Squat',
    'push',
    'compound',
    2,
    '1. Place bar on upper back\n2. Feet shoulder-width apart\n3. Squat down until thighs are parallel to ground\n4. Stand back up'
  ),
  (
    'Dumbbell Shoulder Press',
    'Dumbbell',
    'Shoulders',
    'Push',
    'push',
    'compound',
    1,
    '1. Sit or stand with dumbbells at shoulder level\n2. Press weights overhead\n3. Lower back to starting position'
  ),
  (
    'Kettlebell Swings',
    'Kettlebell',
    'Back',
    'Hinge',
    'explosive',
    'compound',
    2,
    '1. Stand with feet shoulder-width apart\n2. Hinge at hips and swing kettlebell between legs\n3. Thrust hips forward to swing kettlebell to shoulder height'
  )
) as e(exercise_name, equipment_name, muscle_group_name, movement_type_name, force_type, mechanics, expertise_level, instructions)
JOIN exercise_categories eq ON eq.name = e.equipment_name AND eq.type = 'equipment'
JOIN exercise_categories mg ON mg.name = e.muscle_group_name AND mg.type = 'muscle_group'
JOIN exercise_categories mt ON mt.name = e.movement_type_name AND mt.type = 'movement_type';

-- Insert sample foods
WITH test_user AS (
  SELECT id FROM auth.users WHERE email = 'test@example.com' LIMIT 1
)
INSERT INTO foods (
  name,
  description,
  calories,
  protein,
  carbs,
  fats,
  created_by
)
SELECT
  name,
  description,
  calories,
  protein,
  carbs,
  fats,
  test_user.id
FROM test_user,
(VALUES
  (
    'Grilled Chicken Breast',
    'Lean protein source, perfect for muscle building',
    165,
    31,
    0,
    3.6
  ),
  (
    'Quinoa Bowl',
    'High-protein grain with complete amino acid profile',
    222,
    8,
    39,
    3.6
  ),
  (
    'Salmon Fillet',
    'Rich in omega-3 fatty acids and protein',
    208,
    22,
    0,
    13
  ),
  (
    'Sweet Potato',
    'Complex carbs with high fiber content',
    103,
    2,
    24,
    0.2
  ),
  (
    'Greek Yogurt',
    'High protein dairy option, good for muscle recovery',
    130,
    12,
    9,
    4
  )
) as f(name, description, calories, protein, carbs, fats);

-- Link foods with categories (preventing duplicates)
WITH food_category_pairs AS (
  SELECT f.id as food_id, c.id as category_id
  FROM foods f
  CROSS JOIN food_categories c
  WHERE 
    (f.name = 'Quinoa Bowl' AND c.name IN ('Vegetarian', 'Vegan')) OR
    (f.name = 'Salmon Fillet' AND c.name = 'Pescatarian') OR
    (f.name = 'Sweet Potato' AND c.name IN ('Vegan', 'Paleo'))
)
INSERT INTO food_diet_types (food_id, category_id)
SELECT DISTINCT food_id, category_id 
FROM food_category_pairs
ON CONFLICT (food_id, category_id) DO NOTHING;