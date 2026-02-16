import { useState, useEffect } from 'react';
import { Product } from '@/app/types/menu';
import { getProducts } from '@/app/lib/store';
import { useLocalStorage } from '@/app/lib/useLocalStorage';

/**
 * Hook personalizado para manejar productos con persistencia en localStorage
 * Sincroniza con la API pero usa localStorage como cache/fallback
 */
export function useProducts() {
  // localStorage para persistencia offline
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
    setCachedProducts(products);
  }, [products, setCachedProducts]);

  // Cargar productos desde la API al montar
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error loading products from API:', err);
        setError('Error al cargar productos');
        // Si falla la API, usar el cache de localStorage
        if (cachedProducts.length > 0) {
          setProducts(cachedProducts);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Solo cargar cuando localStorage esté listo
    if (isLoaded) {
      loadProducts();
    }
  }, [isLoaded, cachedProducts]);

  return {
    products,
    setProducts,
    isLoading,
    error,
    isLoaded,
  };
}
