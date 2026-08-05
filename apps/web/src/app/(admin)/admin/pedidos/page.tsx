'use client';

import { Package } from 'lucide-react';
import { usePedidos } from '@/features/admin/pedidos/hooks/usePedidos';
import { OrderCard } from '@/features/admin/pedidos/components/OrderCard';

const STATUSES = ['', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
const LABELS: Record<string, string> = {
  '': 'Todos', pending: 'Pendientes', confirmed: 'Confirmados', preparing: 'En preparacion', ready: 'Listos', delivered: 'Entregados', cancelled: 'Cancelados',
};

export default function PedidosPage() {
  const { orders, loading, status, setStatus, updatingId, updateStatus } = usePedidos();

  return (
    <div className="cart-bg min-h-screen p-4">
      <h1 className="text-xl sm:text-2xl font-extrabold font-[var(--font-montserrat)] text-[#212121] mb-4 flex items-center gap-2">
        <Package size={24} /> Pedidos
      </h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {STATUSES.map((s) => (
          <button key={s || 'all'} onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
              status === s ? 'bg-[#D9383A] text-white' : 'bg-white border border-gray-300 text-[#757575] hover:bg-gray-50'}`}>
            {LABELS[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[#757575]">Cargando...</p>
      ) : orders.length === 0 ? (
        <p className="text-[#757575]">No hay pedidos</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((o) => <OrderCard key={o._id} order={o} onStatusChange={updateStatus} isUpdating={updatingId === o._id} />)}
        </div>
      )}
    </div>
  );
}
