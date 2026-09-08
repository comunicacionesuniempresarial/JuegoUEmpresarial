import { useEffect, useRef, useState } from 'react';
import { useElapsedTimer } from '../hooks/useElapsedTimer';
import { RegistrationModal } from '../components/RegistrationModal';
import { sound } from '../lib/sound';

const CAREER_IMAGES = [
  { id: '1', src: '/images/Administración de Empresas.png', alt: 'Administración de Empresas', name: 'Administración de Empresas' },
  { id: '2', src: '/images/Finanzas y Comercio Exterior.png', alt: 'Finanzas y Comercio Exterior', name: 'Finanzas y Comercio Exterior' },
  { id: '3', src: '/images/ING INDUSTRIAL.png', alt: 'Ingeniero Industrial', name: 'Ingeniería Industrial' },
  { id: '4', src: '/images/ING SOFTWARE.png', alt: 'Ingeniería de Software', name: 'Ingeniería de Software' },
  { id: '5', src: '/images/Marketing.png', alt: 'Marketing', name: 'Marketing' },
  { id: '6', src: '/images/Negocios Internacionales.png', alt: 'Negocios Internacionales', name: 'Negocios Internacionales' },
  { id: '7', src: '/images/Negocios Turísticos y Hoteleros.png', alt: 'Negocios Turísticos y Hoteleros', name: 'Negocios Turísticos y Hoteleros' },
];

function getRandomIndex(excluding: number | null = null): number {
  let index: number;
  do {
    index = Math.floor(Math.random() * CAREER_IMAGES.length);
  } while (index === excluding && CAREER_IMAGES.length > 1);
  return index;
}

export function BusquedaPage() {
  const timer = useElapsedTimer();
  const [currentImageIndex, setCurrentImageIndex] = useState(() => getRandomIndex());
  const [hasFound, setHasFound] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number } | null>(null);
  const clickEffectRef = useRef<number | null>(null);

  useEffect(() => {
    timer.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup clickEffect timeout on unmount
  useEffect(() => {
    return () => {
      if (clickEffectRef.current) clearTimeout(clickEffectRef.current);
    };
  }, []);

  const currentImage = CAREER_IMAGES[currentImageIndex];

  const handleFound = () => {
    if (hasFound) return;
    timer.stop();
    sound.playVictory();
    setHasFound(true);
  };

  const handleNextChallenge = () => {
    sound.playClick();
    setHasFound(false);
    setIsZoomed(false);
    setCurrentImageIndex(getRandomIndex(currentImageIndex));
    timer.restart();
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setClickEffect({ x, y });
    sound.playClick();
    if (clickEffectRef.current) clearTimeout(clickEffectRef.current);
    clickEffectRef.current = window.setTimeout(() => setClickEffect(null), 600);
  };

  const handleShowRegistration = () => {
    sound.playClick();
    setShowRegistration(true);
  };

  const handleCloseRegistration = () => {
    setShowRegistration(false);
    handleNextChallenge();
  };

  const toggleZoom = () => {
    sound.playClick();
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="relative mx-auto flex h-full w-full flex-col overflow-hidden bg-[#f7f3ed] px-3 py-2 sm:px-6 select-none">
      {/* ── Main game area: the image is the protagonist ── */}
      <div className="flex min-h-0 w-full flex-1 flex-col gap-3">
        {/* Visual Challenge Canvas */}
        <div
          onClick={handleImageClick}
          className={`relative flex min-h-0 items-center justify-center overflow-auto rounded-3xl border border-[#eadfd2] bg-[#fffdf9] p-2 shadow-[inset_0_0_30px_rgba(100,70,40,0.06)] transition-all duration-300 ${
            isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          }`}
        >
          {/* Subtle grid pattern background */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

          {/* Click Ripple Indicator */}
          {clickEffect && (
            <span
              className="pointer-events-none absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-secondary bg-secondary/20 animate-ping z-20"
              style={{ left: clickEffect.x, top: clickEffect.y }}
            />
          )}

          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className={`block max-h-full max-w-full select-none object-contain transition-transform duration-300 ease-out drop-shadow-md ${
              isZoomed ? 'scale-150 sm:scale-175' : 'scale-100'
            }`}
            draggable={false}
          />

          {/* ── Victory Celebration Overlay ── */}
          {hasFound && (
            <div className="animate-fade-in absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md">
              <div className="animate-scale-in flex max-w-md w-full flex-col items-center gap-3 rounded-3xl border border-white/20 bg-white/10 p-6 text-center text-white shadow-2xl backdrop-blur-xl">
                <div className="relative">
                  <img
                    src="/images/stuttgart-investigador.png"
                    alt="Stuttgart Encontrado"
                    className="h-28 sm:h-36 w-auto rounded-2xl shadow-2xl drop-shadow-2xl border-2 border-white/50"
                  />
                  <span className="absolute -top-2 -right-2 rounded-full bg-accent p-1.5 text-lg shadow-lg animate-bounce">
                    🎉
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    ¡Lo Encontraste! 🏆
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                    Lámina: <span className="font-bold text-accent">{currentImage.name}</span>
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm sm:text-base font-extrabold text-white">
                    <span>Tiempo récord:</span>
                    <span className="text-accent font-mono tracking-wider">{timer.formatted}</span>
                  </div>
                </div>

                <div className="flex w-full flex-col sm:flex-row items-center gap-2.5 mt-1">
                  <button
                    onClick={handleShowRegistration}
                    className="btn-glow flex-1 w-full rounded-full bg-secondary px-5 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-gray-950 shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    📝 Registrar Récord
                  </button>
                  <button
                    onClick={handleNextChallenge}
                    className="w-full sm:w-auto rounded-full border border-white/30 bg-white/10 px-4 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition-all"
                  >
                    🔄 Otra lámina
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Compact touch action bar ── */}
        <div className="flex shrink-0 flex-col gap-2 rounded-3xl border border-[#eadfd2] bg-[#fffdf9]/95 p-2.5 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4">
          <div className="hidden min-w-0 items-center gap-2 sm:flex">
            <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-black text-teal-800">
              {currentImage.name}
            </span>
            <span className="truncate text-xs text-slate-500">Busca a Stuttgart en la imagen</span>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <button
              onClick={toggleZoom}
              className={`flex min-h-12 min-w-12 items-center justify-center rounded-2xl border px-3 text-sm font-bold transition-all ${
                isZoomed
                  ? 'border-secondary bg-secondary text-gray-900 shadow-xs'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              title="Activar / Desactivar Lupa"
              aria-label={isZoomed ? 'Alejar imagen' : 'Acercar imagen'}
            >
              {isZoomed ? '🔍−' : '🔍+'}
            </button>

            <button
              onClick={handleNextChallenge}
              className="flex min-h-12 min-w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 px-3 text-sm font-bold text-gray-700 transition-all hover:bg-gray-100 active:scale-95"
              title="Cambiar a otra lámina"
              aria-label="Otra lámina"
            >
              🔄
            </button>

            <div className="flex min-h-12 items-center gap-2 rounded-2xl bg-slate-900 px-3.5 shadow-xs">
              <span className="text-xs font-semibold text-secondary animate-pulse">⏱️</span>
              <span className="font-mono text-base font-black tracking-widest text-white">{timer.formatted}</span>
            </div>

            {!hasFound ? (
              <button
                onClick={handleFound}
                className="btn-glow flex min-h-14 flex-1 touch-manipulation items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-orange-500 px-5 py-3 text-base font-black uppercase tracking-wider text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-primary/40 active:scale-95 sm:min-w-64 sm:flex-none sm:text-lg"
              >
                <span>✋ ¡LO ENCONTRÉ!</span>
              </button>
            ) : (
              <button
                onClick={handleNextChallenge}
                className="btn-glow flex min-h-14 flex-1 touch-manipulation items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-base font-black uppercase tracking-wider text-white shadow-lg transition-all hover:bg-slate-800 active:scale-95 sm:min-w-64 sm:flex-none sm:text-lg"
              >
                <span>🔄 SIGUIENTE RETO</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Registration Modal ── */}
      {showRegistration && (
        <RegistrationModal
          juego="busqueda"
          resultado={timer.formatted}
          onClose={handleCloseRegistration}
        />
      )}
    </div>
  );
}
