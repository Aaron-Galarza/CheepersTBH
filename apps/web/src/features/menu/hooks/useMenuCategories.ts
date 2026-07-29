import { useState, useEffect } from 'react';
import { productsService } from '@/services/products.service';
import { Product } from '@/types';
import { CATEGORIES } from '@/features/admin/utils/adminHelpers';

export function useMenuCategories() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsService
      .getAll()
      .then((data) => setProducts(data.filter((p: Product) => p.isActive)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = CATEGORIES.filter((cat) =>
    products.some((p) => p.category === cat)
  );

  const getByCategory = (category: string) =>
    products.filter((p) => p.category === category);

  return { products, categories, getByCategory, loading };
}
