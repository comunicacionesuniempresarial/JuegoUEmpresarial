import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-hero flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      {/* Left Panel — Ruleta */}
      <div className="landing-panel landing-panel--left relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
        <div className="sparkle sparkle--1" />
        <div className="sparkle sparkle--2" />
        <div className="sparkle sparkle--3" />

        <img
          src="/images/studgard-thumbs-up.png"
          alt="Studgard con pulgar arriba"
          className="mb-6 h-48 w-auto drop-shadow-lg sm:h-56 md:h-64"
        />

        <h2 className="mb-2 text-3xl font-extrabold text-white drop-shadow-md sm:text-4xl">
          ¡Dale vuelta!
        </h2>
        <p className="mb-8 max-w-xs text-base text-white/90 sm:text-lg">
          Gira la ruleta y descubre qué carrera te espera.
        </p>

        <button
          onClick={() => navigate('/ruleta')}
          className="btn-glow rounded-full bg-primary px-10 py-4 text-lg font-bold uppercase tracking-wider text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          JUGAR RULETA
        </button>
      </div>

      {/* Right Panel — Búsqueda */}
      <div className="landing-panel landing-panel--right relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
        <div className="sparkle sparkle--4" />
        <div className="sparkle sparkle--5" />
        <div className="sparkle sparkle--6" />

        <img
          src="/images/stuttgard-confundido.jpg"
          alt="Stuttgard confundido buscando"
          className="mb-6 h-48 w-auto drop-shadow-lg sm:h-56 md:h-64"
        />

        <h2 className="mb-2 text-3xl font-extrabold text-white drop-shadow-md sm:text-4xl">
          ¿Dónde está?
        </h2>
        <p className="mb-8 max-w-xs text-base text-white/90 sm:text-lg">
          Encuentra a Sttutgart escondido entre las carreras.
        </p>

        <button
          onClick={() => navigate('/busqueda')}
          className="btn-glow rounded-full bg-primary px-10 py-4 text-lg font-bold uppercase tracking-wider text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          ¿DÓNDE ESTÁ?
        </button>
      </div>
    </div>
  );
}
