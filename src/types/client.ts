export interface Client {
  id: string;
  trainer_id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  age: number | null;
  gender: string | null;
  weight: number | null;
  height: string | null;
  is_vegetarian: boolean;
  dietary_restrictions: string[];
  movement_restrictions: string[];
  created_at: string;
  updated_at: string;
}