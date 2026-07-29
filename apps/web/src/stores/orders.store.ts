import { create } from 'zustand';
import { Order } from '@/types';

interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  selectOrder: (orderId: string | null) => void;
  clearOrders: () => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  selectedOrder: null,

  setOrders: (orders) => set({ orders }),

  addOrder: (order) => {
    set((state) => ({
      orders: [order, ...state.orders],
    }));
  },

  updateOrder: (orderId, updates) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order._id === orderId ? { ...order, ...updates } : order
      ),
    }));
  },

  selectOrder: (orderId) => {
    set((state) => ({
      selectedOrder: state.orders.find((order) => order._id === orderId) || null,
    }));
  },

  clearOrders: () => {
    set({ orders: [], selectedOrder: null });
  },
}));