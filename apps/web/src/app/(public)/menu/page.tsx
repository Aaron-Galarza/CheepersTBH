'use client';

import { useState, useMemo, useCallback } from 'react';
import { Product } from '@/types';
import { useMenu } from '@/hooks/useMenu';
import { useCartStore } from '@/stores/cart.store';
import { CategoryFilter } from '@/features/menu/components/CategoryFilter';
import { SearchBar } from '@/components/common/SearchBar';
import { ProductCardSkeleton } from '@/features/menu/components/ProductCardSkeleton';
import { FeaturedBanner } from '@/features/menu/components/FeaturedBanner';
import { MenuSection } from '@/components/blocks/menu-section';

function getCategoryName(cat: unknown): string {
  if (typeof cat === 'string') return cat;
  if (cat && typeof cat === 'object' && 'name' in cat) return (cat as { name: string }).name;
  return '';
}

export default function MenuPage() {
  const { products, categories, loading, error, selectedCategory, searchQuery, selectCategory, setSearch } = useMenu();
  const addToCart = useCartStore((s) => s.addToCart);
  const [addedId, setAddedId] = useState<string | null>(null);

  const onClick = useCallback((p: Product) => { addToCart(p, []); setAddedId(p._id); setTimeout(() => setAddedId(null), 800); }, [addToCart]);

  const grouped = useMemo(() => {
    if (selectedCategory) return null;
    const g = new Map<string, Product[]>();
    for (const p of products) { const n = getCategoryName(p.category); if (!g.has(n)) g.set(n, []); g.get(n)!.push(p); }
    return [...g.entries()].sort(([a], [b]) => {
      const catA = categories.find((c) => c.name === a);
      const catB = categories.find((c) => c.name === b);
      return (catA?.order ?? 99) - (catB?.order ?? 99);
    });
  }, [products, selectedCategory, categories]);

  return (
    <div className="relative min-h-screen font-[var(--font-open-sans)]" style={{ backgroundImage: "url('https://res.cloudinary.com/dwqxdensk/image/upload/q_auto,f_auto,w_1600/v1785372509/fondo_r3yhjq.webp')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0 bg-white/70" />
      <div className="relative z-10">
      <div className="sticky top-[70px] z-30 md:top-[100px]">
        <SearchBar value={searchQuery} onChange={setSearch} />
        <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelectCategory={selectCategory} />
      </div>

      {!selectedCategory && !loading && <FeaturedBanner products={products} onProductClick={onClick} />}

      {loading ? (
        <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-3 md:gap-4 md:p-4 lg:grid-cols-4">
          {Array(8).fill(null).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="flex min-h-96 flex-col items-center justify-center p-8 text-center">
          <p className="mb-4 text-lg font-semibold text-[#2d3748]">{error}</p>
          <button onClick={() => window.location.reload()} className="rounded-full bg-[#D9383A] px-6 py-2 text-white transition hover:bg-[#b52d2f]">Reintentar</button>
        </div>
      ) : products.length === 0 ? (
        <div className="flex min-h-96 items-center justify-center p-8 text-center">
          <p className="text-lg text-[#757575]">No encontramos productos{selectedCategory ? ' en esta categoría' : ''}</p>
        </div>
      ) : grouped ? (
        <div className="pt-2 md:pt-4">
          {grouped.map(([catName, catProducts]) => (
            <MenuSection key={catName} category={catName} products={catProducts} addedId={addedId} />
          ))}
        </div>
      ) : (
        <div className="pt-2 md:pt-4">
          <MenuSection category={selectedCategory ?? ''} products={products} addedId={addedId} />
        </div>
      )}
      </div>
    </div>
  );
}
