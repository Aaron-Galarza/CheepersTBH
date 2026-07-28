import { z } from 'zod';

const AdditionalItemSchema = z.object({
  name: z.string().min(1, 'El nombre del adicional es requerido'),
  price: z.number().nonnegative('El precio no puede ser negativo'),
  quantity: z.number().positive('La cantidad debe ser mayor a 0'),
});

const OrderItemSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  price: z.number().nonnegative('El precio no puede ser negativo'),
  quantity: z.number().positive('La cantidad debe ser mayor a 0'),
  additionals: z.array(AdditionalItemSchema).optional().default([]),
});

export const CreateOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(2, 'El nombre debe tener mínimo 2 caracteres').max(100),
    phone: z.string().min(10, 'El teléfono debe tener mínimo 10 dígitos').max(20),
  }),
  items: z.array(OrderItemSchema).min(1, 'Debe haber al menos un artículo'),
  deliveryType: z.enum(['pickup', 'delivery'], {
    error: 'Tipo de entrega inválido',
  }),
  paymentMethod: z.enum(['cash', 'transfer', 'mercadopago'], {
    error: 'Método de pago inválido',
  }),
  couponCode: z.string().optional().nullable(),
  deliveryAddress: z.string().optional().nullable(),
}).refine(
  (data) => {
    if (data.deliveryType === 'delivery') {
      return !!data.deliveryAddress && data.deliveryAddress.trim().length > 0;
    }
    return true;
  },
  {
    message: 'La dirección es requerida cuando el tipo de envío es delivery',
    path: ['deliveryAddress'],
  }
);

export const OrderUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']).optional(),
  deliveryCost: z.number().min(0).optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type OrderUpdate = z.infer<typeof OrderUpdateSchema>;
