'use client';

import { useState, useEffect } from 'react';
import { menuService } from '@/services/menu.service';
import { Product, Category } from '@/types';
import { POSProductCard } from './POSProductCard';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryFilter } from '@/features/menu/components/CategoryFilter';

interface POSProductGridProps {
  onProductSelect: (product: Product) => void;
}

export function POSProductGrid({ onProductSelect }: POSProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([menuService.getProducts(), menuService.getCategories()])
      .then(([p, c]) => { setProducts(p); setCategories(c); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const catName = typeof p.category === 'object' ? (p.category as any).name : p.category;
    const matchesCat = !selectedCategory || catName === selectedCategory;
    const matchesSearch = !searchQuery || (p.title || p.name).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (loading) return <p className="text-center py-8 text-[#757575]">Cargando productos...</p>;

  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col overflow-hidden h-full">
      <div className="flex-shrink-0 border-b border-gray-100">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Buscar producto..." />
        <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-2.5 p-2 overflow-y-auto flex-1 content-start">
        {filtered.map((p) => <POSProductCard key={p._id} product={p} onSelect={() => onProductSelect(p)} />)}
        {filtered.length === 0 && <p className="text-center text-[#757575] py-8 col-span-full">No hay productos</p>}
      </div>
    </div>
  );
}
