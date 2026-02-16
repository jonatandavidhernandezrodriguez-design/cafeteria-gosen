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
      
      // Crear producto con TODOS los campos incluyendo imageUrl
      const newProduct = await addProduct({
        name: formData.name,
        price: Number(formData.price),
        cost: Number(formData.cost),
        isActive: formData.isActive,
        category: formData.category,
        stock: stockValue,
        imageUrl: formData.imageUrl,
        description: formData.description,
      });

      if (!newProduct) throw new Error('No se pudo crear producto');
      
      alert('✅ Producto creado exitosamente');
      // Redirigir a la página de productos
      router.push('/dashboard/products');
    } catch (error) {
      console.error('Error al crear producto:', error);
      alert('❌ Error al crear el producto: ' + String(error));
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
