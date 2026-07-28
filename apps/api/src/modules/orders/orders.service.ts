import { Order, IOrder } from './orders.model';
import { CouponsService } from '../coupons/coupons.service';
import { ConfigService } from '../config/config.service';
import { CreateOrderInput } from './orders.schema';

export const OrdersService = {
  createOrder: async (orderData: CreateOrderInput): Promise<IOrder> => {
    const storeStatus = await ConfigService.getStatus();
    if (!storeStatus.isOpen || storeStatus.isEmergencyClosed) {
      throw new Error('El local está cerrado en este momento');
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
        throw new Error(`Cupón inválido: ${error.message}`);
      }
    }

    let deliveryCost = 0;
    let delivery = undefined;

    if (orderData.deliveryType === 'delivery') {
      // deliveryCost se setea manualmente desde admin via PUT /admin/:id/delivery-cost
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

    return order;
  },

  getOrderById: async (id: string): Promise<IOrder | null> => {
    return await Order.findById(id);
  },

  getOrdersByStatus: async (status: string): Promise<IOrder[]> => {
    return await Order.find({ status: status as any }).sort({ createdAt: -1 }).lean();
  },

  getAllOrders: async (): Promise<IOrder[]> => {
    return await Order.find().sort({ createdAt: -1 }).lean();
  },

  updateOrderStatus: async (id: string, status: string): Promise<IOrder | null> => {
    if (!['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].includes(status)) {
      throw new Error('Estado inválido');
    }
    return await Order.findByIdAndUpdate(id, { status }, { new: true });
  },

  updateDeliveryCost: async (id: string, deliveryCost: number): Promise<IOrder | null> => {
    const order = await Order.findById(id);
    if (!order) return null;

    const newTotal = order.subtotal - (order.subtotal * order.discountPercent) / 100 + deliveryCost;

    return await Order.findByIdAndUpdate(
      id,
      { deliveryCost, total: newTotal },
      { new: true }
    );
  },
};
