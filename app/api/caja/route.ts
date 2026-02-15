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

export async function GET() {
  try {
    const caja = await readStorage<Cashbox>('caja', { 
      isOpen: false, 
      openingAmount: 0, 
      openingTime: null, 
      dailySales: 0 
    });
    return NextResponse.json(caja);
  } catch (error) {
    console.error('GET /api/caja error:', error);
    return NextResponse.json({ error: 'Failed to fetch cashbox' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updatedCaja: Cashbox = await req.json();
    await writeStorage('caja', updatedCaja);
    
    return NextResponse.json(updatedCaja);
  } catch (error) {
    console.error('PUT /api/caja error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to update cashbox';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
