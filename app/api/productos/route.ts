import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/app/lib/db';

interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  category: string;
  stock: number;
  isActive: boolean;
}

export async function GET() {
  try {
    const productos: Product[] = await readJSON('productos.json');
    return NextResponse.json(productos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newProduct: Product = await req.json();
    const productos: Product[] = await readJSON('productos.json');
    
    newProduct.id = Date.now().toString();
    productos.push(newProduct);
    
    await writeJSON('productos.json', productos);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updatedProduct: Product = await req.json();
    const productos: Product[] = await readJSON('productos.json');
    
    const index = productos.findIndex(p => p.id === updatedProduct.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    productos[index] = updatedProduct;
    await writeJSON('productos.json', productos);
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const productos: Product[] = await readJSON('productos.json');
    
    const filtered = productos.filter(p => p.id !== id);
    await writeJSON('productos.json', filtered);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
