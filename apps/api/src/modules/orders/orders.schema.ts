import { z } from 'zod';

export const OrderItemSchema = z.object({
  productId: z.string().min(1, 'ID del producto es requerido'),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
  additionals: z.array(
    z.object({
      additionalId: z.string().optional(),
      quantity: z.number().int().positive(),
    })
  ).optional().default([]),
});

export const OrderCreateSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'El nombre del cliente es requerido'),
    phone: z.string().min(1, 'El teléfono es requerido'),
  }),
  items: z.array(OrderItemSchema).min(1, 'Debe haber al menos un artículo'),
  deliveryType: z.enum(['pickup', 'delivery']),
  paymentMethod: z.enum(['cash', 'debito', 'credito', 'transferencia']),
  notes: z.string().max(60, 'Las notas no pueden superar los 60 caracteres').optional().default(''),
  couponCode: z.string().optional(),
  delivery: z.object({
    address: z.string().optional(),
  }).optional(),
}).refine(
  (data) => {
    if (data.deliveryType === 'delivery') {
      return !!data.delivery?.address && data.delivery.address.trim().length > 0;
    }
    return true;
  },
  {
    message: 'La dirección es requerida cuando el tipo de envío es delivery',
    path: ['delivery', 'address'],
  }
);

export const OrderUpdateSchema = z.object({
  status: z.enum(['pending', 'in-preparation', 'ready', 'delivered', 'cancelled']).optional(),
  deliveryCost: z.number().min(0).optional(),
  delivery: z.object({
    address: z.string().optional(),
  }).optional(),
});

export type OrderCreate = z.infer<typeof OrderCreateSchema>;
export type OrderUpdate = z.infer<typeof OrderUpdateSchema>;
