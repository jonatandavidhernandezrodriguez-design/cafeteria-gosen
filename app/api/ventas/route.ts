import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/app/lib/db';

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
    const ventas: Sale[] = await readJSON('ventas.json');
    return NextResponse.json(ventas);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newSale: Omit<Sale, 'id'> = await req.json();
    const ventas: Sale[] = await readJSON('ventas.json');
    
    const sale: Sale = {
      ...newSale,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    
    ventas.push(sale);
    await writeJSON('ventas.json', ventas);
    
    // Update cashbox
    const caja = await readJSON<Cashbox>('caja.json');
    caja.dailySales += sale.total;
    await writeJSON('caja.json', caja);
    
    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
  }
}
