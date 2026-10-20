import { useCallback, useEffect, useRef, useState } from 'react';
import { useElapsedTimer } from '../hooks/useElapsedTimer';
import { RegistrationModal } from '../components/RegistrationModal';
import { sound } from '../lib/sound';

const CAREER_IMAGES = [
  { id: '1', src: '/images/Administración de Empresas.jpg', alt: 'Administración de Empresas', name: 'Administración de Empresas' },
  { id: '2', src: '/images/Finanzas y Comercio Exterior.jpg', alt: 'Finanzas y Comercio Exterior', name: 'Finanzas y Comercio Exterior' },
  { id: '3', src: '/images/ING INDUSTRIAL.jpg', alt: 'Ingeniero Industrial', name: 'Ingeniería Industrial' },
  { id: '4', src: '/images/ING SOFTWARE.jpg', alt: 'Ingeniería de Software', name: 'Ingeniería de Software' },
  { id: '5', src: '/images/Marketing.jpg', alt: 'Marketing', name: 'Marketing' },
  { id: '6', src: '/images/Negocios Internacionales.jpg', alt: 'Negocios Internacionales', name: 'Negocios Internacionales' },
  { id: '7', src: '/images/Negocios Turísticos y Hoteleros.jpg', alt: 'Negocios Turísticos y Hoteleros', name: 'Negocios Turísticos y Hoteleros' },
];

function getRandomIndex(excluding: number | null = null): number {
  const randomIndex = () => {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return Math.floor((values[0] / (0xffffffff + 1)) * CAREER_IMAGES.length);
  };

  let index: number;
  do {
    index = randomIndex();
  } while (index === excluding && CAREER_IMAGES.length > 1);
  return index;
}

export function BusquedaPage() {
  const timer = useElapsedTimer();
  const { elapsedMs, formatted, reset, start, stop } = timer;
  const [currentImageIndex, setCurrentImageIndex] = useState(() => getRandomIndex());
  const [hasFound, setHasFound] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number } | null>(null);
  const clickEffectRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const beginChallenge = useCallback(() => {
    reset();
    start();
    sound.playFind();
  // Timer controls are intentionally captured once so interval updates do not
  // restart the challenge through the initialization effect.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    beginChallenge();
  }, [beginChallenge]);

  // Cleanup clickEffect timeout on unmount
  useEffect(() => {
    return () => {
      if (clickEffectRef.current) clearTimeout(clickEffectRef.current);
    };
  }, []);

  const companionImage = hasFound
    ? '/images/stuttgart-ganador.webp'
    : '/images/stuttgart-investigador.webp';
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const urgency = elapsedSeconds >= 20 ? 'intense' : elapsedSeconds >= 10 ? 'warning' : 'calm';

  const handleFound = () => {
    if (hasFound) return;
    stop();
    sound.playVictory();
    setHasFound(true);
  };

  const handleNextChallenge = () => {
    sound.playClick();
    setHasFound(false);
    setIsZoomed(false);
    setCurrentImageIndex(getRandomIndex(currentImageIndex));
    beginChallenge();
  };

  const handleImageClick = (e: React.MouseEvent<HTMLButtonElement>, imageIndex: number) => {
    // The ripple is painted inside the scrolling canvas, so the offset has
    // to be measured against the canvas (including its scroll offset),
    // not against the tapped card.
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left + canvas.scrollLeft;
      const y = e.clientY - rect.top + canvas.scrollTop;
      setClickEffect({ x, y });
    }
    sound.playClick();
    if (clickEffectRef.current) clearTimeout(clickEffectRef.current);
    clickEffectRef.current = window.setTimeout(() => setClickEffect(null), 600);
    if (imageIndex === currentImageIndex) {
      handleFound();
    }
  };

  const handleShowRegistration = () => {
    sound.playClick();
    setShowRegistration(true);
  };

  const handleCloseRegistration = () => {
    setShowRegistration(false);
  };

  const handleRegistrationSuccess = () => {
    handleNextChallenge();
  };

  const toggleZoom = () => {
    sound.playClick();
    setIsZoomed(!isZoomed);
  };

  const statusLabel = isZoomed
    ? 'Lupa activa'
    : urgency === 'intense'
      ? '¡No te rindas!'
      : urgency === 'warning'
        ? '¡Sigue buscando!'
        : 'Encuentra a Stuttgart';

  return (
    <div
      className={`relative mx-auto flex h-full min-h-0 w-full flex-col overflow-hidden select-none transition-colors duration-700 ${
        urgency === 'intense'
          ? 'bg-[radial-gradient(circle_at_8%_16%,#ffe2df_0,transparent_25%),linear-gradient(145deg,#fff7f5_0%,#F8FAFC_100%)]'
          : urgency === 'warning'
            ? 'bg-[radial-gradient(circle_at_8%_16%,#fff0d2_0,transparent_25%),linear-gradient(145deg,#F8FAFC_0%,#fffdf8_100%)]'
            : 'bg-[radial-gradient(circle_at_8%_16%,#e0f5f2_0,transparent_25%),radial-gradient(circle_at_92%_86%,#fff0d2_0,transparent_30%),linear-gradient(145deg,#f8fffe_0%,#F8FAFC_100%)]'
      }`}
    >
      {/* ── HUD: status + timer ──────────────────────────────────────
          Pinned above the board so the countdown is always visible while
          the player scrolls through the sheets. */}
      <div className="flex shrink-0 items-center gap-2 px-2 pt-2 pb-1 sm:px-6 sm:py-3">
        <span className="busqueda-hud-badge min-w-0 shrink-0 truncate rounded-full border border-white/70 bg-slate-900/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-lg backdrop-blur">
          {statusLabel}
        </span>
        <div
          className={`ml-auto flex shrink-0 items-center gap-2 rounded-2xl px-3 py-1.5 shadow-xs transition-colors duration-500 ${
            urgency === 'intense'
              ? 'bg-primary text-white'
              : urgency === 'warning'
                ? 'bg-accent text-white'
                : 'bg-slate-900 text-white'
          }`}
          role="timer"
          aria-live="off"
        >
          <span className="text-xs font-semibold animate-pulse">⏱️</span>
          <span className="font-mono text-base font-black tracking-widest">{formatted}</span>
        </div>
      </div>

      {/* ── Main game area: the image is the protagonist ── */}
      <div className="flex min-h-0 flex-1 flex-col gap-2 sm:gap-3">
        {/* Visual Challenge Canvas — scrolls internally, the HUD and the
            action bar stay pinned. */}
        <div
          ref={canvasRef}
          className={`relative min-h-0 flex-1 overflow-y-auto scroll-touch no-scrollbar rounded-[1.5rem] border p-2 shadow-[0_20px_54px_rgba(13,27,62,0.12),inset_0_0_30px_rgba(0,61,165,0.05)] backdrop-blur transition-all duration-500 sm:rounded-[2rem] ${
            urgency === 'intense'
              ? 'border-primary/50 shadow-[0_0_0_4px_rgba(239,18,24,0.12),0_20px_54px_rgba(239,18,24,0.16)]'
              : urgency === 'warning'
                ? 'border-accent/50 shadow-[0_0_0_4px_rgba(255,107,53,0.1),0_20px_54px_rgba(255,107,53,0.14)]'
                : 'border-white/80 bg-white/80'
          } ${isZoomed ? 'cursor-zoom-out' : 'cursor-crosshair'}`}
        >
          {/* Subtle grid pattern background */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(0,61,165,0.18)_1px,transparent_1px)] [background-size:18px_18px] opacity-50" />

          {/* Click Ripple Indicator */}
          {clickEffect && (
            <span
              className="pointer-events-none absolute z-20 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-2 border-secondary bg-secondary/20"
              style={{ left: clickEffect.x, top: clickEffect.y }}
            />
          )}

          <div
            className={`busqueda-grid relative z-10 grid w-full gap-2 sm:gap-3 ${
              isZoomed
                ? 'busqueda-grid--zoomed grid-cols-1'
                : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {CAREER_IMAGES.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={(e) => handleImageClick(e, index)}
                disabled={hasFound}
                aria-label={`Seleccionar imagen de ${image.name}`}
                className={`rounded-2xl border-2 bg-white/80 p-1.5 shadow-md transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 sm:p-2 ${
                  index === currentImageIndex && hasFound ? 'border-primary ring-4 ring-primary/30' : 'border-white/80'
                } ${hasFound ? 'cursor-default' : 'cursor-crosshair'}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="eager"
                  decoding="async"
                  className="block aspect-[4/3] w-full select-none object-contain"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>

        {/* ── Compact touch action bar ── */}
        <div className="busqueda-actionbar flex shrink-0 flex-row items-center gap-2 rounded-[1.5rem] border border-white/80 bg-white/90 p-2 shadow-[0_14px_34px_rgba(13,27,62,0.1)] backdrop-blur-md sm:flex-wrap sm:justify-between sm:gap-3 sm:rounded-[1.75rem] sm:px-4">
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={toggleZoom}
              className={`flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-2xl border px-3 text-sm font-bold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary ${
                isZoomed
                  ? 'border-secondary bg-secondary text-gray-950 shadow-lg shadow-secondary/20'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-primary/5 hover:text-primary'
              }`}
              title="Activar / Desactivar Lupa"
              aria-label={isZoomed ? 'Alejar imagen' : 'Acercar imagen'}
            >
              {isZoomed ? '🔍−' : '🔍+'}
            </button>

            <button
              onClick={handleNextChallenge}
              className="flex min-h-12 min-w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 transition-all hover:bg-primary/5 hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary"
              title="Cambiar a otra lámina"
              aria-label="Otra lámina"
            >
              🔄
            </button>

            {/* Stuttgart companion — dynamically reacts to game state */}
            <div className="hidden items-center gap-2 sm:flex">
              <span className="rounded-2xl bg-slate-900 px-3 py-2 text-[11px] font-black text-white shadow-md">
                {hasFound ? '¡Lo encontraste!' : elapsedSeconds > 0 ? '¡Rápido, el tiempo corre!' : '¡Busca a Stuttgart!'}
              </span>
              <img
                src={companionImage}
                alt="Stuttgart"
                loading="lazy"
                decoding="async"
                className="h-12 w-12 object-contain drop-shadow-md transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none sm:justify-end">
            {!hasFound ? (
              <div className="busqueda-hint flex min-h-12 min-w-0 flex-1 items-center justify-center truncate rounded-2xl bg-slate-100 px-3 py-2 text-center text-xs font-bold text-slate-600 sm:min-w-56 sm:flex-none sm:text-sm">
                <span className="sm:hidden">¿Dónde está Stuttgart?</span>
                <span className="hidden sm:inline">Selecciona la imagen donde está Stuttgart</span>
              </div>
            ) : (
              <button
                onClick={handleNextChallenge}
                className="btn-glow flex min-h-12 w-full flex-1 touch-manipulation items-center justify-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all hover:bg-slate-800 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 sm:min-w-56 sm:flex-none sm:text-sm lg:text-lg"
              >
                <span>🔄 SIGUIENTE RETO</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Victory Celebration Overlay ── */}
      {hasFound && (
        <div className="animate-fade-in absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md">
          <div className="animate-scale-in flex max-w-md w-full flex-col items-center gap-3 rounded-3xl border border-white/20 bg-white/10 p-6 text-center text-white shadow-2xl backdrop-blur-xl">
            <div className="relative">
              <img
                src="/images/stuttgart-investigador.webp"
                alt="Stuttgart Encontrado"
                loading="lazy"
                decoding="async"
                className="h-28 w-auto rounded-2xl border-2 border-white/50 shadow-2xl drop-shadow-2xl sm:h-36"
              />
              <span className="absolute -top-2 -right-2 animate-bounce rounded-full bg-accent p-1.5 text-lg shadow-lg">
                🎉
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black leading-tight text-white sm:text-2xl">
                ¡Encontraste a Stuttgart! 🏆
              </h2>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-extrabold text-white sm:text-base">
                <span>Tiempo récord:</span>
                <span className="font-mono tracking-wider text-accent">{formatted}</span>
              </div>
            </div>

            <div className="mt-1 flex w-full flex-col items-center gap-2.5 sm:flex-row">
              <button
                onClick={handleShowRegistration}
                className="btn-glow w-full flex-1 rounded-full bg-secondary px-5 py-3 text-xs font-black uppercase tracking-wider text-gray-950 shadow-xl transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary sm:text-sm"
              >
                📝 Registrar
              </button>
              <button
                onClick={handleNextChallenge}
                className="w-full rounded-full border border-white/30 bg-white/10 px-4 py-3 text-xs font-semibold text-white transition-all hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white sm:w-auto sm:text-sm"
              >
                🔄 Otra lámina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Registration Modal ── */}
      {showRegistration && (
        <RegistrationModal
          juego="busqueda"
          resultado={formatted}
          onClose={handleCloseRegistration}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
}
