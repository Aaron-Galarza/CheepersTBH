'use client';

import { useEffect, useRef, useState } from 'react';
import { BellRing, X } from 'lucide-react';
import { socketService } from '@/services/socket.service';
import { Order } from '@/types';

const SOUND_URL = '/sonido.mp3';

export function OrderNotification() {
  const [order, setOrder] = useState<Order | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastIdRef = useRef<string | null>(null);

  useEffect(() => {
    const playSound = () => {
      try {
        const audio = new Audio(SOUND_URL);
        audio.volume = 0.6;
        void audio.play().catch(() => {});
      } catch {
        // autoplay bloqueado, se ignora
      }
    };

    const unsubscribe = socketService.onOrderCreated((newOrder: Order) => {
      const id = newOrder._id ?? '';
      if (id && lastIdRef.current === id) return;
      lastIdRef.current = id;

      playSound();
      setOrder(newOrder);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setOrder(null), 5000);
    });

    return () => {
      unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!order) return null;

  const totalItems = order.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg animate-[toastIn_0.35s_ease-out]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-[#D9383A]">
          <BellRing size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#212121]">Nuevo pedido</p>
          <p className="truncate text-xs text-[#757575]">{order.customer.name}</p>
          <p className="text-xs text-[#757575]">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} · {order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
          </p>
          <p className="mt-1 text-sm font-bold text-[#D9383A]">
            ${Number(order.total).toLocaleString('es-AR')}
          </p>
        </div>
        <button
          onClick={() => setOrder(null)}
          className="rounded-full p-1 text-[#757575] transition-colors hover:bg-gray-100 hover:text-[#212121]"
          aria-label="Cerrar notificación"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
