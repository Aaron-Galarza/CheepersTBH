'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/types';
import { useMenu } from '@/hooks/useMenu';
import { useCartStore } from '@/stores/cart.store';
import { CategoryFilter } from '@/features/menu/components/CategoryFilter';
import { SearchBar } from '@/components/common/SearchBar';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductCardSkeleton } from '@/features/menu/components/ProductCardSkeleton';
import { FeaturedBanner } from '@/features/menu/components/FeaturedBanner';

function getCategoryName(cat: unknown): string {
  if (typeof cat === 'string') return cat;
  if (cat && typeof cat === 'object' && 'name' in cat) return (cat as { name: string }).name;
  return '';
}

function gridClass(count: number) {
  if (count === 1) return 'grid-cols-1 justify-items-center';
  if (count === 2) return 'grid-cols-2';
  if (count === 3) return 'grid-cols-2 md:grid-cols-3';
  return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
}

export default function MenuPage() {
  const { products, categories, loading, error, selectedCategory, searchQuery, selectCategory, setSearch } = useMenu();
  const addToCart = useCartStore((s) => s.addToCart);
  const [addedId, setAddedId] = useState<string | null>(null);

  const onClick = (p: Product) => { addToCart(p, []); setAddedId(p._id); setTimeout(() => setAddedId(null), 800); };

  const grouped = useMemo(() => {
    if (selectedCategory) return null;
    const g = new Map<string, Product[]>();
    for (const p of products) { const n = getCategoryName(p.category); if (!g.has(n)) g.set(n, []); g.get(n)!.push(p); }
    return [...g.entries()];
  }, [products, selectedCategory]);

  const renderGrid = (items: Product[]) => {
    const cols = gridClass(items.length);
    const isSingle = items.length === 1;
    return (
      <div className={`mx-auto grid w-full max-w-[1280px] ${cols} gap-2 md:gap-4 p-2 md:p-4`}>
        {items.map((p) => (
          <div key={String(p._id)} className={isSingle ? 'w-full max-w-sm sm:max-w-md' : ''}>
            <ProductCard product={p} onAddClick={() => onClick(p)} isAdded={addedId === p._id} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="cart-bg min-h-screen font-[var(--font-open-sans)]">
      <div className="sticky top-[70px] z-30 md:top-[100px]">
        <SearchBar value={searchQuery} onChange={setSearch} />
        <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelectCategory={selectCategory} />
      </div>

      {!selectedCategory && !loading && <FeaturedBanner products={products} onProductClick={onClick} />}

      {loading ? (
        <div className="grid grid-cols-2 gap-2 p-2 md:grid-cols-3 md:gap-4 md:p-4 lg:grid-cols-4">
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
        <div className="space-y-10 p-4 md:space-y-12 md:p-6">
          {grouped.map(([catName, catProducts]) => (
            <div key={catName}>
              <h2 className="mb-6 text-center font-[var(--font-montserrat)] text-2xl font-black uppercase tracking-[0.15em] text-[#2d3748] md:mb-8 md:text-3xl">
                {catName}
              </h2>
              {renderGrid(catProducts)}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h2 className="px-4 pt-6 pb-4 text-center font-[var(--font-montserrat)] text-2xl font-black uppercase tracking-[0.15em] text-[#2d3748] md:px-6 md:text-3xl">
            {selectedCategory}
          </h2>
          {renderGrid(products)}
        </div>
      )}
    </div>
  );
}
