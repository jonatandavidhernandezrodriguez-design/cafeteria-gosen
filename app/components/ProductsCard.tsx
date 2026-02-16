'use client';

import { Button } from '@/app/components/ui';
import { Product } from '@/app/lib/store';
import { formatCOP } from '@/app/lib/currency';
import Image from 'next/image';

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
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden flex items-center justify-center border-b border-gray-200">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500 text-sm font-semibold">
            <span>Sin imagen</span>
          </div>
        )}
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
