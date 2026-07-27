import mongoose from 'mongoose';
import { Order, IOrder } from './orders.model';
import { ProductModel } from '../products/products.model';
import { AdicionalModel } from '../additionals/additionals.model';
import { CouponModel } from '../coupons/coupons.model';

const CREDIT_SURCHARGE_PERCENT = 10;
const DELIVERY_BASE_COST = 0;

export const OrdersService = {
  viewAll: async () => {
    return await Order.find().sort({ createdAt: -1 });
  },

  viewById: async (id: string) => {
    return await Order.findById(id);
  },

  create: async (data: any) => {
    const productIds = data.items.map((item: any) => item.productId);
    const products = await ProductModel.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    const additionalIds: string[] = [];
    data.items.forEach((item: any) => {
      (item.additionals || []).forEach((add: any) => {
        if (add.additionalId) additionalIds.push(add.additionalId);
      });
    });
    const additionals = await AdicionalModel.find({ _id: { $in: additionalIds } });
    const additionalMap = new Map(additionals.map(a => [a._id.toString(), a]));

    let subtotal = 0;

    const items = data.items.map((item: any) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`Producto no encontrado: ${item.productId}`);
      }

      let itemTotal = product.price * item.quantity;
      const resolvedAdditionals = (item.additionals || []).map((add: any) => {
        const additional = additionalMap.get(add.additionalId);
        if (!additional) {
          throw new Error(`Adicional no encontrado: ${add.additionalId}`);
        }
        itemTotal += additional.price * add.quantity;
        return {
          additionalId: additional._id,
          title: additional.title,
          name: additional.title,
          price: additional.price,
          quantity: add.quantity,
        };
      });

      subtotal += itemTotal;

      return {
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        additionals: resolvedAdditionals,
      };
    });

    const deliveryCost = data.deliveryType === 'delivery' ? DELIVERY_BASE_COST : 0;

    let discountPercent = 0;
    if (data.couponCode) {
      const coupon = await CouponModel.findOne({
        code: data.couponCode.toUpperCase(),
        active: true,
      });
      if (!coupon) {
        throw new Error('Cupón inválido o inactivo');
      }
      discountPercent = coupon.discountPercent;
    }

    const discountAmount = subtotal * (discountPercent / 100);
    const afterDiscount = subtotal - discountAmount;

    const isCredit = data.paymentMethod === 'credito';
    const surcharge = isCredit ? afterDiscount * (CREDIT_SURCHARGE_PERCENT / 100) : 0;

    const total = afterDiscount + surcharge + deliveryCost;

    const orderData = {
      customer: data.customer,
      items,
      notes: data.notes || '',
      couponCode: data.couponCode,
      discountPercent,
      subtotal,
      deliveryType: data.deliveryType,
      paymentMethod: data.paymentMethod,
      deliveryCost,
      surcharge,
      delivery: data.delivery,
      total,
    };

    const order = new Order(orderData);
    return await order.save();
  },

  modify: async (id: string, data: any) => {
    return await Order.findByIdAndUpdate(id, data, { new: true });
  },

  deleteById: async (id: string) => {
    return await Order.findByIdAndDelete(id);
  },
};
