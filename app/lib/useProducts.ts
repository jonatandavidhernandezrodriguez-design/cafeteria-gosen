import { useState, useEffect } from 'react';
import { Product } from '@/app/types/menu';

/**
 * Hook personalizado para manejar productos con persistencia en localStorage
 * NOTA: La fuente de verdad es localStorage. La API es solo para sincronización.
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos al montar - ÚNICO EFECTO
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Paso 1: Cargar de localStorage (fuente primaria)
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem('cafeteria_productos');
          if (cached) {
            const parsed = JSON.parse(cached);
            setProducts(parsed);
          }
        }

        // Paso 2: Sincronizar con API en background (sin esperar, sin bloquear)
        try {
          const res = await fetch('/api/productos', { cache: 'no-cache' });
          if (res.ok) {
            const data = await res.json();
            setProducts(data);
            // Guardar en localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('cafeteria_productos', JSON.stringify(data));
            }
          }
        } catch (apiErr) {
          console.warn('API sync failed, using localStorage:', apiErr);
          // No pasa nada, usamos lo que hay en localStorage
        }
      } finally {
        setIsLoading(false);
        setIsLoaded(true);
      }
    };

    loadProducts();
  }, []); // Solo una vez al montar

  return {
    products,
    setProducts,
    isLoading,
    error,
    isLoaded,
  };
}
