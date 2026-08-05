'use client';

import { useState, useEffect, useCallback } from 'react';
import { ordersService } from '@/services/orders.service';
import { socketService } from '@/services/socket.service';
import { Order } from '@/types';

export function usePedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    ordersService.getOrders(status || undefined)
      .then((data) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => {
    socketService.initialize();
    fetchOrders();

    const u1 = socketService.onOrderUpdated((d) => {
      setOrders((prev) => {
        if (d.orderId === updatingId) return prev;
        const updated = prev.map((o) => o._id === d.orderId ? { ...o, status: d.status } : o);
        if (status) return updated.filter((o) => o.status === status);
        return updated;
      });
    });
    const u2 = socketService.onOrderDeleted((d) => {
      setOrders((prev) => prev.filter((o) => o._id !== d.orderId));
    });
    const u3 = socketService.onOrderCreated((order) => {
      setOrders((prev) => [order, ...prev]);
    });
    return () => { u1(); u2(); u3(); };
  }, [status, fetchOrders]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await ordersService.updateOrderStatus(id, newStatus);
      setOrders((prev) => {
        const updated = prev.map((o) => o._id === id ? { ...o, status: newStatus as Order['status'] } : o);
        if (status) return updated.filter((o) => o.status === status);
        return updated;
      });
    } catch {
      setError('Error al actualizar estado');
    } finally {
      setUpdatingId(null);
    }
  };

  return { orders, loading, status, setStatus, updatingId, error, updateStatus };
}
