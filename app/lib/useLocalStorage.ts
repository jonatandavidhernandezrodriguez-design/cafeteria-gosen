import { useState, useEffect } from 'react';

/**
 * Hook para manejar localStorage de forma segura en Next.js (SSR compatible)
 * @param key - La clave en localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 * @returns [storedValue, setStoredValue, isLoaded]
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para activar hidratación (SSR)
  const [isLoaded, setIsLoaded] = useState(false);
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Cargar desde localStorage cuando el componente monta
  useEffect(() => {
    try {
      // Solo en el cliente
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    } finally {
      setIsLoaded(true);
    }
  }, [key]);

  // Guardar en localStorage cuando el valor cambia
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isLoaded] as const;
}
