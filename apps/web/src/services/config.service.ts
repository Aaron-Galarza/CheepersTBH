import apiClient from './api';
import { StoreConfig } from '@/types';

export const configService = {
  getStatus: async (): Promise<StoreConfig> => {
    const response = await apiClient.get('/config/status');
    return response.data.data;
  },

  updateSchedule: async (dailySchedule: any[]): Promise<StoreConfig> => {
    const response = await apiClient.put('/config/schedule', { dailySchedule });
    return response.data.data;
  },

  toggleEmergency: async (): Promise<StoreConfig> => {
    const response = await apiClient.patch('/config/emergency');
    return response.data.data;
  },

  updateBanner: async (banner: string): Promise<StoreConfig> => {
    const response = await apiClient.put('/config/banner', { banner });
    return response.data.data;
  },
};
