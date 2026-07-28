import { create } from 'zustand';
import { CartItem, CartAddon } from '@/types';

interface POSState {
  items: CartItem[];
  searchQuery: string;
  selectedCategory: string | null;
  addItem: (product: any, quantity: number, addons: CartAddon[]) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  getSubtotal: () => number;
}

export const usePOSStore = create<POSState>((set, get) => ({
  items: [],
  searchQuery: '',
  selectedCategory: null,

  addItem: (product, quantity, addons) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) =>
          item.product._id === product._id &&
          JSON.stringify(item.addons) === JSON.stringify(addons)
      );

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            id: `${product._id}-${Date.now()}`,
            product,
            quantity,
            addons,
            itemTotal: 0,
          },
        ],
      };
    });
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),

  getSubtotal: () => {
    return get().items.reduce((sum, item) => {
      const itemPrice = item.product.price * item.quantity;
      const addonsPrice = item.addons.reduce(
        (addonSum, addon) => addonSum + addon.price * addon.quantity,
        0
      );
      return sum + itemPrice + addonsPrice;
    }, 0);
  },
}));