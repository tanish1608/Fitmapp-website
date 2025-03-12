import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { WorkoutPlan, Exercise } from '../types/workout';

interface WorkoutState {
  plans: WorkoutPlan[];
  exercises: Record<string, Exercise[]>;
  isLoading: boolean;
  error: string | null;
  loadWorkoutPlans: (clientId: string) => Promise<void>;
  loadExercises: (planId: string) => Promise<void>;
  addExercise: (exercise: Omit<Exercise, 'id'>) => Promise<void>;
  updateExercise: (id: string, updates: Partial<Exercise>) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  plans: [],
  exercises: {},
  isLoading: false,
  error: null,
  loadWorkoutPlans: async (clientId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('client_id', clientId)
        .order('start_date', { ascending: false });

      if (error) throw error;
      set({ plans: data, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  loadExercises: async (planId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('plan_id', planId)
        .order('day_of_week', { ascending: true });

      if (error) throw error;
      set((state) => ({
        exercises: { ...state.exercises, [planId]: data },
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  addExercise: async (exercise) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('exercises')
        .insert([exercise])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        exercises: {
          ...state.exercises,
          [exercise.plan_id]: [
            ...(state.exercises[exercise.plan_id] || []),
            data,
          ],
        },
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  updateExercise: async (id, updates) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('exercises')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        exercises: Object.fromEntries(
          Object.entries(state.exercises).map(([planId, exercises]) => [
            planId,
            exercises.map((e) => (e.id === id ? data : e)),
          ])
        ),
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteExercise: async (id) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        exercises: Object.fromEntries(
          Object.entries(state.exercises).map(([planId, exercises]) => [
            planId,
            exercises.filter((e) => e.id !== id),
          ])
        ),
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));