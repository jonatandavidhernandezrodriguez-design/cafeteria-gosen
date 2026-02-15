import { mockProducts } from './mockProducts';

export interface ProductStats {
  productId: string;
  sold: number; // Total vendido hoy
  revenue: number; // Ingresos totales hoy
}

// Initialize product stats
export let mockProductStats: ProductStats[] = mockProducts.map((product) => ({
  productId: product.id,
  sold: 0,
  revenue: 0,
}));

export function recordProductSale(productId: string, quantity: number, price: number): boolean {
  const stat = mockProductStats.find((s) => s.productId === productId);

  if (!stat) {
    return false;
  }

  stat.sold += quantity;
  stat.revenue += price * quantity;
  return true;
}

export function getTodayProductsSold(): number {
  return mockProductStats.reduce((sum, stat) => sum + stat.sold, 0);
}

export function getTopSellingProducts(limit: number = 5) {
  return [...mockProductStats]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, limit)
    .map((stat) => ({
      ...stat,
      name: mockProducts.find((p) => p.id === stat.productId)?.name || 'Unknown',
    }));
}
