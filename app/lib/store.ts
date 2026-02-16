// =======================
// GLOBAL PERSISTENT STORE - API-BASED
// =======================

export interface SaleItem {
  productId: string;
  name: string;
  price: number;
  cost: number;
  quantity: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  date: string;
  items: SaleItem[];
  subtotal: number;
  iva: number;
  total: number;
  profit?: number;
  customerName?: string;
  paymentMethod: 'cash' | 'nequi';
  status: 'completed';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  category: string;
  stock: number;
  isActive: boolean;
  description?: string;
  imageUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  totalPurchases: number;
  totalDebt: number;
  lastPurchase?: string;
}

// ================
// PRODUCTS
// ================
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/productos', { cache: 'no-cache' });
    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

export async function getProductStock(productId: string): Promise<number> {
  const product = await getProduct(productId);
  return product?.stock ?? 0;
}

export async function updateProductStock(productId: string, quantity: number): Promise<boolean> {
  const product = await getProduct(productId);
  if (!product || product.stock < quantity) return false;

  const updated = { ...product, stock: product.stock - quantity };
  return updateProduct(productId, updated);
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
  };

  try {
    // Intentar agregar a la API
    const res = await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    // Si la API falla, agregar a localStorage como fallback
    console.warn('API unavailable, saving to localStorage:', error);
    
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('cafeteria_productos');
        const products: Product[] = cached ? JSON.parse(cached) : [];
        products.push(newProduct);
        localStorage.setItem('cafeteria_productos', JSON.stringify(products));
      }
    } catch (localError) {
      console.error('Error saving to localStorage:', localError);
    }
    
    // Retornar el producto creado de todas formas
    return newProduct;
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
  try {
    const product = await getProduct(id);
    if (!product) {
      console.error(`Product not found: ${id}`);
      alert(`❌ Producto no encontrado: ${id}`);
      return false;
    }

    const updated = { ...product, ...updates } as Product;
    
    try {
      // Intentar a través de API
      const res = await fetch('/api/productos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      
      return true;
    } catch (apiError) {
      // Si la API falla, actualizar en localStorage
      console.warn('API unavailable, updating in localStorage:', apiError);
      
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('cafeteria_productos');
        const products: Product[] = cached ? JSON.parse(cached) : [];
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
          products[index] = updated;
          localStorage.setItem('cafeteria_productos', JSON.stringify(products));
        }
      }
      
      return true; // Considerar éxito aunque sea solo local
    }
  } catch (error) {
    console.error('updateProduct error:', error);
    alert(`❌ Error: ${error instanceof Error ? error.message : 'Desconocido'}`);
    return false;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    try {
      // Intentar a través de API
      const res = await fetch('/api/productos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      
      return true;
    } catch (apiError) {
      // Si la API falla, eliminar de localStorage
      console.warn('API unavailable, deleting from localStorage:', apiError);
      
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('cafeteria_productos');
        const products: Product[] = cached ? JSON.parse(cached) : [];
        const filtered = products.filter(p => p.id !== id);
        localStorage.setItem('cafeteria_productos', JSON.stringify(filtered));
      }
      
      return true; // Considerar éxito aunque sea solo local
    }
  } catch (error) {
    console.error('deleteProduct error:', error);
    alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    return false;
  }
}

export async function recordProductSale(_productId: string, _quantity: number, _price: number): Promise<boolean> {
  // This function is now handled by the sales API
  return true;
}

// ================
// SALES
// ================
export async function addSale(sale: Omit<Sale, 'id' | 'date'>): Promise<Sale> {
  const res = await fetch('/api/ventas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sale),
  });
  return res.json();
}

export async function getSales(): Promise<Sale[]> {
  try {
    const res = await fetch('/api/ventas', { cache: 'no-cache' });
    return res.json();
  } catch (error) {
    console.error('Error fetching sales:', error);
    return [];
  }
}

export async function getTodaySales(): Promise<Sale[]> {
  const sales = await getSales();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return sales.filter((sale) => {
    const saleDate = new Date(sale.date);
    saleDate.setHours(0, 0, 0, 0);
    return saleDate.getTime() === today.getTime();
  });
}

export async function getTodayRevenue(): Promise<number> {
  const sales = await getTodaySales();
  return sales.reduce((sum, sale) => sum + sale.total, 0);
}

export async function getTodayProfit(): Promise<number> {
  const sales = await getTodaySales();
  return sales.reduce((sum, sale) => {
    // Si tenemos profit guardado directamente, usarlo
    if (sale.profit !== undefined) {
      return sum + sale.profit;
    }
    // Caso de compatibilidad: calcular basado en items
    const saleProfit = sale.items.reduce((itemSum, item) => {
      const cost = (item as any).cost ?? item.price * 0.4;
      return itemSum + (item.price - cost) * item.quantity;
    }, 0);
    return sum + saleProfit;
  }, 0);
}

export async function getTodayItemsSold(): Promise<number> {
  const sales = await getTodaySales();
  return sales.reduce(
    (sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );
}

// ================
// CUSTOMERS
// ================
export async function getCustomers(): Promise<Customer[]> {
  try {
    const res = await fetch('/api/clientes', { cache: 'no-cache' });
    return res.json();
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function getCustomer(id: string): Promise<Customer | undefined> {
  const customers = await getCustomers();
  return customers.find((c) => c.id === id);
}

export async function getOrCreateCustomer(name: string, phone?: string): Promise<Customer> {
  const customers = await getCustomers();
  let customer = customers.find((c) => c.name.toLowerCase() === name.toLowerCase());

  if (!customer) {
    customer = await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        email: undefined,
        totalPurchases: 0,
        totalDebt: 0,
      }),
    }).then((res) => res.json()) as Customer;
  }

  return customer!;
}

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<boolean> {
  const customer = await getCustomer(id);
  if (!customer) return false;

  const updated = { ...customer, ...updates } as Customer;
  const res = await fetch('/api/clientes', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated),
  });
  return res.ok;
}

// ================
// HISTORY & ANALYTICS
// ================
export async function getCustomerHistory(customerId: string) {
  const customer = await getCustomer(customerId);
  if (!customer) {
    console.warn(`Customer not found with ID: ${customerId}`);
    return [];
  }

  const sales = await getSales();
  const customerNameLower = customer.name.toLowerCase().trim();

  console.log(`Searching history for customer: "${customer.name}" (${customerId})`);
  console.log(`Total sales in system: ${sales.length}`);

  const history = sales
    .filter((s) => {
      const saleName = (s.customerName || '').toLowerCase().trim();
      const matches = saleName === customerNameLower;
      if (matches) {
        console.log(`Found matching sale: ${saleName} matched ${customerNameLower}`);
      }
      return matches;
    })
    .map((s) => ({
      id: s.id,
      date: s.date,
      type: 'sale' as const,
      amount: s.total,
      paymentMethod: s.paymentMethod,
      status: s.status,
      items: s.items.map((item) => `${item.name} x${item.quantity}`).join(', '),
      itemsArray: s.items,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  console.log(`History items found: ${history.length}`);
  return history;
}

export async function getLastCustomerSale(customerId: string): Promise<Sale | null> {
  const customer = await getCustomer(customerId);
  if (!customer) return null;

  const sales = await getSales();
  const lastSale = sales
    .filter((s) => s.customerName === customer.name)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return lastSale || null;
}

// ================
// CASHBOX
// ================
export interface Cashbox {
  isOpen: boolean;
  openingAmount: number;
  openingTime: string | null;
  dailySales: number;
  closingTime?: string;
  closingAmount?: number;
}

export async function getCashbox(): Promise<Cashbox> {
  try {
    const res = await fetch('/api/caja', { cache: 'no-cache' });
    return res.json();
  } catch (error) {
    console.error('Error fetching cashbox:', error);
    return {
      isOpen: false,
      openingAmount: 0,
      openingTime: null,
      dailySales: 0,
    };
  }
}

export async function updateCashbox(caja: Cashbox): Promise<boolean> {
  const res = await fetch('/api/caja', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(caja),
  });
  return res.ok;
}
