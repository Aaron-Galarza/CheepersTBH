'use client';

import { cn } from '@/utils/cn';
import { ProductCard } from '@/components/ui/ProductCard';
import { Product } from '@/types';
import { useCartStore } from '@/stores/cart.store';

interface MenuSectionProps {
  category: string;
  products: Product[];
  className?: string;
}

export function MenuSection({ category, products, className = '' }: MenuSectionProps) {
  const addToCart = useCartStore((s) => s.addToCart);

  const handleAddToCart = (product: Product) => {
    addToCart(product, []);
  };

  if (products.length === 0) return null;

  return (
    <section
      id={category.toLowerCase().replace(/\s+/g, '-')}
      className={cn('mb-12', className)}
    >
      <h2 className="mb-8 text-center font-['Montserrat'] text-3xl font-bold text-[#2d3748] max-md:text-2xl">
        {category}
      </h2>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 max-md:grid-cols-1 max-md:gap-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddClick={() => handleAddToCart(product)}
          />
        ))}
      </div>
    </section>
  );
}
