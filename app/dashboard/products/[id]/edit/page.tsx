'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageContainer, Button } from '@/app/components/ui';
import { ProductForm } from '@/app/components/ProductForm';
import { Product } from '@/app/types/menu';
import { getProduct, updateProduct } from '@/app/lib/store';
import PINVerification from '@/app/components/PINVerification';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

interface FormData {
  name: string;
  price: string;
  cost: string;
  imageUrl: string;
  isActive: boolean;
  description: string;
  category: string;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPINModal, setShowPINModal] = useState(true);
  const [isPINVerified, setIsPINVerified] = useState(false);

  // Buscar el producto desde store
  const product = getProduct(params.id) as Product | undefined;

  if (!product) {
    return (
      <PageContainer title="Producto no encontrado">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No pudimos encontrar el producto que buscas</p>
          <Link href="/dashboard/products">
            <Button variant="primary">Volver a Productos</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const handlePINSuccess = () => {
    setIsPINVerified(true);
    setShowPINModal(false);
  };

  const handleSubmit = async (formData: FormData) => {
    if (!isPINVerified) {
      alert('❌ Debes verificar el PIN para editar productos');
      return;
    }

    setIsLoading(true);
    
    try {
      // Actualizar producto en el store
      const updates = {
        name: formData.name,
        price: Number(formData.price),
        cost: Number(formData.cost),
        imageUrl: formData.imageUrl,
        isActive: formData.isActive,
        description: formData.description,
        category: formData.category,
      };

      const ok = updateProduct(params.id, updates);
      if (!ok) throw new Error('No se pudo actualizar producto');

      // Redirigir a la página de productos
      router.push('/dashboard/products');
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      alert('Error al actualizar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isPINVerified) {
    return (
      <PageContainer title="Editar Producto">
        <PINVerification
          isOpen={showPINModal}
          title="Acceso Restringido"
          description="Ingresa el PIN administrativo para editar productos"
          onSuccess={handlePINSuccess}
          onCancel={() => router.push('/dashboard/products')}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`Editar: ${product.name}`}
      description="Actualiza los detalles del producto"
    >
      <div className="mb-6">
        <Link href="/dashboard/products">
          <Button variant="ghost" size="md">
            ← Volver a Productos
          </Button>
        </Link>
      </div>
      
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isLoading={isLoading}
      />
    </PageContainer>
  );
}
