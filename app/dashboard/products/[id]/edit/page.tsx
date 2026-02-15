'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageContainer, Button } from '@/app/components/ui';
import { ProductForm } from '@/app/components/ProductForm';
import { Product } from '@/app/types/menu';
import { getProduct, updateProduct } from '@/app/lib/store';
import { obtenerClaveValida } from '@/app/lib/auth-utils';
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
  const [showPINModal, setShowPINModal] = useState(false);
  const [isPINVerified, setIsPINVerified] = useState(false);

  // Buscar el producto desde store (async)
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [productLoading, setProductLoading] = useState(true);

  useEffect(() => {
    // Verificar si ya hay una clave válida desde localStorage
    const pinValido = obtenerClaveValida();
    setIsPINVerified(pinValido);
    setShowPINModal(!pinValido);
    
    let mounted = true;
    const load = async () => {
      try {
        const p = await getProduct(params.id);
        if (mounted) setProduct(p);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        if (mounted) setProductLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [params.id]);

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

      const ok = await updateProduct(params.id, updates);
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
      title={`Editar: ${product?.name || 'Producto'}`}
      description="Actualiza los detalles del producto"
    >
      {productLoading ? (
        <div className="text-center py-12">Cargando producto...</div>
      ) : !product ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No pudimos encontrar el producto que buscas</p>
          <Link href="/dashboard/products">
            <Button variant="primary">Volver a Productos</Button>
          </Link>
        </div>
      ) : (
        <>
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
        </>
      )}
    </PageContainer>
  );
}
