'use client';

import React, { useState } from 'react';
import { PageContainer, Button, Card, Input } from '@/app/components/ui';
import { getTodaySales, getTodayRevenue, getTodayProfit, getTodayItemsSold } from '@/app/lib/store';
import { formatCOP } from '@/app/lib/currency';
import PINVerification from '@/app/components/PINVerification';

interface CashBoxState {
  isOpen: boolean;
  openingAmount: number;
  openingTime: Date | null;
}

interface CashBoxReport {
  openingAmount: number;
  closingAmount: number;
  expectedAmount: number;
  difference: number;
  revenue: number;
  profit: number;
  itemsSold: number;
  transactions: number;
  openingTime: Date;
  closingTime: Date;
}

export default function CashBoxPage() {
  const [cashBox, setCashBox] = useState<CashBoxState>({
    isOpen: false,
    openingAmount: 0,
    openingTime: null,
  });

  const [closingAmount, setClosingAmount] = useState(0);
  const [showPINForOpen, setShowPINForOpen] = useState(false);
  const [showPINForClose, setShowPINForClose] = useState(false);
  const [pendingOpenAmount, setPendingOpenAmount] = useState(0);
  const [report, setReport] = useState<CashBoxReport | null>(null);

  const handleOpenCashBox = () => {
    setShowPINForOpen(true);
  };

  const handlePINSuccessOpen = () => {
    if (pendingOpenAmount <= 0) {
      alert('❌ Ingresa un monto válido para abrir caja');
      return;
    }

    setCashBox({
      isOpen: true,
      openingAmount: pendingOpenAmount,
      openingTime: new Date(),
    });
    setPendingOpenAmount(0);
    setShowPINForOpen(false);
    alert('✅ Caja abierta correctamente');
  };

  const handleCloseCashBox = () => {
    if (!cashBox.isOpen) {
      alert('❌ La caja no está abierta');
      return;
    }

    if (closingAmount <= 0) {
      alert('❌ Ingresa el monto de cierre');
      return;
    }

    setShowPINForClose(true);
  };

  const handlePINSuccessClose = async () => {
    if (!cashBox.openingTime) return;

    const todayRevenue = await getTodayRevenue();
    const todayProfit = await getTodayProfit();
    const expectedAmount = cashBox.openingAmount + todayRevenue;
    const difference = closingAmount - expectedAmount;
    const todaySales = await getTodaySales();
    const itemsSold = await getTodayItemsSold();

    const newReport: CashBoxReport = {
      openingAmount: cashBox.openingAmount,
      closingAmount: closingAmount,
      expectedAmount: expectedAmount,
      difference: difference,
      revenue: todayRevenue,
      profit: todayProfit,
      itemsSold: itemsSold,
      transactions: todaySales.length,
      openingTime: cashBox.openingTime,
      closingTime: new Date(),
    };

    setReport(newReport);
    setCashBox({
      isOpen: false,
      openingAmount: 0,
      openingTime: null,
    });
    setClosingAmount(0);
    setShowPINForClose(false);
  };

  return (
    <PageContainer
      title="Gestión de Caja"
      description="Abre y cierra la caja del día"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controles de Caja */}
        <div>
          <Card variant="elevated" padding="lg" className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {cashBox.isOpen ? '🔓 Caja Abierta' : '🔐 Caja Cerrada'}
            </h3>

            {!cashBox.isOpen ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monto Inicial <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="number"
                    value={pendingOpenAmount}
                    onChange={(e) => setPendingOpenAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    disabled={cashBox.isOpen}
                  />
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleOpenCashBox}
                >
                  🔓 Abrir Caja (Requiere PIN)
                </Button>
              </>
            ) : (
              <>
                <div className="bg-blue-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600 mb-1">Monto Inicial</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCOP(cashBox.openingAmount)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Abierta a las {cashBox.openingTime?.toLocaleTimeString('es-CO', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monto de Cierre <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="number"
                    value={closingAmount}
                    onChange={(e) => setClosingAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={handleCloseCashBox}
                >
                  🔐 Cerrar Caja (Requiere PIN)
                </Button>
              </>
            )}
          </Card>
        </div>

        {/* Resumen del Día */}
        <div>
          <Card variant="elevated" padding="lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📊 Resumen del Día
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Estado:</span>
                <span className="font-bold text-gray-900">Caja {cashBox.isOpen ? 'Abierta' : 'Cerrada'}</span>
              </div>
            </div>
          </Card>
        </div>

      {/* Reporte de Cierre */}
      {report && (
        <Card variant="elevated" padding="lg" className="mt-6 border-2 border-green-500">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            ✅ Reporte de Cierre de Caja
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Movimientos */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Movimientos</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-blue-50 rounded">
                  <span className="text-gray-700">Monto Inicial:</span>
                  <span className="font-bold text-blue-600">
                    {formatCOP(report.openingAmount)}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-green-50 rounded">
                  <span className="text-gray-700">Ventas del Día:</span>
                  <span className="font-bold text-green-600">
                    {formatCOP(report.revenue)}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-amber-50 rounded">
                  <span className="text-gray-700">Monto Esperado:</span>
                  <span className="font-bold text-amber-600">
                    {formatCOP(report.expectedAmount)}
                  </span>
                </div>
                <div className="border-t-2 border-gray-300 my-2" />
                <div className="flex justify-between p-2 bg-gray-100 rounded">
                  <span className="font-semibold text-gray-700">Monto Contado:</span>
                  <span className="font-bold text-gray-900">
                    {formatCOP(report.closingAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Diferencia */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Verificación</h4>
              <div className={`p-4 rounded-lg border-2 mb-3 ${
                report.difference === 0
                  ? 'bg-green-50 border-green-500'
                  : report.difference > 0
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-red-50 border-red-500'
              }`}>
                <p className="text-sm text-gray-600 mb-1">Diferencia</p>
                <p className={`text-3xl font-bold ${
                  report.difference === 0
                    ? 'text-green-600'
                    : report.difference > 0
                    ? 'text-blue-600'
                    : 'text-red-600'
                }`}>
                  {report.difference === 0 ? '✅ Cuadrado' : formatCOP(report.difference)}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ganancia:</span>
                  <span className="font-bold text-green-600">
                    {formatCOP(report.profit)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
            <p>Apertura: {report.openingTime.toLocaleString('es-CO')}</p>
            <p>Cierre: {report.closingTime.toLocaleString('es-CO')}</p>
          </div>

          <Button
            variant="outline"
            size="md"
            className="w-full mt-4"
            onClick={() => setReport(null)}
          >
            🔄 Limpiar Reporte
          </Button>
        </Card>
      )}

      {/* PIN Modals */}
      <PINVerification
        isOpen={showPINForOpen}
        title="Abrir Caja"
        description="Ingresa el PIN administrativo para abrir la caja"
        onSuccess={handlePINSuccessOpen}
        onCancel={() => setShowPINForOpen(false)}
      />

      <PINVerification
        isOpen={showPINForClose}
        title="Cerrar Caja"
        description="Ingresa el PIN administrativo para cerrar la caja"
        onSuccess={handlePINSuccessClose}
        onCancel={() => setShowPINForClose(false)}
      />
    </PageContainer>
  );
}
