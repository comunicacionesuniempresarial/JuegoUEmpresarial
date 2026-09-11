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
  idle: '/images/stuttgart-sonriente.png',
  spinning: '/images/stuttgart-ruleta.png',
  won: '/images/stuttgart-ganador.png',
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

  const handleCloseRegistration = useCallback(() => {
    setShowRegistration(false);
    setStuttgartState('idle');
  }, []);

  return (
    <div className="relative flex min-h-full flex-col items-center justify-start gap-5 overflow-y-auto bg-[radial-gradient(circle_at_15%_20%,#ffe0e0_0,transparent_26%),radial-gradient(circle_at_85%_75%,#e0f0fa_0,transparent_30%),linear-gradient(135deg,#F8FAFC_0%,#fff5e7_45%,#effbfa_100%)] p-3 pb-8 sm:justify-center sm:p-6 lg:flex-row lg:gap-14 lg:overflow-hidden lg:p-8">

      {/* ── Left: Stuttgart ── */}
      <div className="flex w-full max-w-[18rem] flex-col items-center text-center sm:w-60 sm:max-w-none">
        <div className="relative mb-3">
          <img
            src={STUTTGART_IMAGES[stuttgartState]}
            alt="Stuttgart"
            decoding="async"
            className="h-32 w-auto drop-shadow-[0_0_20px_rgba(239,18,24,0.22)] transition-transform duration-300 hover:scale-105 sm:h-44"
          />
          {stuttgartState === 'won' && (
            <span className="absolute -top-2 -right-2 text-3xl animate-bounce-in">🎉</span>
          )}
        </div>
        <p aria-live="polite" className="text-base sm:text-lg font-bold text-slate-800">
          {STUTTGART_MESSAGES[stuttgartState]}
        </p>

        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`mt-5 min-h-16 w-full touch-manipulation rounded-2xl px-8 py-4 text-xl font-black uppercase tracking-wider text-white shadow-xl transition-all duration-200 sm:text-2xl ${
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
      <div className="relative flex items-center justify-center">
        <div className="pointer-events-none absolute -bottom-1 rounded-full bg-slate-900/80 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-lg backdrop-blur">
          La punta define el premio
        </div>
        <RuletaWheel
          prizes={DEFAULT_PRIZES}
          isSpinning={isSpinning}
          onSpinEnd={handleSpinEnd}
        />

      </div>

      {/* ── Modals ── */}
      {prizeWon && <PrizeModal prize={prizeWon.label} onClose={handleClosePrizeModal} />}
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
