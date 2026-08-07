'use client';

import { useState } from 'react';
import { Product, SelectedAddOn } from '@/types';
import { POSProductGrid } from '@/features/admin/pos/components/POSProductGrid';
import { POSCart } from '@/features/admin/pos/components/POSCart';
import { POSCheckout } from '@/features/admin/pos/components/POSCheckout';
import { POSQuickAddon } from '@/features/admin/pos/components/POSQuickAddon';
import { usePOSStore } from '@/stores/pos.store';
import { ShoppingCart } from 'lucide-react';

export default function POSPage() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const addItem = usePOSStore((s) => s.addItem);

  const handleProductClick = (p: Product) => {
    setSelectedProduct(p);
  };

  const handleAdd = (p: Product, addons: SelectedAddOn[]) => {
    addItem(p, 1, addons as any);
    setSelectedProduct(null);
  };

  return (
    <div className="cart-bg h-[calc(100vh-60px)] flex flex-col p-4">
      <h1 className="text-xl sm:text-2xl font-extrabold font-[var(--font-montserrat)] text-[#212121] mb-4 flex items-center gap-2 flex-shrink-0">
        <ShoppingCart size={22} /> POS
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
        <div className="lg:col-span-3 flex flex-col min-h-0">
          {selectedProduct && (
            <div className="flex-shrink-0 mb-3">
              <POSQuickAddon
                product={selectedProduct}
                onAdd={handleAdd}
                onClose={() => setSelectedProduct(null)}
              />
            </div>
          )}
          <div className="flex-1 min-h-0">
            <POSProductGrid onProductSelect={handleProductClick} />
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-4">
            <POSCart onCheckout={() => setShowCheckout(true)} />
          </div>
        </div>
      </div>
      {showCheckout && <POSCheckout onClose={() => setShowCheckout(false)} onSuccess={() => setShowCheckout(false)} />}
    </div>
  );
}
