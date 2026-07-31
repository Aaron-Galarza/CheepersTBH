import apiClient from './api';
import { Coupon } from '@/types';

export const couponsService = {
  validateCoupon: async (code: string): Promise<Coupon> => {
    const response = await apiClient.post('/coupons/validate', { code: code.toUpperCase() });
    return response.data.data;
  },
};
