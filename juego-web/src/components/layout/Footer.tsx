import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Uniempresarial. Todos los derechos reservados.
          </div>

          <nav className="flex items-center gap-4">
            <Link
              to="/politicas"
              className="text-sm text-gray-500 hover:text-primary transition-colors"
            >
              Políticas de Privacidad
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
