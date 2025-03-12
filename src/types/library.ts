export interface Category {
  id: string;
  type: 'equipment' | 'muscle_group' | 'movement_type' | 'diet_type' | 'ingredient' | 'allergy';
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  trainer_id: string;
  name: string;
  equipment_id: string | null;
  muscle_group_id: string | null;
  movement_type_id: string | null;
  force_type: 'push' | 'pull' | 'static' | 'explosive' | null;
  mechanics: 'compound' | 'isolation' | 'cardio' | null;
  expertise_level: 1 | 2 | 3;
  video_url: string | null;
  instructions: string | null;
  secondary_muscles: string[];
  created_at: string;
  updated_at: string;
}

export interface Food {
  id: string;
  trainer_id: string;
  name: string;
  description: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  diet_types: string[];
  ingredients: string[];
  allergens: string[];
  image_url: string | null;
  created_at: string;
  updated_at: string;
}