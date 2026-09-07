import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-16">
      {/* Colourful backdrop spot */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/15 blur-3xl" />
      </div>

      <div className="text-center">
        <img
          src="/images/studgard-open.png"
          alt="Stuttgart perdido"
          className="mx-auto mb-6 h-40 w-auto animate-bounce drop-shadow-xl"
        />
        <h1 className="mb-3 text-8xl font-extrabold text-gray-900">
          4<span className="text-primary">0</span>4
        </h1>
        <p className="mb-2 text-xl font-semibold text-gray-700">
          ¡Stuttgart se perdió!
        </p>
        <p className="mb-8 text-base text-gray-500">
          Esta página no existe... igual que Stuttgart en la imagen.
        </p>
        <Link
          to="/"
          className="btn-glow inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-primary-hover active:scale-95"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
