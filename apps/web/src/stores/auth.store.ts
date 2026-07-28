import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      isAuthenticated: false,

      login: (token) => {
        set({
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          token: null,
          isAuthenticated: false,
        });
      },

      getToken: () => get().token,
    }),
    {
      name: 'cheepers-auth',
    }
  )
);