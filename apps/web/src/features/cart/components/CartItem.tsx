'use client';

import { CartItem as CartItemType, Addon, Category, SelectedAddOn } from '@/types';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

interface CartItemProps {
  item: CartItemType;
  allAdditionals: Addon[];
  allCategories: Category[];
  onIncrement: (addOns: SelectedAddOn[]) => void;
  onDecrement: (cartItemId: string) => void;
  onUpdateAddOns: (cartItemId: string, newAddOns: SelectedAddOn[]) => void;
  onRemove: (cartItemId: string) => void;
}

function getProductCategoryId(pc: unknown, cats: Category[]): string | null {
  if (typeof pc === 'object' && pc !== null && '_id' in pc) return (pc as { _id: string })._id;
  const name = String(pc);
  const found = cats.find((c) => c.name === name);
  return found?._id ?? null;
}

export function CartItem({
  item, allAdditionals, allCategories,
  onIncrement, onDecrement, onUpdateAddOns, onRemove,
}: CartItemProps) {
  const title = item.title || item.name;
  const img = item.image || item.imageUrl;
  const addOns = (item as any).addOns ?? (item as any).addons ?? [];
  const subtotal = (item.price + addOns.reduce((s: number, a: any) => s + a.price * (a.quantity || 1), 0)) * item.quantity;
  const catId = getProductCategoryId(item.category, allCategories);

  const available = allAdditionals.filter((a) => {
    const cats = (a as any).categories ?? a.associatedProductCategories;
    if (!cats || cats.length === 0) return true;
    return catId ? cats.includes(catId) : true;
  });

  const isSelected = (id: string) => addOns.some((a: any) => a._id === id);

  const handleToggleAddon = (addon: Addon) => {
    const addonId = addon._id;
    if (addOns.some((a: any) => a._id === addonId)) {
      const newAddOns = addOns.filter((a: any) => a._id !== addonId);
      onUpdateAddOns(item.cartItemId, newAddOns);
    } else {
      const addonName = addon.name || (addon as any).title || '';
      const newAddOns = [
        ...addOns,
        { _id: addonId, name: addonName, price: addon.price, quantity: 1 },
      ];
      onUpdateAddOns(item.cartItemId, newAddOns);
    }
  };

  return (
    <div className="rounded-xl border border-[#e0e0e0] bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        {img && (
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-[#f5f5f5]">
            <img src={img} alt={title} className="h-full w-full object-cover" loading="lazy" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-extrabold uppercase tracking-wide text-[#212121] font-[var(--font-montserrat)]">{title}</h3>

          <div className="mt-1 flex items-center gap-3">
            <span className="text-sm text-[#757575] font-[var(--font-open-sans)]">Cantidad:</span>
            <div className="flex items-center gap-1">
              <button onClick={() => onDecrement(item.cartItemId)} className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e0e0e0] text-sm font-bold text-[#757575] transition hover:border-[#D9383A] hover:text-[#D9383A]">-</button>
              <span className="w-6 text-center text-sm font-bold text-[#212121]">{item.quantity}</span>
              <button onClick={() => onIncrement(item.addOns)} className="flex h-7 w-7 items-center justify-center rounded-full border border-[#e0e0e0] text-sm font-bold text-[#757575] transition hover:border-[#D9383A] hover:text-[#D9383A]">+</button>
            </div>
          </div>

          {available.length > 0 && (
            <div className="mt-3">
              <p className="mb-2 text-sm text-[#757575] font-[var(--font-open-sans)]">Adicionales disponibles:</p>
              <div className="flex flex-wrap gap-2">
                {available.map((addon) => {
                  const sel = isSelected(addon._id);
                  return (
                    <button key={addon._id} onClick={() => handleToggleAddon(addon)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${sel ? 'border-[#D9383A] bg-[#D9383A] text-white' : 'border-[#e0e0e0] bg-white text-[#757575] hover:border-[#D9383A] hover:text-[#D9383A]'}`}>
                      {addon.name || (addon as any).title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <p className="text-base font-bold text-[#212121] font-[var(--font-open-sans)]">Subtotal: {formatCurrency(subtotal)}</p>
            <button onClick={() => onRemove(item.cartItemId)} className="flex items-center gap-1 rounded-full border border-[#D9383A] px-4 py-1.5 text-sm font-semibold text-[#D9383A] transition hover:bg-[#D9383A] hover:text-white">
              <Trash2 size={14} /> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
