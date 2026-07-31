'use client';

import { useCartStore } from '@/stores/cart.store';
import { formatCurrency } from '@/utils/format';

interface CartSummaryProps {
  detailed?: boolean;
}

export function CartSummary({ detailed = true }: CartSummaryProps) {
  const subtotal = useCartStore((s) => s.getSubtotal());
  const discount = useCartStore((s) => s.getDiscount());
  const total = useCartStore((s) => s.getTotal());
  const deliveryCost = useCartStore((s) => s.deliveryCost);
  const itemCount = useCartStore((s) => s.getItemCount());
  const coupon = useCartStore((s) => s.coupon);

  return (
    <div className="space-y-2 font-[var(--font-open-sans)]">
      {detailed && (
        <>
          <div className="flex justify-between text-[#757575] text-sm">
            <span>Subtotal ({itemCount} items):</span>
            <span className="font-semibold">{formatCurrency(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600 text-sm font-semibold">
              <span>Descuento{coupon ? ` (${coupon.code})` : ''}:</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}

          {deliveryCost > 0 && (
            <div className="flex justify-between text-[#757575] text-sm">
              <span>Envio:</span>
              <span className="font-semibold">{formatCurrency(deliveryCost)}</span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-2" />
        </>
      )}

      <div className="flex justify-between text-lg font-bold text-[#D9383A]">
        <span>Total:</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
