import apiClient from './api';
import { Coupon } from '@/types';

export const couponsService = {
  validateCoupon: async (code: string): Promise<Coupon> => {
    const response = await apiClient.post('/coupons/validate', { code: code.toUpperCase() }).catch((err: any) => {
      throw new Error(err.response?.data?.error || 'Cupon invalido');
    });
    return response.data.data;
  },

  getAll: async (): Promise<Coupon[]> => {
    const response = await apiClient.get('/coupons/admin');
    return response.data.data;
  },

  create: async (data: any): Promise<Coupon> => {
    const response = await apiClient.post('/coupons/admin', data);
    return response.data.data;
  },

  update: async (id: string, data: any): Promise<Coupon> => {
    const response = await apiClient.put(`/coupons/admin/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/coupons/admin/${id}`);
  },

  toggle: async (id: string): Promise<Coupon> => {
    const response = await apiClient.patch(`/coupons/admin/${id}/toggle`);
    return response.data.data;
  },
};
