'use client';

import { useState, useMemo } from 'react';
import { Package } from 'lucide-react';
import { usePedidos } from '@/features/admin/pedidos/hooks/usePedidos';
import { OrderCard } from '@/features/admin/pedidos/components/OrderCard';

const STATUSES = ['', 'pending', 'preparing', 'ready', 'delivered', 'cancelled'];
const LABELS: Record<string, string> = {
  '': 'Todos', pending: 'Pendientes', preparing: 'En preparacion', ready: 'Listos', delivered: 'Entregados', cancelled: 'Cancelados',
};

export default function PedidosPage() {
  const { orders, loading, status, setStatus, updatingId, updateStatus } = usePedidos();
  const [dateFilter, setDateFilter] = useState('');

  const filtered = useMemo(() => {
    if (!dateFilter) return orders;
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return orders.filter((o) => {
      if (!o.createdAt) return false;
      const d = new Date(o.createdAt);
      if (dateFilter === 'today') return d.toDateString() === now.toDateString();
      if (dateFilter === 'yesterday') return d.toDateString() === yesterday.toDateString();
      if (dateFilter === 'week') return d >= weekAgo;
      return true;
    });
  }, [orders, dateFilter]);

  return (
    <div className="cart-bg min-h-screen p-4">
      <h1 className="text-xl sm:text-2xl font-extrabold font-[var(--font-montserrat)] text-[#212121] mb-4 flex items-center gap-2">
        <Package size={24} /> Pedidos
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button key={s || 'all'} onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                status === s ? 'bg-[#D9383A] text-white' : 'bg-white border border-gray-300 text-[#757575] hover:bg-gray-50'}`}>
              {LABELS[s]}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {['today', 'yesterday', 'week'].map((d) => (
            <button key={d} onClick={() => setDateFilter(dateFilter === d ? '' : d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                dateFilter === d ? 'bg-[#D9383A] text-white' : 'bg-white border border-gray-300 text-[#757575] hover:bg-gray-50'}`}>
              {d === 'today' ? 'Hoy' : d === 'yesterday' ? 'Ayer' : 'Semana'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-[#757575]">Cargando...</p>
      ) : filtered.length === 0 ? (
        <p className="text-[#757575]">No hay pedidos</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((o) => <OrderCard key={o._id} order={o} onStatusChange={updateStatus} isUpdating={updatingId === o._id} />)}
        </div>
      )}
    </div>
  );
}
