import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  logout: () => void;
}

// For demo purposes, we're using mock data with localStorage persistence
// In a real app, this would connect to a backend API
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      if (email && password) {
        set({ 
          isAuthenticated: true,
          user: {
            id: '1',
            email,
            name: 'Demo User'
          },
          isLoading: false
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      if (name && email && password) {
        set({ 
          isAuthenticated: true,
          user: {
            id: '1',
            email,
            name
          },
          isLoading: false
        });
      } else {
        throw new Error('Invalid registration data');
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateProfile: (updates: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      set({
        user: { ...currentUser, ...updates }
      });
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  }
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }), // Persist user and auth status
    }
  )
);