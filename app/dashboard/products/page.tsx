'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageContainer, Button } from '@/app/components/ui';
import { ProductCard } from '@/app/components/ProductCard';
import { Product } from '@/app/types/menu';
import { getProducts, deleteProduct, updateProduct } from '@/app/lib/store';
import { obtenerClaveValida } from '@/app/lib/auth-utils';
import PINVerification from '@/app/components/PINVerification';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isPINVerified, setIsPINVerified] = useState(false);
  const [showPINModal, setShowPINModal] = useState(false);
  const [showActionPINModal, setShowActionPINModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{action: string; productId?: string} | null>(null);

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesStatus = !filterStatus || (filterStatus === 'active' ? product.isActive : !product.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  useEffect(() => {
    // Verificar si ya hay una clave válida desde localStorage
    const pinValido = obtenerClaveValida();
    if (pinValido) {
      setIsPINVerified(true);
      setShowPINModal(false);
    } else {
      setShowPINModal(true);
    }
    
    loadProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    if (!isPINVerified) {
      setPendingAction({ action: 'delete', productId });
      setShowActionPINModal(true);
      return;
    }
    if (!confirm('¿Eliminar producto? Esta acción es irreversible.')) return;
    await deleteProduct(productId);
    await loadProducts();
  };

  const handleToggleActive = async (productId: string, isActive: boolean) => {
    if (!isPINVerified) {
      setPendingAction({ action: 'toggle', productId });
      setShowActionPINModal(true);
      return;
    }
    await updateProduct(productId, { isActive });
    await loadProducts();
  };

  const handleEdit = (product: Product) => {
    if (!isPINVerified) {
      setPendingAction({ action: 'edit', productId: product.id });
      setShowActionPINModal(true);
      return;
    }
    router.push(`/dashboard/products/${product.id}/edit`);
  };

  const handleInitialPINSuccess = () => {
    setIsPINVerified(true);
    setShowPINModal(false);
  };

  const handleActionPINSuccess = async () => {
    setIsPINVerified(true);
    setShowActionPINModal(false);
    
    if (pendingAction) {
      if (pendingAction.action === 'delete' && pendingAction.productId) {
        if (confirm('¿Eliminar producto? Esta acción es irreversible.')) {
          await deleteProduct(pendingAction.productId);
          await loadProducts();
        }
      } else if (pendingAction.action === 'toggle' && pendingAction.productId) {
        const product = products.find(p => p.id === pendingAction.productId);
        if (product) {
          await updateProduct(pendingAction.productId, { isActive: !product.isActive });
          await loadProducts();
        }
      } else if (pendingAction.action === 'edit' && pendingAction.productId) {
        router.push(`/dashboard/products/${pendingAction.productId}/edit`);
      }
    }
    
    setPendingAction(null);
  };

  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    totalValue: products.reduce((sum, p) => sum + p.price, 0),
    lowStock: products.filter(p => p.stock !== undefined && p.stock <= 5).length,
  };

  return (
    <PageContainer
      title="Productos"
      description="Gestiona el catálogo de productos de tu cafetería"
    >
      {!isPINVerified ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      ) : (
      <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Total de Productos</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Productos Activos</p>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Valor Total Catálogo</p>
          <p className="text-3xl font-bold text-primary-600">${stats.totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Stock Bajo</p>
          <p className="text-3xl font-bold text-red-600">{stats.lowStock}</p>
        </div>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        >
          <option value="">Todas las categorías</option>
          <option value="coffee">Café</option>
          <option value="pastries">Pasteles</option>
          <option value="sandwiches">Sándwiches</option>
          <option value="beverages">Bebidas</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 rounded-lg border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
        <Link href="/dashboard/products/new">
          <Button variant="primary" size="md">
            ➕ Nuevo Producto
          </Button>
        </Link>
      </div>

      {/* Grid de productos */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No hay productos que coincidan con tu búsqueda</p>
          <Link href="/dashboard/products/new">
            <Button variant="primary">Crear primer producto</Button>
          </Link>
        </div>
      )}
      </>
      )}

      {/* PIN Verification Modal - Initial Access */}
      <PINVerification
        isOpen={showPINModal}
        title="Acceso Restringido"
        description="Ingresa el PIN administrativo para acceder a Productos"
        onSuccess={handleInitialPINSuccess}
        onCancel={() => {
          setShowPINModal(false);
          window.history.back();
        }}
      />

      {/* PIN Verification Modal - Actions */}
      <PINVerification
        isOpen={showActionPINModal}
        title="Acceso Restringido"
        description="Ingresa el PIN administrativo para editar productos"
        onSuccess={handleActionPINSuccess}
        onCancel={() => {
          setShowActionPINModal(false);
          setPendingAction(null);
        }}
      />
    </PageContainer>
  );
}
