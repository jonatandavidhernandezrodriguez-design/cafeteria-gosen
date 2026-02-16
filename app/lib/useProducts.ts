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
        // Paso 1: Cargar de localStorage (fuente primaria) - SIEMPRE
        let cachedProducts: Product[] = [];
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem('cafeteria_productos');
          if (cached) {
            cachedProducts = JSON.parse(cached);
            setProducts(cachedProducts);
          }
        }

        // Paso 2: Intentar sincronizar con API en background
        // PERO solo usar la respuesta si tiene datos y es válida
        try {
          const res = await fetch('/api/productos', { cache: 'no-cache' });
          if (res.ok) {
            const data = await res.json();
            // Solo actualizar si la API retorna un array con datos
            if (Array.isArray(data) && data.length > 0) {
              setProducts(data);
              // Guardar en localStorage
              if (typeof window !== 'undefined') {
                localStorage.setItem('cafeteria_productos', JSON.stringify(data));
              }
            }
            // Si API retorna vacío, mantener los datos de localStorage
          }
        } catch (apiErr) {
          console.warn('API sync failed, keeping localStorage data:', apiErr);
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
