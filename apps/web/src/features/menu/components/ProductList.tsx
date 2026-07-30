'use client';

import { Product } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onProductClick: (product: Product) => void;
  addedId?: string | null;
}

export function ProductList({
  products,
  loading,
  error,
  onProductClick,
  addedId,
}: ProductListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {Array(8)
          .fill(null)
          .map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center p-8 text-center">
        <p className="mb-4 text-lg font-semibold text-[#D9383A]">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-[#D9383A] px-6 py-2 text-white transition hover:bg-[#b52d2f]"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-96 items-center justify-center p-8 text-center">
        <p className="text-lg text-[#757575]">No encontramos productos en esta categoría</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={String(product._id)}
          product={product}
          onAddClick={() => onProductClick(product)}
          isAdded={addedId === product._id}
        />
      ))}
    </div>
  );
}
