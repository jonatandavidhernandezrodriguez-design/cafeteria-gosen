'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageContainer, Button } from '@/app/components/ui';
import { ProductForm } from '@/app/components/ProductForm';
import { addProduct } from '@/app/lib/store';

interface FormData {
  name: string;
  price: string;
  cost: string;
  imageUrl: string;
  isActive: boolean;
  description: string;
  category: string;
  stock: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    
    try {
      const stockValue = formData.stock ? Number(formData.stock) : 0;
      
      // Crear producto
      const productToAdd = {
        name: formData.name,
        price: Number(formData.price),
        cost: Number(formData.cost),
        isActive: formData.isActive,
        category: formData.category,
        stock: stockValue,
        imageUrl: formData.imageUrl,
        description: formData.description,
      };

      // Crear producto (guarda en API o localStorage)
      const newProduct = await addProduct(productToAdd);
      
      // Guardar en localStorage también
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('cafeteria_productos');
        const products = cached ? JSON.parse(cached) : [];
        
        // Verificar si ya existe
        const exists = products.some((p: any) => p.id === newProduct.id);
        if (!exists) {
          products.push(newProduct);
          localStorage.setItem('cafeteria_productos', JSON.stringify(products));
        }
      }

      alert('✅ Producto creado exitosamente');
      router.push('/dashboard/products');
    } catch (error) {
      console.error('Error al crear producto:', error);
      alert('❌ Error: ' + String(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer
      title="Crear Nuevo Producto"
      description="Agrega un nuevo producto al catálogo de tu cafetería"
    >
      <div className="mb-6">
        <Link href="/dashboard/products">
          <Button variant="ghost" size="md">
            ← Volver a Productos
          </Button>
        </Link>
      </div>
      
      <ProductForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isLoading={isLoading}
      />
    </PageContainer>
  );
}
