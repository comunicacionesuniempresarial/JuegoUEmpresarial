import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/logo-header.png"
              alt="Logo Uniempresarial"
              className="h-10 w-auto"
            />
            <span className="hidden text-xl font-bold text-primary sm:inline">
              ¿Dónde Está Sttutgart?
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/ruleta"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Ruleta
            </Link>
            <Link
              to="/busqueda"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Búsqueda
            </Link>
            <Link
              to="/admin"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
