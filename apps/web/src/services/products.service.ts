import apiClient from './api';
import { Product } from '@/types';

export const productsService = {
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get('/products');
    return response.data.data || [];
  },

  getById: async (id: string): Promise<Product | null> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.data || null;
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await apiClient.get(`/products/category/${category}`);
    return response.data.data || [];
  },

  getAllAdmin: async (): Promise<Product[]> => {
    const res = await apiClient.get('/products/admin/all');
    return res.data.data || [];
  },

  create: async (data: any): Promise<Product> => {
    const res = await apiClient.post('/products/admin', data);
    return res.data.data;
  },

  update: async (id: string, data: any): Promise<Product> => {
    const res = await apiClient.put(`/products/admin/${id}`, data);
    return res.data.data;
  },

  toggleActive: async (id: string): Promise<Product> => {
    const res = await apiClient.patch(`/products/admin/${id}/toggle`);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/admin/${id}`);
  },
};
