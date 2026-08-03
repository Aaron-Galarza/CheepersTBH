import apiClient from './api';
import { Banner } from '@/types';

export const bannersService = {
  getPublic: async (): Promise<Banner[]> => {
    const response = await apiClient.get('/banners');
    return response.data.data || [];
  },

  getActive: async (): Promise<Banner[]> => {
    const response = await apiClient.get('/banners/active');
    return response.data.data;
  },

  getAll: async (): Promise<Banner[]> => {
    const response = await apiClient.get('/banners/admin/all');
    return response.data.data || [];
  },

  create: async (data: any): Promise<Banner> => {
    const response = await apiClient.post('/banners/admin', data);
    return response.data.data;
  },

  update: async (id: string, data: any): Promise<Banner> => {
    const response = await apiClient.put(`/banners/admin/${id}`, data);
    return response.data.data;
  },

  toggleActive: async (id: string): Promise<Banner> => {
    const response = await apiClient.put(`/banners/admin/${id}/toggleActive`);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/banners/admin/${id}`);
  },
};
