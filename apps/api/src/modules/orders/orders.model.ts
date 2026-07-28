import mongoose, { Schema, Document } from 'mongoose';

export type OrderStatus = 'pending' | 'in-preparation' | 'ready' | 'delivered' | 'cancelled';
export const validOrderStatus: OrderStatus[] = ['pending', 'in-preparation', 'ready', 'delivered', 'cancelled'];

export type PaymentMethod = 'cash' | 'debito' | 'credito' | 'transferencia';
export const validPaymentMethods: PaymentMethod[] = ['cash', 'debito', 'credito', 'transferencia'];

export interface IOrderItemAddon {
  additionalId: mongoose.Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
}

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
  additionals: IOrderItemAddon[];
}

export interface IOrder extends Document {
  customer: {
    name: string;
    phone: string;
    address?: string;
  };
  items: IOrderItem[];
  notes?: string;
  couponCode?: string;
  discountPercent: number;
  discountAmount: number;
  subtotal: number;
  deliveryType: 'pickup' | 'delivery';
  paymentMethod: PaymentMethod;
  deliveryCost: number;
  surcharge: number;
  delivery?: {
    address?: string;
  };
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemAddonSchema = new Schema<IOrderItemAddon>({
  additionalId: { type: Schema.Types.ObjectId, ref: 'Adicional', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1, max: 10 },
}, { _id: false });

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  additionals: { type: [OrderItemAddonSchema], default: [] },
}, { _id: false });

const orderSchema = new Schema<IOrder>(
  {
    customer: {
      name: { type: String, required: [true, 'El nombre del cliente es obligatorio'] },
      phone: { type: String, required: [true, 'El teléfono del cliente es obligatorio'] },
      address: { type: String },
    },
    items: { type: [OrderItemSchema], required: true },
    notes: {
      type: String,
      trim: true,
      maxlength: [60, 'Las notas no pueden superar los 60 caracteres'],
      default: '',
    },
    couponCode: { type: String },
    discountPercent: { type: Number, default: 0, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryType: { type: String, enum: ['pickup', 'delivery'], required: true },
    paymentMethod: { type: String, enum: validPaymentMethods, required: true },
    deliveryCost: { type: Number, default: 0, min: 0 },
    surcharge: { type: Number, default: 0, min: 0 },
    delivery: {
      address: { type: String },
    },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: validOrderStatus,
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
