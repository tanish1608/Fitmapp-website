export interface Client {
  id: string;
  name: string;
  avatar?: string;
  startDate: string;
  endDate: string;
  workoutScore: number;
  dietScore: number;
  lastUpdate: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  weight: number;
  height: string;
  dietaryRestrictions: string[];
  movementRestrictions: string[];
  isVegetarian: boolean;
  plan: {
    name: string;
    startDate: string;
    endDate: string;
  };
  sessionsCompleted: number;
  complianceRate: number;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  time?: number;
}