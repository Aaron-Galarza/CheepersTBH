import mongoose, { Schema, Document } from 'mongoose';
import {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  DELIVERY_TYPES,
  OrderStatus,
  PaymentMethod,
  DeliveryType,
} from '../../constants';

export interface IOrderItemAddon {
  name: string;
  price: number;
  quantity: number;
}

export interface IOrderItem {
  title: string;
  price: number;
  quantity: number;
  additionals: IOrderItemAddon[];
}

export interface IOrder extends Document {
  customer: {
    name: string;
    phone: string;
  };
  items: IOrderItem[];
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  couponCode?: string | null;
  discountPercent: number;
  subtotal: number;
  deliveryCost?: number;
  total: number;
  status: OrderStatus;
  delivery?: {
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    distanceKm?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemAddonSchema = new Schema<IOrderItemAddon>({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const OrderItemSchema = new Schema<IOrderItem>({
  title: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  additionals: { type: [OrderItemAddonSchema], default: [] },
}, { _id: false });

const orderSchema = new Schema<IOrder>(
  {
    customer: {
      name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, 'El teléfono es obligatorio'],
        trim: true,
      },
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (items: any[]) => items.length > 0,
        message: 'La orden debe tener al menos un artículo',
      },
    },
    deliveryType: {
      type: String,
      enum: DELIVERY_TYPES,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
    },
    couponCode: {
      type: String,
      trim: true,
      default: null,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'pending',
    },
    delivery: {
      address: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
      distanceKm: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'customer.phone': 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
