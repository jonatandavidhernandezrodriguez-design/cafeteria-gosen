'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer, Button, Card } from '@/app/components/ui';
import Link from 'next/link';
import { getCustomers, getLastCustomerSale } from '@/app/lib/store';
import { formatCOP } from '@/app/lib/currency';
import { obtenerClaveValida } from '@/app/lib/auth-utils';
import PINVerification from '@/app/components/PINVerification';

interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  totalPurchases: number;
  totalDebt: number;
  lastPurchase?: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showPINModal, setShowPINModal] = useState(false);
  const [isPINVerified, setIsPINVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si ya hay una clave válida desde localStorage
    const pinValido = obtenerClaveValida();
    if (pinValido) {
      setIsPINVerified(true);
      setShowPINModal(false);
    } else {
      setShowPINModal(true);
    }
    
    const loadData = async () => {
      try {
        const customersData = await getCustomers();
        setCustomers(customersData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleInitialPINSuccess = () => {
    setIsPINVerified(true);
    setShowPINModal(false);
  };

  return (
    <PageContainer
      title="Clientes"
      description="Gestiona la lista de clientes del negocio"
    >
      {!isPINVerified ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      ) : (
      <>
      {customers.length === 0 ? (
        <Card variant="elevated" padding="lg" className="text-center py-12">
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sin clientes aún
          </h2>
          <p className="text-gray-600 mb-6">
            Los clientes aparecerán aquí cuando realices primeras ventas con fiado
          </p>
        </Card>
      ) : (
        <Card variant="elevated" padding="lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Nombre
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Última Compra
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Miembro desde
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{customer.name}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600">{customer.lastPurchase || '-'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-900">{formatCOP(customer.totalPurchases)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-gray-600 text-sm">
                        {customer.lastPurchase ? new Date(customer.lastPurchase).toLocaleDateString('es-CO') : '-'}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/dashboard/customers/${customer.id}`}>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Ver Historial
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      </>
      )}

      {/* PIN Verification Modal - Initial Access */}
      <PINVerification
        isOpen={showPINModal}
        title="Acceso Restringido"
        description="Ingresa el PIN administrativo para acceder a Clientes"
        onSuccess={handleInitialPINSuccess}
        onCancel={() => {
          setShowPINModal(false);
          window.history.back();
        }}
      />

      
    </PageContainer>
  );
}
