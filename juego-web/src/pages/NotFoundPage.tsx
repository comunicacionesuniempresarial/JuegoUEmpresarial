import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500">
      <img
        src="/images/studgard-open.png"
        alt="Sttutgart perdido"
        className="w-48 h-48 mb-6 animate-bounce"
      />
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-xl text-white/90 mb-8">
        ¡Stuttgard se perdió! Esta página no existe.
      </p>
      <Link
        to="/"
        className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
