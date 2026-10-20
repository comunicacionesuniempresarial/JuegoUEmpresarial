import { useCallback, useState } from 'react';
import { RuletaWheel } from '../components/RuletaWheel';
import { DEFAULT_PRIZES } from '../lib/constants';
import { PrizeModal } from '../components/PrizeModal';
import { RegistrationModal } from '../components/RegistrationModal';
import { Spinner } from '../components/Spinner';
import type { Prize } from '../types';

type StuttgartState = 'idle' | 'spinning' | 'won';

const STUTTGART_MESSAGES: Record<StuttgartState, string> = {
  idle: '¡Gira la ruleta!',
  spinning: '¡Buena suerte!',
  won: '¡Ganaste!',
};

const STUTTGART_IMAGES: Record<StuttgartState, string> = {
  idle: '/images/stuttgart-sonriente.webp',
  spinning: '/images/stuttgart-ruleta.webp',
  won: '/images/stuttgart-ganador.webp',
};

export function RuletaPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizeWon, setPrizeWon] = useState<Prize | null>(null);
  const [lastPrize, setLastPrize] = useState<Prize | null>(null);
  const [stuttgartState, setStuttgartState] = useState<StuttgartState>('idle');
  const [showRegistration, setShowRegistration] = useState(false);

  const handleSpin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    setPrizeWon(null);
    setStuttgartState('spinning');
  }, [isSpinning]);

  const handleSpinEnd = useCallback((prize: Prize) => {
    if (import.meta.env.DEV) {
      console.debug('[RuletaPage] handleSpinEnd received:', prize.label, 'id:', prize.id);
    }
    setIsSpinning(false);
    setPrizeWon(prize);
    setLastPrize(prize);
    setStuttgartState('won');
  }, []);

  const handleClosePrizeModal = useCallback(() => {
    setPrizeWon(null);
    setShowRegistration(true);
  }, []);

  const handleSkipPrize = useCallback(() => {
    setPrizeWon(null);
    setStuttgartState('idle');
  }, []);

  const handleCloseRegistration = useCallback(() => {
    setShowRegistration(false);
    setStuttgartState('idle');
  }, []);

  return (
    <div className="ruleta-stage relative flex h-full min-h-0 w-full flex-col items-center justify-center gap-4 overflow-y-auto overflow-x-clip bg-[radial-gradient(circle_at_15%_20%,#ffe0e0_0,transparent_26%),radial-gradient(circle_at_85%_75%,#e0f0fa_0,transparent_30%),linear-gradient(135deg,#F8FAFC_0%,#fff5e7_45%,#effbfa_100%)] p-3 pb-6 sm:gap-5 sm:p-6 lg:flex-row lg:gap-14 lg:overflow-hidden lg:p-8">

      {/* ── Left: Stuttgart ── */}
      <div className="ruleta-companion flex w-full max-w-[18rem] flex-col items-center text-center sm:w-60 sm:max-w-none">
        <div className="relative mb-2 sm:mb-3">
          <img
            src={STUTTGART_IMAGES[stuttgartState]}
            alt="Stuttgart"
            decoding="async"
            className="h-20 w-auto drop-shadow-[0_0_20px_rgba(239,18,24,0.22)] transition-transform duration-300 hover:scale-105 sm:h-28 lg:h-44"
          />
          {stuttgartState === 'won' && (
            <span className="absolute -top-2 -right-2 text-3xl animate-bounce-in">🎉</span>
          )}
        </div>
        <p aria-live="polite" className="text-sm font-bold text-slate-800 sm:text-base lg:text-lg">
          {STUTTGART_MESSAGES[stuttgartState]}
        </p>

        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`mt-3 min-h-12 w-full touch-manipulation rounded-2xl px-6 py-3 text-lg font-black uppercase tracking-wider text-white shadow-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary sm:mt-5 sm:min-h-16 sm:px-8 sm:py-4 sm:text-2xl ${
            isSpinning
              ? 'cursor-not-allowed bg-slate-300 opacity-70'
              : 'bg-gradient-to-r from-primary via-accent to-primary hover:brightness-105 hover:scale-105 active:scale-95 hover:shadow-primary/40'
          }`}
        >
          {isSpinning ? (
            <span className="flex items-center justify-center gap-3">
              <Spinner /> Girando…
            </span>
          ) : (
            '¡GIRAR!'
          )}
        </button>
      </div>

      {/* ── Right: large roulette ── */}
      <div className="relative flex shrink-0 flex-col items-center justify-center gap-2">
        <RuletaWheel
          prizes={DEFAULT_PRIZES}
          isSpinning={isSpinning}
          onSpinEnd={handleSpinEnd}
        />
        {/* Hint sits in normal flow below the wheel so it never covers
            the segments or the pointer. */}
        <span className="ruleta-hint rounded-full bg-slate-900/80 px-4 py-1.5 text-center text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-lg backdrop-blur">
          La punta define el premio
        </span>
      </div>

      {/* ── Modals ── */}
      {prizeWon && <PrizeModal prize={prizeWon.label} onClose={handleClosePrizeModal} onSkip={handleSkipPrize} />}
      {showRegistration && (
        <RegistrationModal
          juego="ruleta"
          resultado={lastPrize?.label}
          onClose={handleCloseRegistration}
        />
      )}
    </div>
  );
}
