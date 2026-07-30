import apiClient from './api';
import { Product, Category, Addon, StoreConfig, Banner } from '@/types';

export const menuService = {
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get('/products');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get('/categories');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  getAdditionals: async (): Promise<Addon[]> => {
    try {
      const response = await apiClient.get('/additionals');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching additionals:', error);
      throw error;
    }
  },

  getStoreStatus: async (): Promise<StoreConfig> => {
    try {
      const response = await apiClient.get('/config/status');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching store status:', error);
      throw error;
    }
  },

  getBanners: async (): Promise<Banner[]> => {
    try {
      const response = await apiClient.get('/banners');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
  },
};