import { create } from 'zustand';
import { CartItem, SelectedAddOn } from '@/types';

interface POSState {
  items: CartItem[];
  searchQuery: string;
  selectedCategory: string | null;
  addItem: (product: any, quantity: number, addons: SelectedAddOn[]) => void;
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

  addItem: (product: any, quantity: number, addons: SelectedAddOn[]) => {
    set((state) => {
      const id = `${product._id}_${addons.map((a) => a._id).sort().join(',')}`;
      const existing = state.items.find((i) => i.cartItemId === id);
      if (existing) {
        return { items: state.items.map((i) => i.cartItemId === id ? { ...i, quantity: i.quantity + quantity } : i) };
      }
      return { items: [...state.items, { ...product, quantity, addOns: addons, cartItemId: id }] };
    });
  },

  removeItem: (itemId) => {
    set((state) => ({ items: state.items.filter((item) => item.cartItemId !== itemId) }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) { get().removeItem(itemId); return; }
    set((state) => ({ items: state.items.map((i) => i.cartItemId === itemId ? { ...i, quantity } : i) }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),

  getSubtotal: () => {
    return get().items.reduce((sum, item) => {
      let price = item.price;
      for (const ao of item.addOns) price += ao.price * ao.quantity;
      return sum + price * item.quantity;
    }, 0);
  },
}));