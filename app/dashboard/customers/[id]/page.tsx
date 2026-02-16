'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { PageContainer, Button, Card } from '@/app/components/ui';
import { getCustomer, getCustomerHistory, deleteSale, Customer, SaleItem } from '@/app/lib/store';
import { formatCOP } from '@/app/lib/currency';

interface HistoryItem {
  id: string;
  date: string;
  type: 'sale';
  amount: number;
  paymentMethod: 'cash' | 'nequi';
  status: string;
  items: string;
  itemsArray?: SaleItem[];
}

interface CustomerDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CustomerDetailPage({ params: paramPromise }: CustomerDetailPageProps) {
  const params = use(paramPromise);
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const cust = await getCustomer(params.id);
    const hist = await getCustomerHistory(params.id);
    setCustomer(cust);
    setHistory(hist);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    
    // Recargar cada 2 segundos
    const interval = setInterval(loadData, 2000);
    
    // Listener para cambios en localStorage
    const handleStorageChange = () => {
      loadData();
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }
    
    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [params.id]);

  const handleDeleteSale = async (saleId: string) => {
    if (!confirm('¿Eliminar esta transacción del historial? Esta acción es irreversible.')) {
      return;
    }
    
    try {
      const success = await deleteSale(saleId);
      if (success) {
        setHistory(history.filter(item => item.id !== saleId));
        alert('✅ Transacción eliminada');
      } else {
        alert('❌ Error al eliminar la transacción');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al eliminar');
    }
  };

  if (loading) {
    return (
      <PageContainer title="Cargando...">
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando datos del cliente...</p>
        </div>
      </PageContainer>
    );
  }

  if (!customer) {
    return (
      <PageContainer title="Cliente no encontrado">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No pudimos encontrar al cliente</p>
          <Link href="/dashboard/customers">
            <Button variant="primary">Volver a Clientes</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`${customer.name}`}
      description="Historial y detalles del cliente"
    >
      <div className="mb-6">
        <Link href="/dashboard/customers">
          <Button variant="ghost" size="md">
            ← Volver a Clientes
          </Button>
        </Link>
      </div>

      {/* Información del Cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card variant="elevated" padding="lg">
          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
            Teléfono
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {customer.phone || '-'}
          </p>
        </Card>
        <Card variant="elevated" padding="lg">
          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
            Email
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {customer.email || '-'}
          </p>
        </Card>
      </div>

      {/* Historial de Transacciones */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Historial de Transacciones</h3>

        {history.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Sin historial de transacciones</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fecha */}
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
                      📅 Fecha
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(item.date).toLocaleDateString('es-CO')}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(item.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {/* Método de Pago */}
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
                      💳 Método de Pago
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.paymentMethod === 'cash' ? '💵 Efectivo' :
                       item.paymentMethod === 'nequi' ? '📱 Nequi' :
                       '💳 Crédito'}
                    </p>
                  </div>

                  {/* Artículos */}
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
                      📦 Artículos
                    </p>
                    <div className="text-sm text-gray-900">
                      {item.itemsArray?.length ? (
                        <ul className="space-y-1">
                          {item.itemsArray.map((prod, idx) => (
                            <li key={idx} className="text-gray-700">
                              • {prod.name} <span className="text-xs text-gray-600">x{prod.quantity}</span> — {formatCOP(prod.subtotal)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">{item.items}</p>
                      )}
                    </div>
                  </div>

                  {/* Total y Botón Eliminar */}
                  <div className="flex justify-between items-center md:col-span-2">
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
                        💰 Total Pagado
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCOP(item.amount)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteSale(item.id)}
                      className="px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded border border-red-200 transition-colors"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

    </PageContainer>
  );
}

  if (loading) {
    return (
      <PageContainer title="Cargando...">
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando datos del cliente...</p>
        </div>
      </PageContainer>
    );
  }

  if (!customer) {
    return (
      <PageContainer title="Cliente no encontrado">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No pudimos encontrar al cliente</p>
          <Link href="/dashboard/customers">
            <Button variant="primary">Volver a Clientes</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`${customer.name}`}
      description="Historial y detalles del cliente"
    >
      <div className="mb-6">
        <Link href="/dashboard/customers">
          <Button variant="ghost" size="md">
            ← Volver a Clientes
          </Button>
        </Link>
      </div>

      {/* Información del Cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card variant="elevated" padding="lg">
          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
            Teléfono
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {customer.phone || '-'}
          </p>
        </Card>
        <Card variant="elevated" padding="lg">
          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
            Email
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {customer.email || '-'}
          </p>
        </Card>
      </div>

      {/* Historial de Transacciones */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Historial de Transacciones</h3>

        {history.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Sin historial de transacciones</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fecha */}
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
                      📅 Fecha
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(item.date).toLocaleDateString('es-CO')}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(item.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {/* Método de Pago */}
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
                      💳 Método de Pago
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.paymentMethod === 'cash' ? '💵 Efectivo' :
                       item.paymentMethod === 'nequi' ? '📱 Nequi' :
                       '💳 Crédito'}
                    </p>
                  </div>

                  {/* Artículos */}
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
                      📦 Artículos
                    </p>
                    <div className="text-sm text-gray-900">
                      {item.itemsArray?.length ? (
                        <ul className="space-y-1">
                          {item.itemsArray.map((prod, idx) => (
                            <li key={idx} className="text-gray-700">
                              • {prod.name} <span className="text-xs text-gray-600">x{prod.quantity}</span> — {formatCOP(prod.subtotal)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">{item.items}</p>
                      )}
                    </div>
                  </div>

                  {/* Total y Botón Eliminar */}
                  <div className="flex justify-between items-center md:col-span-2">
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-1">
                        💰 Total Pagado
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCOP(item.amount)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteSale(item.id)}
                      className="px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded border border-red-200 transition-colors"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

    </PageContainer>
  );
}
