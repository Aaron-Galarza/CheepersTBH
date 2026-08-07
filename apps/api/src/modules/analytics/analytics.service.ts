import { format } from 'date-fns';
import { OrderDailyStats, IProductDailyStat } from './analytics.model';
import { IOrder } from '../orders/orders.model';
import { getRangeStartDate } from '../../utils/dateRange';
import { DateRange } from '../../constants';

export interface GetStatsParams {
  range?: DateRange;
  from?: string;
  to?: string;
}

export interface GetStatsResult {
  ordersCount: number;
  completedOrders: number;
  totalSales: number;
  totalCash: number;
  totalTransfer: number;
  avgTicket: number;
  products: IProductDailyStat[];
  topProduct: IProductDailyStat | null;
}

const dateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

const productKey = (title: string): string => Buffer.from(title, 'utf-8').toString('base64');

const itemRevenue = (item: IOrder['items'][number]): number => {
  const addonsTotal = item.additionals.reduce((sum, a) => sum + a.price * a.quantity, 0);
  return item.price * item.quantity + addonsTotal;
};

export const AnalyticsService = {
  registerOrderCreated: async (order: IOrder): Promise<void> => {
    const date = dateKey(order.createdAt);
    await OrderDailyStats.findOneAndUpdate(
      { date },
      { $inc: { ordersCount: 1 } },
      { upsert: true }
    );
  },

  registerDelivery: async (order: IOrder): Promise<void> => {
    const date = dateKey(order.createdAt);
    const incUpdates: Record<string, number> = {};
    const setUpdates: Record<string, string> = {};

    for (const item of order.items) {
      const base = `products.${productKey(item.title)}`;
      incUpdates[`${base}.qty`] = (incUpdates[`${base}.qty`] ?? 0) + item.quantity;
      incUpdates[`${base}.revenue`] = (incUpdates[`${base}.revenue`] ?? 0) + itemRevenue(item);
      setUpdates[`${base}.title`] = item.title;
    }

    const totals: Record<string, number> = {
      completedOrders: 1,
      totalSales: order.total,
      ...incUpdates,
    };
    if (order.paymentMethod === 'cash') totals.totalCash = order.total;
    else if (order.paymentMethod === 'transfer') totals.totalTransfer = order.total;

    await OrderDailyStats.findOneAndUpdate(
      { date },
      {
        $inc: totals,
        $set: setUpdates,
      },
      { upsert: true }
    );
  },

  revertDelivery: async (order: IOrder): Promise<void> => {
    const date = dateKey(order.createdAt);
    const daily = await OrderDailyStats.findOne({ date });
    if (!daily) return;

    const incUpdates: Record<string, number> = {};

    for (const item of order.items) {
      const key = productKey(item.title);
      const base = `products.${key}`;
      const current = daily.products?.get(key);
      const currentQty = current?.qty ?? 0;
      const currentRevenue = current?.revenue ?? 0;

      incUpdates[`${base}.qty`] = (incUpdates[`${base}.qty`] ?? 0) - Math.min(item.quantity, currentQty);
      incUpdates[`${base}.revenue`] =
        (incUpdates[`${base}.revenue`] ?? 0) - Math.min(itemRevenue(item), currentRevenue);
    }

    const safeTotalSales = Math.min(order.total, daily.totalSales ?? 0);
    const safeCompleted = Math.min(1, daily.completedOrders ?? 0);

    const totals: Record<string, number> = {
      completedOrders: -safeCompleted,
      totalSales: -safeTotalSales,
      ...incUpdates,
    };
    if (order.paymentMethod === 'cash') {
      totals.totalCash = -Math.min(order.total, daily.totalCash ?? 0);
    } else if (order.paymentMethod === 'transfer') {
      totals.totalTransfer = -Math.min(order.total, daily.totalTransfer ?? 0);
    }

    await OrderDailyStats.findOneAndUpdate(
      { date },
      {
        $inc: totals,
      }
    );
  },

  getStats: async (params: GetStatsParams): Promise<GetStatsResult> => {
    let startKey: string;
    let endKey: string;

    if (params.range) {
      const { start, end } = getRangeStartDate(params.range);
      startKey = dateKey(start);
      endKey = dateKey(end);
    } else {
      startKey = params.from!;
      endKey = params.to!;
    }

    const dailies = await OrderDailyStats.find({
      date: { $gte: startKey, $lte: endKey },
    }).lean();

    let ordersCount = 0;
    let completedOrders = 0;
    let totalSales = 0;
    let totalCash = 0;
    let totalTransfer = 0;
    const productMap: Record<string, IProductDailyStat> = {};

    for (const day of dailies) {
      ordersCount += day.ordersCount ?? 0;
      completedOrders += day.completedOrders ?? 0;
      totalSales += day.totalSales ?? 0;
      totalCash += day.totalCash ?? 0;
      totalTransfer += day.totalTransfer ?? 0;

      const products = day.products;
      if (!products) continue;

      const entries = products instanceof Map ? [...products.entries()] : Object.entries(products);

      for (const [key, data] of entries) {
        const entry = data as IProductDailyStat;
        if (!productMap[key]) {
          productMap[key] = { title: entry.title || 'Sin nombre', qty: 0, revenue: 0 };
        }
        productMap[key].qty += entry.qty ?? 0;
        productMap[key].revenue += entry.revenue ?? 0;
      }
    }

    const products = Object.values(productMap).sort((a, b) => b.revenue - a.revenue);
    const topProduct = products.length ? [...products].sort((a, b) => b.qty - a.qty)[0] : null;
    const avgTicket = completedOrders > 0 ? Math.round((totalSales / completedOrders) * 100) / 100 : 0;

    return { ordersCount, completedOrders, totalSales, totalCash, totalTransfer, avgTicket, products, topProduct };
  },
};
