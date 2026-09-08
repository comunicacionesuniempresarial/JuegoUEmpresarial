export function Footer() {
  return (
    <footer className="glass-panel border-t border-white/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Uniempresarial. Todos los derechos reservados.
          </div>

          <nav className="flex items-center gap-4">
            <a
              href="https://uniempresarial.edu.co/wp-content/uploads/2026/08/Tratamiento-de-Datos-Personales.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-primary transition-colors underline-offset-2 hover:underline"
            >
              Políticas de Privacidad
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
