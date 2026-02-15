'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageContainer, Button, Card } from '@/app/components/ui';
import { getCustomer, getCustomerHistory, Customer } from '@/app/lib/store';
import { formatCOP } from '@/app/lib/currency';

interface CustomerDetailPageProps {
  params: {
    id: string;
  };
}

export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const cust = await getCustomer(params.id);
      const hist = await getCustomerHistory(params.id);
      setCustomer(cust);
      setHistory(hist);
      setLoading(false);
    };
    load();
  }, [params.id]);

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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Fecha
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Tipo
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Método
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Descripción
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Saldo
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600">
                        {new Date(item.date).toLocaleDateString('es-CO')}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          item.type === 'sale'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {item.type === 'sale' ? 'Venta' : 'Abono'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs">
                        {item.type === 'sale' && item.paymentMethod ? (
                          <span>
                            {item.paymentMethod === 'cash' ? '💵 Efectivo' :
                             item.paymentMethod === 'nequi' ? '📱 Nequi' :
                             '💳 Fiado'}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-700">{item.description}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p
                        className={`font-semibold ${
                          item.amount > 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {item.amount > 0 ? '+' : ''}{formatCOP(Math.abs(item.amount))}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCOP(item.balanceAfter)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Resumen Final */}
    </PageContainer>
  );
}
