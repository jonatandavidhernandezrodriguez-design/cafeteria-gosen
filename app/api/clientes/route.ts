import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/app/lib/db';

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
    const clientes: Customer[] = await readJSON('clientes.json');
    return NextResponse.json(clientes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newCustomer: Omit<Customer, 'id'> = await req.json();
    const clientes: Customer[] = await readJSON('clientes.json');
    
    const customer: Customer = {
      ...newCustomer,
      id: Date.now().toString(),
    };
    
    clientes.push(customer);
    await writeJSON('clientes.json', clientes);
    
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updatedCustomer: Customer = await req.json();
    const clientes: Customer[] = await readJSON('clientes.json');
    
    const index = clientes.findIndex(c => c.id === updatedCustomer.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    clientes[index] = updatedCustomer;
    await writeJSON('clientes.json', clientes);
    
    return NextResponse.json(updatedCustomer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}
