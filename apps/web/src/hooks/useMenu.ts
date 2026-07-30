import { useState, useEffect } from 'react';
import { productsService } from '@/services/products.service';
import { Product, Category } from '@/types';

function getCategoryName(cat: unknown): string {
  if (typeof cat === 'string') return cat;
  if (cat && typeof cat === 'object' && 'name' in cat) return (cat as { name: string }).name;
  return '';
}

export function useMenu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await productsService.getAll();
        setProducts(data);

        const catNames = data.map((p) => getCategoryName(p.category));
        const unique = [...new Set(catNames)].filter(Boolean);
        const cats: Category[] = unique.map((name) => ({ name, isActive: true }));
        setCategories(cats);
        setError(null);
      } catch (err) {
        setError('No pudimos cargar el menú. Intenta más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const filteredProducts = products.filter((product) => {
    const categoryName = getCategoryName(product.category);
    const matchesCategory = !selectedCategory || categoryName === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      (product.title || product.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);

    return matchesCategory && matchesSearch;
  });

  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleSetSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSelectedCategory(null);
    }
  };

  return {
    products: filteredProducts,
    allProducts: products,
    categories,
    loading,
    error,
    selectedCategory,
    searchQuery,
    selectCategory: handleSelectCategory,
    setSearch: handleSetSearch,
  };
}
