import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Category, Exercise, Food } from '../types/library';

interface LibraryState {
  exercises: Exercise[];
  foods: Food[];
  categories: Category[];
  selectedTab: 'exercises' | 'foods';
  isLoading: boolean;
  error: string | null;
  setSelectedTab: (tab: 'exercises' | 'foods') => void;
  loadCategories: () => Promise<void>;
  loadExercises: () => Promise<void>;
  loadFoods: () => Promise<void>;
  addExercise: (exercise: Omit<Exercise, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateExercise: (id: string, updates: Partial<Exercise>) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
  addFood: (food: Omit<Food, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateFood: (id: string, updates: Partial<Food>) => Promise<void>;
  deleteFood: (id: string) => Promise<void>;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  exercises: [],
  foods: [],
  categories: [],
  selectedTab: 'exercises',
  isLoading: false,
  error: null,

  setSelectedTab: (tab) => set({ selectedTab: tab }),

  loadCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('exercise_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      set({ categories: data || [], error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load categories' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadExercises: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('exercises')
        .select(`
          *,
          equipment:exercise_categories!equipment_id(*),
          muscle_group:exercise_categories!muscle_group_id(*),
          movement_type:exercise_categories!movement_type_id(*)
        `)
        .order('name');

      if (error) throw error;
      set({ exercises: data || [], error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load exercises' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadFoods: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('foods')
        .select(`
          *,
          diet_types:food_diet_types(category:food_categories(*)),
          ingredients:food_ingredients(category:food_categories(*)),
          allergens:food_allergens(category:food_categories(*))
        `)
        .order('name');

      if (error) throw error;
      set({ foods: data || [], error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load foods' });
    } finally {
      set({ isLoading: false });
    }
  },

  addExercise: async (exercise) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('exercises')
        .insert([{ ...exercise, created_by: user.id }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        exercises: [...state.exercises, data],
        error: null
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add exercise' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateExercise: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('exercises')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        exercises: state.exercises.map(e => e.id === id ? data : e),
        error: null
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update exercise' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteExercise: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        exercises: state.exercises.filter(e => e.id !== id),
        error: null
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete exercise' });
    } finally {
      set({ isLoading: false });
    }
  },

  addFood: async (food) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('foods')
        .insert([{ ...food, created_by: user.id }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        foods: [...state.foods, data],
        error: null
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add food' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateFood: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('foods')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        foods: state.foods.map(f => f.id === id ? data : f),
        error: null
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update food' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFood: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('foods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        foods: state.foods.filter(f => f.id !== id),
        error: null
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete food' });
    } finally {
      set({ isLoading: false });
    }
  }
}));