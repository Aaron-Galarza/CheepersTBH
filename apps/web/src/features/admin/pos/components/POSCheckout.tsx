'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { usePOSCart } from '../hooks/usePOSCart';
import { useCartStore } from '@/stores/cart.store';
import { ordersService } from '@/services/orders.service';
import { formatCurrency } from '@/utils/format';
import { CustomerForm } from '@/features/checkout/components/CustomerForm';
import { DeliveryForm } from '@/features/checkout/components/DeliveryForm';
import { PaymentForm } from '@/features/checkout/components/PaymentForm';

interface POSCheckoutProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function POSCheckout({ onClose, onSuccess }: POSCheckoutProps) {
  const { items, subtotal, clearCart } = usePOSCart();
  const deliveryType = useCartStore((s) => s.deliveryType);
  const paymentMethod = useCartStore((s) => s.paymentMethod);
  const deliveryAddress = useCartStore((s) => s.deliveryAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (data: { name: string; phone: string }) => {
    if (!deliveryType) { setError('Selecciona tipo de entrega'); return; }
    if (!paymentMethod) { setError('Selecciona metodo de pago'); return; }
    try {
      setLoading(true);
      setError(null);
      await ordersService.createOrder({
        customer: { name: data.name, phone: data.phone || '00' },
        items: (items as any[]).map((item: any) => ({
          title: item.title || item.name,
          price: item.price,
          quantity: item.quantity || 1,
          additionals: (item.addOns || []).map((a: any) => ({
            name: a.name, addonId: a._id, price: a.price, quantity: a.quantity || 1,
          })),
        })),
        deliveryType,
        paymentMethod,
        deliveryAddress: deliveryAddress || null,
      });
      clearCart();
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (err: any) { setError(err.response?.data?.error || err.message || 'Error al crear pedido'); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-[60px] md:pt-0 md:items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#757575] hover:text-[#212121]"><X size={20} /></button>
        <h2 className="text-lg font-extrabold font-[var(--font-montserrat)] text-[#212121] mb-4">Checkout - {formatCurrency(subtotal)}</h2>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <DeliveryForm disabled={loading} />
          <PaymentForm disabled={loading} />
          <CustomerForm onSubmit={createOrder} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}
