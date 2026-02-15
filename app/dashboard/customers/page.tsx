'use client';

import React, { useState, useEffect } from 'react';
import { PageContainer, Button, Card } from '@/app/components/ui';
import Link from 'next/link';
import { getCustomers, getLastCustomerSale, getCustomer } from '@/app/lib/store';
import { formatCOP } from '@/app/lib/currency';
import { exportPaymentHistoryToPDF, exportPaymentHistoryToExcel } from '@/app/lib/export-utils';
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
  const [payments, setPayments] = useState<any[]>([]);
  const [showPINModal, setShowPINModal] = useState(true);
  const [isPINVerified, setIsPINVerified] = useState(false);
  const [showExportPINModal, setShowExportPINModal] = useState(false);
  const [pendingExport, setPendingExport] = useState<'pdf' | 'excel' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const customersData = await getCustomers();
        const paymentsData = await getCustomerPayments();
        setCustomers(customersData);
        setPayments(paymentsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleExportPaymentHistory = async (format: 'pdf' | 'excel') => {
    if (!isPINVerified) {
      setPendingExport(format);
      setShowExportPINModal(true);
      return;
    }

    try {
      const exportPayments = await Promise.all(
        payments.map(async (p) => ({
          date: typeof p.date === 'string' ? p.date : new Date(p.date).toISOString(),
          customer: (await getCustomer(p.customerId))?.name || 'Desconocido',
          amount: p.amount,
          note: p.note || '',
        }))
      );

      const totalPaid = exportPayments.reduce((sum, p) => sum + p.amount, 0);

      if (format === 'pdf') {
        exportPaymentHistoryToPDF(exportPayments, totalPaid);
      } else {
        exportPaymentHistoryToExcel(exportPayments, totalPaid);
      }
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  const handleInitialPINSuccess = () => {
    setIsPINVerified(true);
    setShowPINModal(false);
  };

  const handleExportPINSuccess = async () => {
    if (!pendingExport) return;

    try {
      const exportPayments = await Promise.all(
        payments.map(async (p) => ({
          date: typeof p.date === 'string' ? p.date : new Date(p.date).toISOString(),
          customer: (await getCustomer(p.customerId))?.name || 'Desconocido',
          amount: p.amount,
          note: p.note || '',
        }))
      );

      const totalPaid = exportPayments.reduce((sum, p) => sum + p.amount, 0);

      if (pendingExport === 'pdf') {
        exportPaymentHistoryToPDF(exportPayments, totalPaid);
      } else {
        exportPaymentHistoryToExcel(exportPayments, totalPaid);
      }

      setShowExportPINModal(false);
      setPendingExport(null);
    } catch (error) {
      console.error('Error exporting:', error);
    }
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
      {/* Botones de Exportación */}
      {payments.length > 0 && (
        <Card variant="elevated" padding="lg" className="mb-8">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-900">Exportar Historial de Pagos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleExportPaymentHistory('pdf')}
                className="flex items-center justify-center gap-2"
              >
                📄 Historial PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportPaymentHistory('excel')}
                className="flex items-center justify-center gap-2"
              >
                📊 Historial Excel
              </Button>
            </div>
          </div>
        </Card>
      )}

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
                    Método
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Deuda Actual
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
                {customers.map((customer) => {
                  const lastSalePromise = getLastCustomerSale(customer.id);
                  
                  return (
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
                        <p className="text-sm">{'💳 Fiado'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className={`font-semibold ${customer.totalDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {customer.totalDebt > 0 ? formatCOP(customer.totalDebt) : '✓ Pagado'}
                        </p>
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
                  );
                })}
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

      {/* PIN Verification Modal - Export */}
      <PINVerification
        isOpen={showExportPINModal}
        title="Acceso Restringido"
        description="Ingresa el PIN administrativo para exportar datos de clientes"
        onSuccess={handleExportPINSuccess}
        onCancel={() => {
          setShowExportPINModal(false);
          setPendingExport(null);
        }}
      />
    </PageContainer>
  );
}
