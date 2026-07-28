export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  promotionalLabel?: string;
  imageUrl?: string;
  category: string;
  isActive: boolean;
  tags?: string[];
}

export interface IAddOn {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: string;
  isActive: boolean;
  associatedProductCategories: string[];
}

export interface CartAddon {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addons: CartAddon[];
  itemTotal: number;
}

export interface Coupon {
  _id?: string;
  code: string;
  discountPercent: number;
  validDays?: string[];
  validPaymentMethods?: string[];
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
}

export interface OrderAddon {
  name: string;
  title?: string;
  addonId?: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  title: string;
  price: number;
  quantity: number;
  additionals?: OrderAddon[];
}

export interface Order {
  _id?: string;
  customer: {
    name: string;
    phone: string;
  };
  items: OrderItem[];
  deliveryType: 'pickup' | 'delivery';
  paymentMethod: 'cash' | 'transfer' | 'mercadopago';
  couponCode?: string | null;
  discountPercent: number;
  subtotal: number;
  deliveryCost: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  delivery?: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    distanceKm: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}