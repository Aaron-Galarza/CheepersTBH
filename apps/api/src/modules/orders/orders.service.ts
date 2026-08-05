import { Order, IOrder } from './orders.model';
import { CouponsService } from '../coupons/coupons.service';
import { ConfigService } from '../config/config.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { CreateOrderInput } from './orders.schema';
import { AppError } from '../../utils/appError';
import { ORDER_STATUSES, OrderStatus } from '../../constants';

export const OrdersService = {
  createOrder: async (orderData: CreateOrderInput): Promise<IOrder> => {
    const storeStatus = await ConfigService.getStatus();
    if (!storeStatus.isOpen || storeStatus.isEmergencyClosed) {
      throw new AppError('El local está cerrado en este momento', 400);
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of orderData.items) {
      const itemPrice = item.price * item.quantity;
      let addonsPrice = 0;

      for (const addon of item.additionals || []) {
        addonsPrice += addon.price * addon.quantity;
      }

      subtotal += itemPrice + addonsPrice;

      validatedItems.push({
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        additionals: item.additionals || [],
      });
    }

    let discountPercent = 0;
    let discountAmount = 0;

    if (orderData.couponCode) {
      try {
        const coupon = await CouponsService.validateCoupon(
          orderData.couponCode,
          orderData.paymentMethod
        );
        discountPercent = coupon.discountPercent || 0;
        discountAmount = (subtotal * discountPercent) / 100;
      } catch (error: any) {
        throw new AppError(`Cupón inválido: ${error.message}`, 400);
      }
    }

    let deliveryCost = 0;
    let delivery = undefined;

    if (orderData.deliveryType === 'delivery') {
      delivery = {
        address: orderData.deliveryAddress || undefined,
      };
    }

    const total = subtotal - discountAmount + deliveryCost;

    const order = await Order.create({
      customer: {
        name: orderData.customer.name,
        phone: orderData.customer.phone,
      },
      items: validatedItems,
      deliveryType: orderData.deliveryType,
      paymentMethod: orderData.paymentMethod,
      couponCode: orderData.couponCode || null,
      discountPercent,
      subtotal,
      deliveryCost,
      total,
      status: 'pending',
      delivery,
    });

    await AnalyticsService.registerOrderCreated(order);

    return order;
  },

  viewAll: async (filters: Record<string, any> = {}): Promise<IOrder[]> => {
    return await Order.find(filters).sort({ createdAt: -1 }).lean();
  },

  viewById: async (id: string): Promise<IOrder | null> => {
    return await Order.findById(id);
  },

  // ================================================================
  // ⚠️ EN REVISIÓN (PENDIENTE — no cableado a ninguna ruta)
  // modify(): update genérico de una orden (Partial<IOrder>).
  // Si se usa, cablear a un PUT /admin/:id con schema que limite
  // qué campos se pueden tocar (no status/total/subtotal sueltos).
  // Revisar más adelante. Ver CHECKLIST_BLOQUE4_REVISION.txt.
  // ================================================================
  // modify: async (id: string, updateData: Partial<IOrder>): Promise<IOrder | null> => {
  //   return await Order.findByIdAndUpdate(id, updateData, { new: true });
  // },

  updateStatus: async (id: string, status: string): Promise<IOrder | null> => {
    if (!(ORDER_STATUSES as readonly string[]).includes(status)) {
      throw new AppError('Estado inválido', 400);
    }

    const oldOrder = await Order.findById(id);
    if (!oldOrder) return null;
    const oldStatus = oldOrder.status;

    const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (updated) {
      if (oldStatus !== 'delivered' && status === 'delivered') {
        await AnalyticsService.registerDelivery(updated);
      } else if (oldStatus === 'delivered' && status !== 'delivered') {
        await AnalyticsService.revertDelivery(updated);
      }
    }

    return updated;
  },

  deleteById: async (id: string): Promise<boolean> => {
    const result = await Order.findByIdAndDelete(id);
    return !!result;
  },

  countByStatus: async (status: OrderStatus): Promise<number> => {
    return await Order.countDocuments({ status });
  },

  updateDeliveryCost: async (id: string, deliveryCost: number): Promise<IOrder | null> => {
    const order = await Order.findById(id);
    if (!order) return null;
    if (typeof deliveryCost !== 'number' || deliveryCost < 0) {
      throw new AppError('El costo de envío debe ser un número positivo', 400);
    }

    const newTotal = order.subtotal - (order.subtotal * order.discountPercent) / 100 + deliveryCost;

    return await Order.findByIdAndUpdate(
      id,
      { deliveryCost, total: newTotal },
      { new: true }
    );
  },
};
