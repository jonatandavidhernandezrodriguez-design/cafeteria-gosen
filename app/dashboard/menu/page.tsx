'use client';

import React, { useState } from 'react';
import { PageContainer, Card } from '@/app/components/ui';
import Image from 'next/image';

export default function MenuPage() {
  const [imageError, setImageError] = useState(false);

  return (
    <PageContainer
      title="Menú"
      description="Visualiza el menú de la cafetería"
    >
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col items-center justify-center">
          {imageError ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">No se pudo cargar la imagen del menú</p>
              <p className="text-sm text-gray-400">Verifica que la imagen esté disponible</p>
            </div>
          ) : (
            <div className="w-full max-w-2xl">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/Menu.jpeg"
                  alt="Menú Cafetería Gosen"
                  width={800}
                  height={1000}
                  className="w-full h-auto object-contain"
                  priority
                  onError={() => setImageError(true)}
                />
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                Menú actualizado - Cafetería Gosen
              </p>
            </div>
          )}
        </div>
      </Card>
    </PageContainer>
  );
}
