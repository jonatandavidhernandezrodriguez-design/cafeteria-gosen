'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function HomeButton() {
  const pathname = usePathname();

  // No mostrar si ya estamos en inicio
  if (pathname === '/') {
    return null;
  }

  return (
    <Link
      href="/"
      className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
      title="Volver al inicio"
    >
      <span className="text-xl">🏠</span>
    </Link>
  );
}

HomeButton.displayName = 'HomeButton';
