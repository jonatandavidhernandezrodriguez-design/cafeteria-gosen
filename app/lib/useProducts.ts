import { useState, useEffect } from 'react';
import { Product } from '@/app/types/menu';
import { useLocalStorage } from '@/app/lib/useLocalStorage';

/**
 * Hook personalizado para manejar productos con persistencia en localStorage
 * NOTA: La fuente de verdad es localStorage. La API es solo para sincronización.
 */
export function useProducts() {
  // localStorage para persistencia - es la fuente de verdad
  const [cachedProducts, setCachedProducts, isLoaded] = useLocalStorage<Product[]>(
    'cafeteria_productos',
    []
  );

  // Estado para los productos actual
  const [products, setProducts] = useState<Product[]>(cachedProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar productos con localStorage cada vez que cambien
  useEffect(() => {
    if (isLoaded) {
      setCachedProducts(products);
    }
  }, [products, setCachedProducts, isLoaded]);

  // Cargar productos desde localStorage al montar
  useEffect(() => {
    if (isLoaded) {
      // Usar datos de localStorage como fuente principal
      setProducts(cachedProducts);
      
      // Intentar sincronizar con API en background (sin bloquear UI)
      syncWithAPI();
    }
  }, [isLoaded, cachedProducts]);

  const syncWithAPI = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/productos', { cache: 'no-cache' });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.warn('API sync failed, using localStorage:', err);
      // Si falla la API, no pasa nada - localStorage ya tiene los datos
      setError(null); // No mostrar error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    setProducts,
    isLoading,
    error,
    isLoaded,
  };
}
