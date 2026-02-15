'use client';

import { Button } from '@/app/components/ui';
import { Product } from '@/app/lib/store';
import { formatCOP } from '@/app/lib/currency';

interface ProductCardProps {
  product: Product;
  onAddSale?: (product: Product) => void;
}

export function ProductCard({ product, onAddSale }: ProductCardProps) {
  const profit = product.price - product.cost;
  const profitMargin = ((profit / product.price) * 100).toFixed(0);

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden hover:shadow-soft-lg transition-shadow h-full flex flex-col">
      {/* Imagen */}
      <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden flex items-center justify-center">
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100">
          <span className="text-5xl">☕</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1">
        {/* Nombre */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Precios */}
        <div className="mb-4">
          <p className="text-3xl font-bold text-blue-600 mb-1">
            {formatCOP(product.price)}
          </p>
          <p className="text-xs text-gray-500">
            Costo: {formatCOP(product.cost)} | Margen: {profitMargin}%
          </p>
        </div>

        {/* Estado */}
        {product.isActive && (
          <div className="mb-4">
            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
              Disponible
            </span>
          </div>
        )}

        {/* Botón */}
        <div className="mt-auto">
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => onAddSale?.(product)}
          >
            Agregar venta
          </Button>
        </div>
      </div>
    </div>
  );
}

ProductCard.displayName = 'ProductCard';
