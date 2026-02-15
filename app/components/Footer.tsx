import Link from 'next/link';
import { Container } from './ui/Container';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-coffee-900 text-white mt-12">
      {/* Main Footer Content */}
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <span>☕</span>
              <span>Gosen Cafeteria</span>
            </div>
            <p className="text-beige-100 text-sm leading-relaxed">
              Tu cafetería favorita dentro del corazón de la comunidad. Café de calidad y momentos compartidos.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-beige-100">Enlaces</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Menú' },
                { href: '/cart', label: 'Carrito' },
                { href: '/orders', label: 'Pedidos' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-beige-200 hover:text-beige-100 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-beige-100">Contacto</h3>
            <ul className="space-y-2 text-sm text-beige-200">
              <li>📧 info@gosencafe.com</li>
              <li>📱 +34 123 456 789</li>
              <li>📍 Iglesia Gosen</li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-beige-100">Horario</h3>
            <ul className="space-y-2 text-sm text-beige-200">
              <li>Lunes - Viernes</li>
              <li className="ml-4">8:00 - 20:00</li>
              <li className="mt-2">Sábado - Domingo</li>
              <li className="ml-4">9:00 - 18:00</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-coffee-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-beige-200">
            <p>&copy; {currentYear} Gosen Cafeteria. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-beige-100 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-beige-100 transition-colors">Términos</a>
              <a href="#" className="hover:text-beige-100 transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
