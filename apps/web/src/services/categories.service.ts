import apiClient from './api';
import { Category } from '@/types';

export const categoriesService = {
  getAll: async (): Promise<Category[]> => {
    const res = await apiClient.get('/categories');
    return res.data.data || [];
  },
  getAllAdmin: async (): Promise<Category[]> => {
    const res = await apiClient.get('/categories/admin/all');
    return res.data.data || [];
  },
  create: async (data: { name: string; order?: number; active?: boolean; icon?: string }): Promise<Category> => {
    const res = await apiClient.post('/categories/admin', data);
    return res.data.data;
  },
  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    const res = await apiClient.put(`/categories/admin/${id}`, data);
    return res.data.data;
  },
  toggleActive: async (id: string): Promise<Category> => {
    const res = await apiClient.patch(`/categories/admin/${id}/toggle`);
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/admin/${id}`);
  },
};
