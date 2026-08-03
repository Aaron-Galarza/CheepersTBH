import apiClient from './api';

export const authService = {
  login: async (email: string, password: string): Promise<string> => {
    const response = await apiClient.post('/users/login', { email, password });
    return response.data.data.token;
  },

  logout: () => {},
};
