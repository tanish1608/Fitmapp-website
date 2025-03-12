import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Plan, CreatePlanInput } from '../types/plan';

interface PlanState {
  plans: Plan[];
  isLoading: boolean;
  error: string | null;
  loadPlans: () => Promise<void>;
  createPlan: (plan: CreatePlanInput) => Promise<void>;
  updatePlan: (id: string, updates: Partial<Plan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  plans: [],
  isLoading: false,
  error: null,
  loadPlans: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ plans: data || [], error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  createPlan: async (planInput: CreatePlanInput) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const plan = {
        ...planInput,
        trainer_id: user.id,
        workouts_count: planInput.duration * 4 * planInput.workout_frequency, // Approximate number of workouts
        diet_count: planInput.duration * 30, // Approximate number of diet days
      };

      const { data, error } = await supabase
        .from('plans')
        .insert([plan])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        plans: [data, ...state.plans],
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  updatePlan: async (id: string, updates: Partial<Plan>) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        plans: state.plans.map((p) => (p.id === id ? data : p)),
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  deletePlan: async (id: string) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        plans: state.plans.filter((p) => p.id !== id),
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));