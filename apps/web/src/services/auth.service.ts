import apiClient from './api';
import { useAuthStore } from '@/stores/auth.store';

export const authService = {
  login: async (email: string, password: string) => {
    // Implementar en bloque 2
    return { token: '' };
  },

  logout: () => {
    useAuthStore.getState().logout();
  },
};
