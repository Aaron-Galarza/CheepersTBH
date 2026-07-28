import { formatCurrency } from '@/utils/format';
import { CartItem } from '@/types';
import { cn } from '@/utils/cn';

interface CartSummaryProps {
  items: CartItem[];
  className?: string;
}

export function CartSummary({ items, className = '' }: CartSummaryProps) {
  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-[#718096]">
        Tu carrito está vacío
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="border-b border-dashed border-[#e2e8f0] pb-3 last:border-0"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e53e3e] text-xs font-bold text-white">
                {item.quantity}
              </span>
              <span className="text-sm font-medium text-[#4a5568]">{item.product.name}</span>
            </div>
            <span className="text-sm font-semibold text-[#e53e3e]">
              {formatCurrency(item.product.price * item.quantity)}
            </span>
          </div>

          {item.addons.length > 0 && (
            <div className="ml-9 mt-1 space-y-0.5">
              {item.addons.map((addon) => (
                <div key={addon._id} className="flex justify-between text-xs text-[#718096]">
                  <span>+ {addon.name} x{addon.quantity}</span>
                  <span>{formatCurrency(addon.price * addon.quantity)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
