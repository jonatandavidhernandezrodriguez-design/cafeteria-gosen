'use client';

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-600 text-sm">
          © {currentYear} Cafetería Gosen. Todos los derechos reservados.
        </p>
        <p className="text-gray-500 text-xs mt-2">
          🍵 Solución de gestión integral para cafeterías
        </p>
      </div>
    </footer>
  );
}

LandingFooter.displayName = 'LandingFooter';
