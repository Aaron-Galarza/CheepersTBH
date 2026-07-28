import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartAddon, Coupon } from '@/types';

interface CartState {
  items: CartItem[];
  deliveryType: 'pickup' | 'delivery' | null;
  paymentMethod: 'cash' | 'debito' | 'credito' | 'transferencia' | null;
  coupon: Coupon | null;
  deliveryAddress: string;
  deliveryCoordinates: { lat: number; lng: number } | null;
  deliveryCost: number;
  // Acciones
  addItem: (product: any, quantity: number, addons: CartAddon[]) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setDeliveryType: (type: 'pickup' | 'delivery') => void;
  setPaymentMethod: (
      method: 'cash' | 'debito' | 'credito' | 'transferencia'
  ) => void;
  setCoupon: (coupon: Coupon) => void;
  clearCoupon: () => void;
  setDeliveryAddress: (address: string, coords: { lat: number; lng: number }) => void;
  setDeliveryCost: (cost: number) => void;
  clearDelivery: () => void;
  // Computed getters
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryType: null,
      paymentMethod: null,
      coupon: null,
      deliveryAddress: '',
      deliveryCoordinates: null,
      deliveryCost: 0,

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
        set({
          items: [],
          coupon: null,
          deliveryCost: 0,
          deliveryCoordinates: null,
          deliveryAddress: '',
          deliveryType: null,
          paymentMethod: null,
        });
      },

      setDeliveryType: (type) => {
        set({ deliveryType: type });
        if (type === 'pickup') {
          get().clearDelivery();
        }
      },

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      setCoupon: (coupon) => set({ coupon }),

      clearCoupon: () => set({ coupon: null }),

      setDeliveryAddress: (address, coords) => {
        set({
          deliveryAddress: address,
          deliveryCoordinates: coords,
        });
      },

      setDeliveryCost: (cost) => {
        set({ deliveryCost: cost });
      },

      clearDelivery: () => {
        set({
          deliveryAddress: '',
          deliveryCoordinates: null,
          deliveryCost: 0,
        });
      },

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

      getDiscount: () => {
        if (!get().coupon) return 0;
        return (get().getSubtotal() * get().coupon!.discountPercent) / 100;
      },

      getTotal: () => {
        return get().getSubtotal() - get().getDiscount() + get().deliveryCost;
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cheepers-cart',
    }
  )
);