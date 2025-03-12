import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Client } from '../types/client';

interface ClientState {
  clients: Client[];
  selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;
  loadClients: () => Promise<void>;
  selectClient: (id: string | null) => void;
  addClient: (client: Omit<Client, 'id' | 'trainer_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null,

  loadClients: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('clients')
        .select('id, trainer_id, name, email, avatar_url, age, gender, weight, height, is_vegetarian, dietary_restrictions, movement_restrictions, created_at, updated_at')
        .eq('trainer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ clients: data || [], error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load clients' });
    } finally {
      set({ isLoading: false });
    }
  },

  selectClient: (id) => {
    const client = id ? get().clients.find(c => c.id === id) : null;
    set({ selectedClient: client });
  },

  addClient: async (client) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...client, trainer_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        clients: [data, ...state.clients],
        error: null
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add client' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateClient: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        clients: state.clients.map(c => c.id === id ? data : c),
        selectedClient: state.selectedClient?.id === id ? data : state.selectedClient,
        error: null
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update client' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteClient: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        clients: state.clients.filter(c => c.id !== id),
        selectedClient: state.selectedClient?.id === id ? null : state.selectedClient,
        error: null
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete client' });
    } finally {
      set({ isLoading: false });
    }
  }
}));