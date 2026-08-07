'use client';

import { Product } from '@/types';
import { formatCurrency } from '@/utils/format';
import { ShoppingCart } from 'lucide-react';

interface POSProductCardProps {
  product: Product;
  onSelect: () => void;
}

export function POSProductCard({ product, onSelect }: POSProductCardProps) {
  const title = product.title || product.name;
  const img = product.image || product.imageUrl;

  return (
    <button onClick={onSelect} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md active:scale-95 transition flex flex-col">
      <div className="relative h-44 md:h-48 bg-[#f5f5f5]">
        {img ? (
          <img src={img} alt={title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#757575]"><ShoppingCart size={36} /></div>
        )}
      </div>
      <div className="p-2">
        <h3 className="font-bold text-xs text-[#212121] line-clamp-2 leading-tight">{title}</h3>
        <p className="text-sm font-extrabold text-[#D9383A] mt-0.5">{formatCurrency(product.price)}</p>
      </div>
    </button>
  );
}
