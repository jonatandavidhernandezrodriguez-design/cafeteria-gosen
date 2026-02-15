import { NextRequest, NextResponse } from 'next/server';
import { readStorage, writeStorage } from '@/app/lib/storage';

interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  totalPurchases: number;
  totalDebt: number;
  lastPurchase?: string;
}

export async function GET() {
  try {
    const clientes = await readStorage<Customer[]>('clientes', []);
    return NextResponse.json(clientes);
  } catch (error) {
    console.error('GET /api/clientes error:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newCustomer: Omit<Customer, 'id'> = await req.json();
    const clientes = await readStorage<Customer[]>('clientes', []);
    
    const customer: Customer = {
      ...newCustomer,
      id: Date.now().toString(),
    };
    
    clientes.push(customer);
    await writeStorage('clientes', clientes);
    
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error('POST /api/clientes error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to create customer';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updatedCustomer: Customer = await req.json();
    const clientes = await readStorage<Customer[]>('clientes', []);
    
    const index = clientes.findIndex(c => c.id === updatedCustomer.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    clientes[index] = updatedCustomer;
    await writeStorage('clientes', clientes);
    
    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('PUT /api/clientes error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to update customer';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
