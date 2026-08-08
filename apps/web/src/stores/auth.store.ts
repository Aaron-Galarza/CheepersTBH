import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('cheepers-auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
};

interface AuthState {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: getStoredToken(),

      login: (token) => set({ token }),

      logout: () => set({ token: null }),

      getToken: () => get().token,
    }),
    {
      name: 'cheepers-auth',
      skipHydration: true,
    }
  )
);
