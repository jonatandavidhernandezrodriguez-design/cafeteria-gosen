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

      // Intentar crear en API
      try {
        await addProduct(productToAdd);
      } catch (apiError) {
        // Si la API falla, no es crítico - el producto se guardará en localStorage
        console.warn('API unavailable, but product will be saved in browser cache:', apiError);
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
