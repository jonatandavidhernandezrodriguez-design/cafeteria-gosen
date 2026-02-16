import { NextRequest, NextResponse } from 'next/server';
import { readStorage, writeStorage } from '@/app/lib/storage';

interface Product {
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

export async function GET() {
  try {
    const productos = await readStorage<Product[]>('productos', []);
    return NextResponse.json(productos);
  } catch (error) {
    console.error('GET /api/productos error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newProduct: Product = await req.json();
    
    // Validar campos requeridos
    if (!newProduct.name || !newProduct.price) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price' },
        { status: 400 }
      );
    }
    
    const productos = await readStorage<Product[]>('productos', []);
    
    newProduct.id = Date.now().toString();
    productos.push(newProduct);
    
    await writeStorage('productos', productos);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('POST /api/productos error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updatedProduct: Product = await req.json();
    const productos = await readStorage<Product[]>('productos', []);
    
    const index = productos.findIndex(p => p.id === updatedProduct.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    productos[index] = updatedProduct;
    await writeStorage('productos', productos);
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('PUT /api/productos error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to update product';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }
    
    const productos = await readStorage<Product[]>('productos', []);
    const filtered = productos.filter(p => p.id !== id);
    
    if (filtered.length === productos.length) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    await writeStorage('productos', filtered);
    return NextResponse.json({ success: true, id }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/productos error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to delete product';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

