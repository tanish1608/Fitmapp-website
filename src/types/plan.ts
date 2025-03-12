export interface Plan {
  id: string;
  trainer_id: string;
  name: string;
  duration: number;
  workout_frequency: number;
  calories_per_day: number;
  workouts_count: number;
  diet_count: number;
  price: number;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePlanInput {
  name: string;
  duration: number;
  workout_frequency: number;
  calories_per_day: number;
  price: number;
  thumbnail_url?: string;
}