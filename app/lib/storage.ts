// =====================
// STORAGE HANDLER - Local JSON + Vercel KV compatible
// =====================

import { kv } from '@vercel/kv';

const USE_KV = process.env.KV_REST_API_URL ? true : false;

/**
 * Leer datos de almacenamiento (archivos en local, KV en Vercel)
 */
export async function readStorage<T>(key: string, defaultValue: T): Promise<T> {
  try {
    if (USE_KV) {
      // Usar Vercel KV en producción
      const data = await kv.get(key);
      return (data as T) || defaultValue;
    } else {
      // Usar archivos JSON en local
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const dataDir = path.join(process.cwd(), 'data');
      const filePath = path.join(dataDir, `${key}.json`);
      
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent) as T;
      } catch (error) {
        // Si el archivo no existe, retornar valor por defecto
        return defaultValue;
      }
    }
  } catch (error) {
    console.error(`Error reading storage ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Escribir datos en almacenamiento
 */
export async function writeStorage<T>(key: string, data: T): Promise<void> {
  try {
    if (USE_KV) {
      // Usar Vercel KV en producción
      await kv.set(key, data);
    } else {
      // Usar archivos JSON en local
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const dataDir = path.join(process.cwd(), 'data');
      
      // Crear directorio si no existe
      try {
        await fs.mkdir(dataDir, { recursive: true });
      } catch (error) {
        console.warn('Could not create data directory:', error);
      }
      
      const filePath = path.join(dataDir, `${key}.json`);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error(`Error writing storage ${key}:`, error);
    throw error;
  }
}

/**
 * Eliminar datos del almacenamiento
 */
export async function deleteStorage(key: string): Promise<void> {
  try {
    if (USE_KV) {
      // Usar Vercel KV en producción
      await kv.del(key);
    } else {
      // Usar archivos JSON en local
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const dataDir = path.join(process.cwd(), 'data');
      const filePath = path.join(dataDir, `${key}.json`);
      
      try {
        await fs.unlink(filePath);
      } catch (error) {
        // Si el archivo no existe, no hay problema
        console.warn(`File not found: ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error deleting storage ${key}:`, error);
    throw error;
  }
}
