'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, Button } from '@/app/components/ui';
import { Product } from '@/app/types/menu';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onToggleActive?: (productId: string, isActive: boolean) => void;
}

export function ProductCard({ product, onEdit, onDelete, onToggleActive }: ProductCardProps) {
  return (
    <Card variant="elevated" padding="md" className="flex flex-col h-full hover:shadow-soft-lg transition-shadow">
      {/* Imagen */}
      <div className="relative w-full h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100">
            <span className="text-4xl">📦</span>
          </div>
        )}
        {product.isActive && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Activo
          </div>
        )}
        {!product.isActive && (
          <div className="absolute top-2 right-2 bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Inactivo
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        {product.category && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
            {product.category}
          </p>
        )}

        {/* Precios */}
        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          <span className="text-xl font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </span>
          {product.cost && product.cost > 0 && (
            <span className="text-xs text-gray-400 line-through">
              Costo: ${product.cost.toFixed(2)}
            </span>
          )}
        </div>

        {/* Margen de ganancia */}
        {product.cost && product.cost > 0 && (
          <div className="mb-4 text-xs font-medium text-gray-600">
            Margen: {(((product.price - product.cost) / product.price) * 100).toFixed(0)}%
          </div>
        )}

        {/* Stock */}
        {product.stock !== undefined && (
          <div className="mb-4 p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Stock disponible</p>
            <p className={`text-lg font-bold ${
              product.stock <= 5 ? 'text-red-600' :
              product.stock <= 10 ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {product.stock} unidades
            </p>
            {product.stock <= 5 && (
              <p className="text-xs text-red-600 mt-1">⚠️ Stock bajo</p>
            )}
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(product)}
            >
              Editar
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm(`¿Eliminar "${product.name}"?`)) {
                  onDelete(product.id);
                }
              }}
            >
              Eliminar
            </Button>
          )}
        </div>
        
        {onToggleActive && (
          <Button
            variant={product.isActive ? "outline" : "primary"}
            size="sm"
            className="w-full"
            onClick={() => onToggleActive(product.id, !product.isActive)}
          >
            {product.isActive ? '✓ Activo - Click para desactivar' : '✗ Inactivo - Click para activar'}
          </Button>
        )}
      </div>
    </Card>
  );
}

ProductCard.displayName = 'ProductCard';
