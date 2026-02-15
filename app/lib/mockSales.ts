export interface SaleItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  date: Date;
  items: SaleItem[];
  total: number;
  customerName?: string;
  paymentMethod: 'cash' | 'nequi' | 'credit';
  status: 'paid' | 'credit';
}

// Mock sales data - in memory storage
export let mockSales: Sale[] = [];

export function addSale(sale: Omit<Sale, 'id' | 'date'>): Sale {
  const newSale: Sale = {
    id: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date: new Date(),
    items: sale.items,
    total: sale.total,
    customerName: sale.customerName,
    paymentMethod: sale.paymentMethod,
    status: sale.status,
  };

  mockSales.push(newSale);
  return newSale;
}

export function getTodaySales() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return mockSales.filter((sale) => {
    const saleDate = new Date(sale.date);
    saleDate.setHours(0, 0, 0, 0);
    return saleDate.getTime() === today.getTime();
  });
}

export function getTodayRevenue() {
  return getTodaySales().reduce((sum, sale) => sum + sale.total, 0);
}

export function getTodayProfit() {
  return getTodaySales().reduce((sum, sale) => {
    const saleProfit = sale.items.reduce((itemSum, item) => {
      // Asumiendo costo = 40% del precio (ejemplo)
      const cost = item.price * 0.4;
      return itemSum + (item.price - cost) * item.quantity;
    }, 0);
    return sum + saleProfit;
  }, 0);
}

export function getTodayItemsSold() {
  return getTodaySales().reduce(
    (sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );
}

export function getTodayCreditTotal() {
  return getTodaySales()
    .filter((sale) => sale.status === 'credit')
    .reduce((sum, sale) => sum + sale.total, 0);
}
