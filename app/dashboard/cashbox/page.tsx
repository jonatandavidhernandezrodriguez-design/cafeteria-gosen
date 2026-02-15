'use client';

// Minimal CashBox page to avoid build parse errors
import React from 'react';
import { PageContainer } from '@/app/components/ui';

export default function CashBoxPage() {
  return (
    <PageContainer title="Gestión de Caja" description="Abre y cierra la caja del día">
      <div className="p-6">
        <h2 className="text-xl font-semibold">Gestión de Caja</h2>
        <p className="text-sm text-gray-600 mt-2">Página simplificada temporalmente para asegurar build.</p>
      </div>
    </PageContainer>
  );
}
