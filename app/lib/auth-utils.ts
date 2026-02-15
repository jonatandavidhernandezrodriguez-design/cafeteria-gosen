// =====================
// AUTH UTILITIES - PIN/Clave Persistence
// =====================

const PIN_STORAGE_KEY = 'cafeteria_pin_auth';
const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

interface PINAuthData {
  verified: boolean;
  expiresAt: number;
}

/**
 * Guardar la verificación de PIN con fecha de expiración (24 horas)
 */
export function guardarClaveConExpiracion(): void {
  if (typeof window === 'undefined') return; // SSR safety
  
  const expiresAt = Date.now() + EXPIRATION_TIME;
  const authData: PINAuthData = {
    verified: true,
    expiresAt,
  };
  
  try {
    localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error('Error saving PIN to localStorage:', error);
  }
}

/**
 * Obtener si el PIN sigue siendo válido (no expiró)
 */
export function obtenerClaveValida(): boolean {
  if (typeof window === 'undefined') return false; // SSR safety
  
  try {
    const stored = localStorage.getItem(PIN_STORAGE_KEY);
    if (!stored) return false;
    
    const authData: PINAuthData = JSON.parse(stored);
    
    // Verificar si la clave no ha expirado
    if (authData.verified && authData.expiresAt > Date.now()) {
      return true;
    }
    
    // Si expiró, limpiar localStorage
    if (authData.expiresAt <= Date.now()) {
      limpiarClaveAlmacenada();
    }
    
    return false;
  } catch (error) {
    console.error('Error reading PIN from localStorage:', error);
    return false;
  }
}

/**
 * Limpiar la clave almacenada
 */
export function limpiarClaveAlmacenada(): void {
  if (typeof window === 'undefined') return; // SSR safety
  
  try {
    localStorage.removeItem(PIN_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing PIN from localStorage:', error);
  }
}

/**
 * Obtener tiempo restante en minutos hasta que venza la clave
 * Retorna -1 si no hay clave válida
 */
export function obtenerTiempoRestante(): number {
  if (typeof window === 'undefined') return -1; // SSR safety
  
  try {
    const stored = localStorage.getItem(PIN_STORAGE_KEY);
    if (!stored) return -1;
    
    const authData: PINAuthData = JSON.parse(stored);
    const ahora = Date.now();
    
    if (authData.verified && authData.expiresAt > ahora) {
      const minutosRestantes = Math.ceil((authData.expiresAt - ahora) / (60 * 1000));
      return minutosRestantes;
    }
    
    return -1;
  } catch (error) {
    console.error('Error getting remaining time:', error);
    return -1;
  }
}
