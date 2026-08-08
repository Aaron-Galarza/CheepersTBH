'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Product, Addon, SelectedAddOn } from '@/types';
import { menuService } from '@/services/menu.service';
import { formatCurrency } from '@/utils/format';

interface POSQuickAddonProps {
  product: Product;
  onAdd: (product: Product, addons: SelectedAddOn[]) => void;
  onClose: () => void;
}

export function POSQuickAddon({ product, onAdd, onClose }: POSQuickAddonProps) {
  const [additionals, setAdditionals] = useState<Addon[]>([]);
  const [selected, setSelected] = useState<Record<string, number>>({});

  useEffect(() => {
    menuService.getAdditionals()
      .then((all) => {
        const catId = typeof product.category === 'object' && product.category !== null
          ? (product.category as any)._id || (product.category as any).name
          : product.category;
        const filtered = all.filter((a) => {
          const cats = (a as any).categories ?? a.associatedProductCategories;
          if (!cats || cats.length === 0) return true;
          return catId ? cats.some((c: string) => String(c) === String(catId)) : true;
        });
        setAdditionals(filtered);
      })
      .catch(() => {});
  }, [product]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const current = prev[id] || 0;
      if (current > 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: 1 };
    });
  };

  const addonsTotal = Object.entries(selected).reduce((sum, [id]) => {
    const a = additionals.find((x) => x._id === id);
    return sum + (a?.price || 0);
  }, 0);

  const handleAdd = () => {
    const addons: SelectedAddOn[] = Object.entries(selected).map(([id]) => {
      const a = additionals.find((x) => x._id === id)!;
      return { _id: a._id, name: a.name || (a as any).title || '', price: a.price, quantity: 1 };
    });
    onAdd(product, addons);
  };

  return (
    <div className="bg-white border-2 border-[#D9383A] rounded-xl p-4 animate-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm text-[#212121]">{(product.title || product.name).toUpperCase()}</h3>
        <button onClick={onClose} className="text-[#757575] hover:text-[#212121]"><X size={18} /></button>
      </div>

      {additionals.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-[#757575] text-sm mb-3">Sin adicionales disponibles</p>
          <button onClick={handleAdd} className="w-full py-3 bg-[#D9383A] text-white rounded-xl font-bold hover:bg-[#b52d2f] transition text-lg flex items-center justify-center gap-2">
            <Check size={22} /> Agregar - {formatCurrency(product.price)}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 mb-3 max-h-[200px] overflow-y-auto">
            {additionals.map((a) => {
              const sel = selected[a._id];
              return (
                <button key={a._id} onClick={() => toggle(a._id)}
                  className={`p-3 rounded-xl border-2 text-left transition ${
                    sel ? 'border-[#D9383A] bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                  <p className="font-bold text-sm text-[#212121]">{a.name || (a as any).title}</p>
                  <p className="text-xs text-[#D9383A] font-bold mt-0.5">+{formatCurrency(a.price)}</p>
                </button>
              );
            })}
          </div>
          <button onClick={handleAdd}
            className="w-full py-3 bg-[#D9383A] text-white rounded-xl font-bold hover:bg-[#b52d2f] transition text-lg flex items-center justify-center gap-2">
            <Check size={22} /> Agregar
            <span className="text-base font-normal text-white/80">
              {formatCurrency(product.price + addonsTotal)}
            </span>
          </button>
        </>
      )}
    </div>
  );
}
