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
};
