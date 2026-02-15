'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/app/lib/store';
import { ProductCard } from './ProductsCard';

interface ProductsSectionProps {
  onAddSale?: (productId: string, quantity: number) => void;
}

export function ProductsSection({ onAddSale }: ProductsSectionProps) {
  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const prods = await getProducts();
        setAllProducts(prods);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    loadProducts();
  }, []);

  const activeProducts = allProducts.filter(p => p.isActive);

  const handleAddSale = (productId: string) => {
    if (onAddSale) {
      onAddSale(productId, 1);
    }
  };

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Productos disponibles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Explora nuestro catálogo de productos y agrega ventas rápidamente.
          </p>
        </div>

        {/* Grid de productos */}
        {activeProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddSale={() => handleAddSale(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay productos disponibles</p>
          </div>
        )}
      </div>
    </section>
  );
}

ProductsSection.displayName = 'ProductsSection';
