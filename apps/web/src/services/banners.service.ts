import apiClient from './api';
import { Banner } from '@/types';

export const bannersService = {
  getActive: (): Promise<Banner[]> =>
    apiClient.get('/banners/active').then((r) => r.data.data),

  getAll: (): Promise<Banner[]> =>
    apiClient.get('/banners/admin/all').then((r) => r.data.data),
};
