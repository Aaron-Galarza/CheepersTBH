'use client';

import { ChefHat } from 'lucide-react';
import { useKitchenOrders } from '@/features/admin/cocina/hooks/useKitchenOrders';
import { OrderList } from '@/features/admin/cocina/components/OrderList';

export default function CocinaPage() {
  const { orders, loading, error, updateStatus } = useKitchenOrders();

  if (loading) {
    return <div className="cart-bg min-h-screen flex items-center justify-center"><p className="text-[#757575]">Cargando ordenes...</p></div>;
  }

  return (
    <div className="cart-bg min-h-screen flex flex-col">
      {error && <p className="text-red-600 text-sm p-2 bg-red-50">{error}</p>}

      {orders.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ChefHat size={48} className="mx-auto mb-3 text-[#757575]" />
            <p className="text-lg text-[#757575]">No hay ordenes en este momento</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <OrderList orders={orders} onStatusChange={updateStatus} />
        </div>
      )}
    </div>
  );
}
