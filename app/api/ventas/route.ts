import { NextRequest, NextResponse } from 'next/server';
import { readStorage, writeStorage } from '@/app/lib/storage';

interface Cashbox {
  isOpen: boolean;
  openingAmount: number;
  openingTime: string | null;
  dailySales: number;
  closingTime?: string;
  closingAmount?: number;
}

interface Sale {
  id: string;
  date: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  iva: number;
  total: number;
  paymentMethod: 'cash' | 'nequi' | 'credit';
  customerName?: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export async function GET() {
  try {
    const ventas = await readStorage<Sale[]>('ventas', []);
    return NextResponse.json(ventas);
  } catch (error) {
    console.error('GET /api/ventas error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newSale: Omit<Sale, 'id'> = await req.json();
    const ventas = await readStorage<Sale[]>('ventas', []);
    
    const sale: Sale = {
      ...newSale,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    
    ventas.push(sale);
    await writeStorage('ventas', ventas);
    
    // Update cashbox
    const caja = await readStorage<Cashbox>('caja', { isOpen: false, openingAmount: 0, openingTime: null, dailySales: 0 });
    caja.dailySales += sale.total;
    await writeStorage('caja', caja);
    
    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error('POST /api/ventas error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to create sale';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
