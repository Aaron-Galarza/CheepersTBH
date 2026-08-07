import apiClient from './api';
import { Order } from '@/types';

type Range = 'today' | 'yesterday' | 'week' | 'month' | 'custom';

export const analyticsService = {
  getStats: async (range: Range = 'today', customFrom?: string, customTo?: string) => {
    const params: any = {};
    if (range === 'custom' && customFrom && customTo) {
      params.from = customFrom;
      params.to = customTo;
    } else {
      params.range = range;
    }
    const res = await apiClient.get('/analytics/admin', { params });
    return res.data.data;
  },

  getOrders: async (range: Range = 'today', paymentFilter = '', customFrom?: string, customTo?: string) => {
    const res = await apiClient.get('/orders/admin');
    const orders: Order[] = res.data.data.orders || [];
    let filtered = orders.filter((o) => o.createdAt && o.status === 'delivered');
    if (paymentFilter) filtered = filtered.filter((o) => o.paymentMethod === paymentFilter);

    const now = new Date();
    if (range === 'today') {
      filtered = filtered.filter((o) => new Date(o.createdAt!).toDateString() === now.toDateString());
    } else if (range === 'yesterday') {
      const y = new Date(now); y.setDate(now.getDate() - 1);
      filtered = filtered.filter((o) => new Date(o.createdAt!).toDateString() === y.toDateString());
    } else if (range === 'week') {
      const w = new Date(now); w.setDate(now.getDate() - 7);
      filtered = filtered.filter((o) => new Date(o.createdAt!) >= w);
    } else if (range === 'month') {
      const m = new Date(now); m.setMonth(now.getMonth() - 1);
      filtered = filtered.filter((o) => new Date(o.createdAt!) >= m);
    } else if (range === 'custom' && customFrom && customTo) {
      const from = new Date(customFrom);
      const to = new Date(customTo); to.setHours(23, 59, 59, 999);
      filtered = filtered.filter((o) => { const d = new Date(o.createdAt!); return d >= from && d <= to; });
    }
    return filtered;
  },
};
