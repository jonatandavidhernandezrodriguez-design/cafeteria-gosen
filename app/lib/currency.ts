/**
 * Currency formatting utility for Colombian Peso (COP)
 */

export const formatCOP = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format COP without currency symbol (just number)
 */
export const formatCOPNumber = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(value);
};
