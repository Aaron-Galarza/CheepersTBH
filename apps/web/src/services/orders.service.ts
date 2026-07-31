import apiClient from './api';
import { Order } from '@/types';

export const ordersService = {
  createOrder: async (orderData: any): Promise<Order> => {
    const response = await apiClient.post('/orders', orderData).catch((err: any) => {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Error al crear la orden';
      throw new Error(msg);
    });
    return (response as any).data.data;
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data.data;
  },

  getComanda: async (orderId: string): Promise<string> => {
    const response = await apiClient.get(`/orders/${orderId}/comanda`);
    return response.data.data.comanda;
  },

  getOrders: async (status?: string): Promise<Order[]> => {
    const url = status ? `/orders/admin?status=${status}` : '/orders/admin';
    const response = await apiClient.get(url);
    return response.data.data.orders || [];
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    const response = await apiClient.patch(`/orders/admin/${orderId}/status`, { status });
    return response.data.data;
  },

  deleteOrder: async (orderId: string): Promise<void> => {
    await apiClient.delete(`/orders/admin/${orderId}`);
  },

  getStats: async (): Promise<any> => {
    const response = await apiClient.get('/orders/admin/stats');
    return response.data.data;
  },
};
