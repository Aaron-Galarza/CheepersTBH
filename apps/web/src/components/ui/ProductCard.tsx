import { cn } from '@/utils/cn';
import { formatCurrency, parsePromoText } from '@/utils/format';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, onAddToCart, className = '' }: ProductCardProps) {
  return (
    <div
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:scale-[1.02]',
        className
      )}
    >
      <div className="relative h-[210px] w-full overflow-hidden max-md:h-[270px]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full border-b border-[#eee] object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#f0f2f5] text-[#a0aec0]">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-6 py-4">
        <h3 className="mb-1 text-xl text-[#1f1e1e] max-md:text-lg">{product.name}</h3>
        <p className="mb-3 min-h-[3.5rem] text-[15px] leading-relaxed text-[#555] max-md:text-[13px]">
          {product.description}
        </p>

        {product.promotionalLabel && (
          <p
            className="mb-2 text-sm font-bold text-[#ff0000]"
            dangerouslySetInnerHTML={{
              __html: parsePromoText(product.promotionalLabel),
            }}
          />
        )}

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-[#e63946] max-md:text-base">
            {formatCurrency(product.price)}
          </span>
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              className="rounded-lg bg-[#ce1d1d] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#ee7f18]"
            >
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
