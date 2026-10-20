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

/**
 * Seconds of "prepárate" shown before the search timer starts running.
 * The countdown is the floor for any recorded time.
 */
const COUNTDOWN_SECONDS = 5;

type Phase = 'countdown' | 'playing' | 'won';

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
  const { elapsedMs, formatted, reset, restart, stop } = useElapsedTimer();

  const [phase, setPhase] = useState<Phase>('countdown');
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [sheetIndex, setSheetIndex] = useState(() => getRandomIndex());
  const [isOverview, setIsOverview] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number } | null>(null);

  const clickEffectRef = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sheetIndexRef = useRef(sheetIndex);

  // ── Countdown ──────────────────────────────────────────────────────
  // Driven by a wall-clock reference instead of chained timeouts so the
  // countdown cannot stretch when the tab is throttled in the background.
  useEffect(() => {
    if (phase !== 'countdown') return;

    const startedAt = Date.now();
    let lastAnnounced = -1;

    const tick = () => {
      const elapsedSec = (Date.now() - startedAt) / 1000;
      const remaining = Math.ceil(COUNTDOWN_SECONDS - elapsedSec);

      if (remaining <= 0) {
        setCountdown(0);
        setPhase('playing');
        restart();
        sound.playTick(1.5);
        return;
      }

      if (remaining !== lastAnnounced) {
        lastAnnounced = remaining;
        setCountdown(remaining);
        sound.playTick(1 + (COUNTDOWN_SECONDS - remaining) * 0.14);
      }
    };

    tick();
    const id = window.setInterval(tick, 100);
    return () => window.clearInterval(id);
  }, [phase, restart]);

  // Cleanup clickEffect timeout on unmount
  useEffect(() => {
    return () => {
      if (clickEffectRef.current) clearTimeout(clickEffectRef.current);
    };
  }, []);

  // Keep the zoom centred on the sheet when toggling the magnifier.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.scrollLeft = (panel.scrollWidth - panel.clientWidth) / 2;
    panel.scrollTop = (panel.scrollHeight - panel.clientHeight) / 2;
  }, [isOverview]);

  const currentSheet = CAREER_IMAGES[sheetIndex];
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const urgency = elapsedSeconds >= 20 ? 'intense' : elapsedSeconds >= 10 ? 'warning' : 'calm';

  const companionImage =
    phase === 'won' ? '/images/stuttgart-ganador.webp' : '/images/stuttgart-investigador.webp';

  const statusLabel =
    phase === 'countdown'
      ? 'Prepárate…'
      : phase === 'won'
        ? '¡Lo encontraste!'
        : urgency === 'intense'
          ? '¡No te rindas!'
          : urgency === 'warning'
            ? '¡Sigue buscando!'
            : 'Encuentra a Stuttgart';

  /** Starts a brand new round: another random sheet, fresh countdown. */
  const startNewRound = useCallback(() => {
    sound.playClick();
    const next = getRandomIndex(sheetIndexRef.current);
    sheetIndexRef.current = next;
    setSheetIndex(next);
    setIsOverview(false);
    setCountdown(COUNTDOWN_SECONDS);
    setPhase('countdown');
    reset();
  }, [reset]);

  const handleFound = useCallback(() => {
    if (phase !== 'playing') return;
    stop();
    sound.playVictory();
    setPhase('won');
  }, [phase, stop]);

  const handleShowRegistration = () => {
    sound.playClick();
    setShowRegistration(true);
  };

  const handleCloseRegistration = () => {
    setShowRegistration(false);
  };

  const handleRegistrationSuccess = () => {
    startNewRound();
  };

  const toggleOverview = useCallback(() => {
    sound.playClick();
    setIsOverview((z) => !z);
  }, []);

  const handlePanelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // The ripple is painted inside the scrolling panel, so the offset has
    // to be measured against the panel (including its scroll offset).
    const panel = panelRef.current;
    if (panel) {
      const rect = panel.getBoundingClientRect();
      setClickEffect({
        x: e.clientX - rect.left + panel.scrollLeft,
        y: e.clientY - rect.top + panel.scrollTop,
      });
    }
    sound.playClick();
    if (clickEffectRef.current) clearTimeout(clickEffectRef.current);
    clickEffectRef.current = window.setTimeout(() => setClickEffect(null), 600);
  };

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
          Pinned above the sheet so the countdown is always visible. */}
      <div className="flex shrink-0 items-center gap-2 px-2 pt-2 pb-1 sm:px-6 sm:py-3">
        <img
          src={companionImage}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="busqueda-companion hidden h-8 w-8 shrink-0 object-contain drop-shadow-md sm:block"
        />
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

      {/* ── Main game area: one big sheet ── */}
      <div className="flex min-h-0 flex-1 flex-col gap-2 sm:gap-3">
        <div
          ref={panelRef}
          onClick={handlePanelClick}
          className={`relative min-h-0 flex-1 overflow-auto scroll-touch no-scrollbar rounded-[1.5rem] border p-2 shadow-[0_20px_54px_rgba(13,27,62,0.12),inset_0_0_30px_rgba(0,61,165,0.05)] backdrop-blur transition-all duration-500 sm:rounded-[2rem] ${
            urgency === 'intense'
              ? 'border-primary/50 shadow-[0_0_0_4px_rgba(239,18,24,0.12),0_20px_54px_rgba(239,18,24,0.16)]'
              : urgency === 'warning'
                ? 'border-accent/50 shadow-[0_0_0_4px_rgba(255,107,53,0.1),0_20px_54px_rgba(255,107,53,0.14)]'
                : 'border-white/80 bg-white/80'
          } ${isOverview ? 'cursor-zoom-in' : 'cursor-grab active:cursor-grabbing'}`}
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

          {/* The sheet fills the board by default (cropped, pannable) so
              Stuttgart is actually big enough to spot. The magnifier swaps
              to the full-sheet overview to locate him, and back again. */}
          <div className="relative z-10 flex h-full w-full items-start justify-start">
            <img
              src={currentSheet.src}
              alt={currentSheet.alt}
              loading="eager"
              decoding="async"
              draggable={false}
              className={`busqueda-sheet m-auto block select-none rounded-xl border-2 border-white/80 bg-white object-contain shadow-[0_12px_34px_rgba(13,27,62,0.35)] ${
                isOverview ? 'max-h-full max-w-full' : 'h-full w-auto max-w-none'
              }`}
            />
          </div>
        </div>

        {/* ── Action bar: magnifier + primary claim button ── */}
        <div className="busqueda-actionbar flex shrink-0 flex-row items-center gap-2 rounded-[1.5rem] border border-white/80 bg-white/90 p-2 shadow-[0_14px_34px_rgba(13,27,62,0.1)] backdrop-blur-md sm:rounded-[1.75rem] sm:px-4">
          <button
            onClick={toggleOverview}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-sm font-bold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary ${
              isOverview
                ? 'border-secondary bg-secondary text-gray-950 shadow-lg shadow-secondary/20'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-primary/5 hover:text-primary'
            }`}
            title={isOverview ? 'Volver al detalle' : 'Ver la lámina completa'}
            aria-label={isOverview ? 'Volver al detalle' : 'Ver la lámina completa'}
            aria-pressed={isOverview}
          >
            {isOverview ? '🔍+' : '🔍'}
          </button>

          <button
            onClick={handleFound}
            disabled={phase !== 'playing'}
            className="btn-glow flex min-h-14 flex-1 touch-manipulation items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary px-5 py-4 text-sm font-black uppercase tracking-wider text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-primary/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100 sm:text-base"
          >
            🎯 ¡LO ENCONTRÉ!
          </button>
        </div>
      </div>

      {/* ── Countdown overlay ─────────────────────────────────────────
          Blocks the sheet and the claim button until the search starts. */}
      {phase === 'countdown' && (
        <div className="animate-fade-in absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <span
            key={countdown}
            className="animate-scale-in font-mono text-[6.5rem] font-black leading-none text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] sm:text-[8.5rem]"
          >
            {countdown}
          </span>
          <p className="mt-2 text-xs font-black uppercase tracking-[0.25em] text-white/85">
            Prepárate
          </p>
          <p className="mt-2 max-w-xs text-center text-sm text-white/70">
            Encuentra al perrito Stuttgart en la lámina y pulsa el botón.
          </p>
        </div>
      )}

      {/* ── Victory Celebration Overlay ── */}
      {phase === 'won' && (
        <div className="animate-fade-in absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md">
          <div className="animate-scale-in flex max-w-md w-full flex-col items-center gap-3 rounded-3xl border border-white/20 bg-white/10 p-6 text-center text-white shadow-2xl backdrop-blur-xl">
            <div className="relative">
              <img
                src="/images/stuttgart-ganador.webp"
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
                onClick={startNewRound}
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
