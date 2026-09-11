import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="glass-panel border-t border-white/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Uniempresarial. Todos los derechos reservados.
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link
              to="/privacidad"
              className="text-sm text-gray-500 hover:text-primary transition-colors underline-offset-2 hover:underline"
            >
              Privacidad
            </Link>
            <Link
              to="/cookies"
              className="text-sm text-gray-500 hover:text-primary transition-colors underline-offset-2 hover:underline"
            >
              Cookies
            </Link>
            <Link
              to="/terminos-juego"
              className="text-sm text-gray-500 hover:text-primary transition-colors underline-offset-2 hover:underline"
            >
              Términos del Juego
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
