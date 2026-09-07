import { useEffect, useState } from 'react';
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

  useEffect(() => {
    timer.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setTimeout(() => setClickEffect(null), 600);
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
    <div className="relative mx-auto flex h-full w-full flex-col justify-between overflow-hidden px-3 py-2 sm:px-6 select-none">
      {/* ── Top Control Bar (Ultra compact) ── */}
      <div className="mb-2 flex shrink-0 items-center justify-between gap-2 rounded-2xl border border-gray-100 bg-white/95 p-2.5 shadow-xs backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/15 text-lg font-bold text-secondary shrink-0">
            🔍
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-gray-900 tracking-tight leading-none">
                ¿Dónde Está Stuttgart?
              </h1>
              <span className="rounded-full bg-secondary/15 px-2.5 py-0.5 text-[11px] font-black text-teal-800">
                {currentImage.name}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 hidden sm:block">
              Observa con atención la lámina. ¡Presiona "¡LO ENCONTRÉ!" apenas veas a la mascota!
            </p>
          </div>
        </div>

        {/* Dynamic Controls & Timer */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleZoom}
            className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
              isZoomed
                ? 'bg-secondary text-gray-900 border-secondary shadow-xs'
                : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
            title="Activar / Desactivar Lupa"
          >
            <span>{isZoomed ? '🔍-' : '🔍+'}</span>
            <span className="hidden sm:inline">{isZoomed ? 'Alejar' : 'Lupa'}</span>
          </button>

          <button
            onClick={handleNextChallenge}
            className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 active:scale-95 transition-all"
            title="Cambiar a otra carrera aleatoria"
          >
            <span>🔄</span>
            <span className="hidden sm:inline">Otra carrera</span>
          </button>

          {/* Glowing Timer */}
          <div className="flex items-center gap-2 rounded-2xl bg-slate-900 px-3.5 py-1.5 shadow-xs">
            <span className="text-xs font-semibold text-secondary animate-pulse">⏱️</span>
            <span className="font-mono text-base sm:text-lg font-black tracking-widest text-white">
              {timer.formatted}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Viewport: Canvas & Sidebar (Takes remaining height exactly without scroll) ── */}
      <div className="flex flex-1 items-stretch gap-3 min-h-0 w-full">
        {/* Visual Challenge Canvas */}
        <div
          onClick={handleImageClick}
          className={`relative flex flex-1 items-center justify-center overflow-auto rounded-3xl border border-slate-200/80 bg-white p-2 shadow-inner transition-all duration-300 ${
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
                    src="/images/Stuttgart girando ruleta/Stuttgart Ruleta.jpg"
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

        {/* ── Interactive Side Companion (Compact column) ── */}
        <div className="flex flex-col items-center justify-between gap-3 w-56 sm:w-64 lg:w-72 shrink-0">
          {/* Stuttgart Mascot Status Card */}
          <div className="flex w-full flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white p-4 shadow-xs text-center flex-1">
            <div className="relative mb-2">
              <img
                src={hasFound ? '/images/studgard-thumbs-up.png' : '/images/stuttgard-confundido.jpg'}
                alt="Stuttgart Guía"
                className="h-20 sm:h-28 w-auto object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
              />
              <span className="absolute -bottom-1 -right-1 rounded-full bg-white px-2 py-0.5 text-[9px] font-black shadow-xs border border-gray-100">
                {hasFound ? '¡Genio! ✨' : '¿Dónde estoy? 🕵️‍♂️'}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-black text-gray-800">
              {hasFound ? '¡Excelente agilidad!' : 'Mascota Stuttgart'}
            </p>
            <p className="mt-0.5 text-[11px] text-gray-500 line-clamp-2">
              {hasFound
                ? '¡Tu tiempo quedó listo para ingresar al podio!'
                : 'Estoy escondido en la lámina. ¡Búscame y toca el botón!'}
            </p>
          </div>

          {/* Action Button: Enormous and touch friendly */}
          <div className="w-full shrink-0">
            {!hasFound ? (
              <button
                onClick={handleFound}
                className="btn-glow flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-orange-500 px-4 py-4 sm:py-5 text-lg sm:text-xl font-black uppercase tracking-wider text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-primary/40 active:scale-95"
              >
                <span>✋ ¡LO ENCONTRÉ!</span>
              </button>
            ) : (
              <button
                onClick={handleNextChallenge}
                className="btn-glow flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-4 text-sm sm:text-base font-black uppercase tracking-wider text-white shadow-lg hover:bg-slate-800 transition-all active:scale-95"
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