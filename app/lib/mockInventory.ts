import { mockProducts } from './mockProducts';

export interface InventoryItem {
  productId: string;
  stock: number;
}

// Initialize inventory from mockProducts
export let mockInventory: InventoryItem[] = mockProducts.map((product) => ({
  productId: product.id,
  stock: product.stock ?? 0,
}));

export function getProductStock(productId: string): number {
  const item = mockInventory.find((inv) => inv.productId === productId);
  return item?.stock ?? 0;
}

export function updateProductStock(productId: string, quantity: number): boolean {
  const item = mockInventory.find((inv) => inv.productId === productId);

  if (!item) {
    return false;
  }

  if (item.stock < quantity) {
    return false; // Not enough stock
  }

  item.stock -= quantity;
  return true;
}

export function getInventoryValue(): number {
  let total = 0;
  mockInventory.forEach((inv) => {
    const product = mockProducts.find((p) => p.id === inv.productId);
    if (product) {
      total += product.price * inv.stock;
    }
  });
  return total;
}

export function getLowStockProducts() {
  return mockInventory
    .filter((inv) => inv.stock <= 5)
    .map((inv) => ({
      ...inv,
      name: mockProducts.find((p) => p.id === inv.productId)?.name || 'Unknown',
    }));
}
