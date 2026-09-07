import { useCallback, useState } from 'react';
import { RuletaWheel, DEFAULT_PRIZES } from '../components/RuletaWheel';
import { PrizeModal } from '../components/PrizeModal';
import { RegistrationModal } from '../components/RegistrationModal';
import type { Prize } from '../types';

/** Studgard message states */
type StudgardState = 'idle' | 'spinning' | 'won';

const STUDGARD_MESSAGES: Record<StudgardState, string> = {
  idle: '¡Gira la ruleta!',
  spinning: '¡Suerte!',
  won: '¡Ganaste!',
};

const STUDGARD_IMAGES: Record<StudgardState, string> = {
  idle: '/images/studgard-pointing.png',
  spinning: '/images/studgard-open.png',
  won: '/images/studgard-thumbs-up.png',
};

export function RuletaPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizeWon, setPrizeWon] = useState<Prize | null>(null);
  const [lastPrize, setLastPrize] = useState<Prize | null>(null);
  const [studgardState, setStudgardState] = useState<StudgardState>('idle');
  const [showRegistration, setShowRegistration] = useState(false);

  const handleSpin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    setPrizeWon(null);
    setStudgardState('spinning');
  }, [isSpinning]);

  const handleSpinEnd = useCallback((prize: Prize) => {
    setIsSpinning(false);
    setPrizeWon(prize);
    setLastPrize(prize);
    setStudgardState('won');
  }, []);

  const handleClosePrizeModal = useCallback(() => {
    setPrizeWon(null);
    setShowRegistration(true);
  }, []);

  const handleCloseRegistration = useCallback(() => {
    setShowRegistration(false);
    setStudgardState('idle');
  }, []);

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white px-4 py-8">
      {/* ── Background decoration ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      {/* ── Page Title ── */}
      <div className="relative z-10 mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow-sm sm:text-4xl md:text-5xl">
          ¡Gira la Ruleta!
        </h1>
        <p className="mt-2 text-base text-gray-600 sm:text-lg">
          Gira la ruleta y descubre qué carrera te espera.
        </p>
      </div>

      {/* ── Main content: Studgard + Wheel + Button ── */}
      <div className="relative z-10 flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-8">
        {/* ── Studgard Companion (left side on desktop) ── */}
        <div className="flex flex-col items-center gap-3 lg:mt-8 lg:w-40">
          <div className="relative">
            <img
              src={STUDGARD_IMAGES[studgardState]}
              alt="Stuttgart"
              className="h-24 w-auto drop-shadow-lg transition-all duration-300 sm:h-28 lg:h-32"
            />
            {/* Speech bubble */}
            <div className="absolute -right-2 -top-2 whitespace-nowrap rounded-2xl rounded-bl-none bg-white px-3 py-1.5 text-xs font-bold text-gray-800 shadow-lg sm:text-sm">
              {STUDGARD_MESSAGES[studgardState]}
              {/* Bubble tail */}
              <div className="absolute -bottom-1.5 left-2 h-3 w-3 rotate-45 bg-white" />
            </div>
          </div>
        </div>

        {/* ── Wheel + Button ── */}
        <div className="flex flex-col items-center">
          {/* Wheel — 65-75% viewport */}
          <div className="w-[65vmin] max-w-[460px]">
            <RuletaWheel
              prizes={DEFAULT_PRIZES}
              isSpinning={isSpinning}
              onSpinEnd={handleSpinEnd}
            />
          </div>

          {/* ── ¡GIRAR!! Button ── */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`btn-glow mt-8 rounded-full px-10 py-4 text-lg font-bold uppercase tracking-wider text-white shadow-xl transition-all sm:text-xl ${
              isSpinning
                ? 'cursor-not-allowed bg-gray-400 opacity-60'
                : 'bg-primary hover:scale-105 active:scale-95'
            }`}
          >
            {isSpinning ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Girando...
              </span>
            ) : (
              '¡GIRAR!!'
            )}
          </button>
        </div>
      </div>

      {/* ── Prize Modal ── */}
      {prizeWon && (
        <PrizeModal prize={prizeWon.label} onClose={handleClosePrizeModal} />
      )}

      {/* ── Registration Modal — shows after prize modal closes ── */}
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
