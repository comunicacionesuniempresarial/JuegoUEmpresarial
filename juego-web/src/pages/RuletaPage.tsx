import { useCallback, useState } from 'react';
import { RuletaWheel, DEFAULT_PRIZES } from '../components/RuletaWheel';
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
  idle: '/images/studgard-pointing.png',
  spinning: '/images/studgard-open.png',
  won: '/images/studgard-thumbs-up.png',
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
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-3 overflow-hidden bg-[#f7f3ed] p-4 sm:flex-row sm:gap-8 sm:p-8 lg:gap-14">

      {/* ── Left: Stuttgart ── */}
      <div className="flex w-full max-w-[250px] flex-col items-center text-center sm:w-56 sm:max-w-none">
        <div className="relative mb-3">
          <img
            src={STUTTGART_IMAGES[stuttgartState]}
            alt="Stuttgart"
            className="h-32 w-auto drop-shadow-[0_0_20px_rgba(232,93,74,0.22)] transition-transform duration-300 hover:scale-105 sm:h-44"
          />
          {stuttgartState === 'won' && (
            <span className="absolute -top-2 -right-2 text-3xl animate-bounce-in">🎉</span>
          )}
        </div>
        <p className="text-base sm:text-lg font-bold text-slate-800">
          {STUTTGART_MESSAGES[stuttgartState]}
        </p>
        {stuttgartState === 'idle' && (
          <p className="mt-1 max-w-[220px] text-sm text-slate-500">Atrévete a girar: un premio te está esperando.</p>
        )}

        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`mt-5 min-h-16 w-full touch-manipulation rounded-2xl px-8 py-4 text-xl font-black uppercase tracking-wider text-white shadow-xl transition-all duration-200 sm:text-2xl ${
            isSpinning
              ? 'cursor-not-allowed bg-slate-300 opacity-70'
              : 'bg-primary hover:bg-primary-hover hover:scale-105 active:scale-95 hover:shadow-[0_0_32px_rgba(232,93,74,0.35)]'
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
      <div className="flex items-center justify-center">
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
