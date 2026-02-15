'use client';

import React from 'react';
import { PageContainer, Button } from '@/app/components/ui';
import Link from 'next/link';

export default function ReportsPage() {
  return (
    <PageContainer
      title="Reportes"
      description="Analítica y reportes del negocio"
    >
      <div className="bg-white rounded-xl p-12 text-center shadow-soft border border-gray-200">
        <div className="text-5xl mb-4">📈</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Próximamente
        </h2>
        <p className="text-gray-600 mb-6">
          Esta sección está siendo desarrollada
        </p>
        <Link href="/dashboard">
          <Button variant="primary">Volver al Dashboard</Button>
        </Link>
      </div>
    </PageContainer>
  );
}
