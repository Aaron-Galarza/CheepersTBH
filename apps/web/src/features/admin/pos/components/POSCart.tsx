'use client';

import { usePOSCart } from '../hooks/usePOSCart';
import { formatCurrency } from '@/utils/format';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

interface POSCartProps {
  onCheckout: () => void;
}

export function POSCart({ onCheckout }: POSCartProps) {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = usePOSCart();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <h2 className="font-bold text-lg mb-3 font-[var(--font-montserrat)] text-[#212121] flex items-center gap-2">
        <ShoppingCart size={20} /> Carrito
      </h2>

      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {items.length === 0 ? (
          <p className="text-center text-[#757575] py-4 text-sm">Carrito vacio</p>
        ) : (
          items.map((item: any) => (
            <div key={item.cartItemId || item.id} className="bg-gray-50 p-2 rounded-lg flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{item.title || item.name}</p>
                <p className="text-xs text-[#757575]">{item.quantity} x {formatCurrency(item.price)}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => updateQuantity(item.cartItemId || item.id, (item.quantity || 1) - 1)}
                  className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-xs hover:bg-gray-300"><Minus size={12} /></button>
                <button onClick={() => updateQuantity(item.cartItemId || item.id, (item.quantity || 1) + 1)}
                  className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded text-xs hover:bg-gray-300"><Plus size={12} /></button>
                <button onClick={() => removeItem(item.cartItemId || item.id)}
                  className="w-6 h-6 flex items-center justify-center bg-[#D9383A] text-white rounded text-xs hover:bg-[#b52d2f]"><Trash2 size={12} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t pt-2 mb-3">
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span className="text-[#D9383A]">{formatCurrency(subtotal)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={clearCart} disabled={items.length === 0}
          className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 disabled:bg-gray-300 text-sm font-semibold">
          Limpiar
        </button>
        <button onClick={onCheckout} disabled={items.length === 0}
          className="flex-1 px-4 py-2 bg-[#D9383A] text-white rounded-lg hover:bg-[#b52d2f] disabled:bg-gray-300 text-sm font-bold">
          Checkout
        </button>
      </div>
    </div>
  );
}
