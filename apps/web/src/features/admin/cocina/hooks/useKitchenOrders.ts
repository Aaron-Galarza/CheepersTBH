'use client';

import { useState, useEffect } from 'react';
import { ordersService } from '@/services/orders.service';
import { socketService } from '@/services/socket.service';
import { Order } from '@/types';

export function useKitchenOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    socketService.initialize();
    socketService.joinKitchen();

    ordersService.getOrders().then((data) => {
      const active = data.filter((o: Order) => !['delivered', 'cancelled'].includes(o.status));
      setOrders(active);
    }).catch(() => setError('Error al cargar ordenes')).finally(() => setLoading(false));

    const unsub1 = socketService.onOrderUpdated((data) => {
      if (data.orderId === updatingId) return;
      setOrders((prev) => prev.map((o) => o._id === data.orderId ? { ...o, status: data.status } : o));
    });
    const unsub2 = socketService.onOrderDeleted((data) => {
      setOrders((prev) => prev.filter((o) => o._id !== data.orderId));
    });
    const unsub3 = socketService.onOrderCreated((order) => {
      setOrders((prev) => [order, ...prev]);
    });

    return () => { unsub1(); unsub2(); unsub3(); socketService.leaveKitchen(); };
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      await ordersService.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: status as Order['status'] } : o));
    } catch { setError('Error al actualizar'); }
    finally { setUpdatingId(null); }
  };

  return { orders, loading, error, updateStatus };
}
