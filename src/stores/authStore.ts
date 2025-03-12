import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

interface AuthState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, profileData: any) => Promise<void>;
  signOut: () => Promise<void>;
  loadProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  isLoading: true,
  error: null,
  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      // Check for admin credentials bypass
      if (email === 'admin' && password === 'admin123') {
        set({
          profile: {
            id: 'admin',
            email: 'admin@system',
            full_name: 'System Administrator',
            role: 'admin'
          },
          isLoading: false,
          error: null
        });
        return;
      }

      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (!user) throw new Error('No user returned after sign in');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        // If profile doesn't exist, create one
        if (profileError.message.includes('Results contain 0 rows')) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              role: 'trainer'
            })
            .select('id, email, full_name, role')
            .single();

          if (createError) throw createError;
          set({ profile: newProfile, isLoading: false, error: null });
          return;
        }
        throw profileError;
      }

      set({ profile, isLoading: false, error: null });
    } catch (error) {
      set({ 
        profile: null, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred during sign in'
      });
      throw error;
    }
  },
  signUp: async (email: string, password: string, profileData: any) => {
    try {
      set({ isLoading: true, error: null });

      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error('No user returned after sign up');

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: profileData.fullName,
          role: 'trainer'
        });

      if (profileError) throw profileError;
      set({ isLoading: false, error: null });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred during sign up'
      });
      throw error;
    }
  },
  signOut: async () => {
    try {
      set({ isLoading: true, error: null });

      // If it's the admin bypass user, just clear the state
      if (useAuthStore.getState().profile?.id === 'admin') {
        set({ profile: null, isLoading: false, error: null });
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ profile: null, isLoading: false, error: null });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred during sign out'
      });
      throw error;
    }
  },
  loadProfile: async () => {
    try {
      set({ isLoading: true, error: null });

      // Check if we have an admin bypass session
      const currentProfile = useAuthStore.getState().profile;
      if (currentProfile?.id === 'admin') {
        set({ profile: currentProfile, isLoading: false, error: null });
        return;
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      if (!session) {
        set({ profile: null, isLoading: false, error: null });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        // Create new profile if it doesn't exist
        if (profileError.message.includes('Results contain 0 rows')) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              email: session.user.email,
              role: 'trainer'
            })
            .select('id, email, full_name, role')
            .single();

          if (createError) throw createError;
          set({ profile: newProfile, isLoading: false, error: null });
          return;
        }
        throw profileError;
      }

      set({ profile, isLoading: false, error: null });
    } catch (error) {
      console.error('Error loading profile:', error);
      set({ 
        profile: null, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred while loading profile'
      });
    }
  },
}));

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    useAuthStore.getState().loadProfile();
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.getState().signOut();
  }
});