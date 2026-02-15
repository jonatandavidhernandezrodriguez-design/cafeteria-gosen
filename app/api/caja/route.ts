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

export async function GET() {
  try {
    const caja: Cashbox = await readJSON('caja.json');
    return NextResponse.json(caja);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cashbox' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updatedCaja: Cashbox = await req.json();
    await writeJSON('caja.json', updatedCaja);
    
    return NextResponse.json(updatedCaja);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cashbox' }, { status: 500 });
  }
}
