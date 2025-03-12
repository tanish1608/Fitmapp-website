export interface WorkoutPlan {
  id: string;
  client_id: string;
  trainer_id: string;
  name: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  plan_id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  time?: number;
  day_of_week: number;
  created_at: string;
  updated_at: string;
}