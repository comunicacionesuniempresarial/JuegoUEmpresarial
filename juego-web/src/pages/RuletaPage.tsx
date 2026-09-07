import { useCallback, useState } from 'react';
import { RuletaWheel, DEFAULT_PRIZES } from '../components/RuletaWheel';
import { PrizeModal } from '../components/PrizeModal';
import { RegistrationModal } from '../components/RegistrationModal';
import { Spinner } from '../components/Spinner';
import type { Prize } from '../types';

type StuttgartState = 'idle' | 'spinning' | 'won';

const STUTTGART_MESSAGES: Record<StuttgartState, string> = {
  idle: '¡Gira la ruleta!',
  spinning: '¡Suerte!',
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
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <div className="glass-card w-full max-w-4xl p-8 flex flex-col md:flex-row items-center gap-10">
        
        {/* Panel izquierdo: Stuttgart */}
        <div className="flex flex-col items-center text-center">
            <img src={STUTTGART_IMAGES[stuttgartState]} alt="Stuttgart" className="h-40 mb-4" />
            <div className="bg-white px-4 py-2 rounded-xl shadow-md font-bold text-gray-800">
                {STUTTGART_MESSAGES[stuttgartState]}
            </div>
        </div>

        {/* Panel derecho: Ruleta */}
        <div className="flex flex-col items-center">
            <RuletaWheel
                prizes={DEFAULT_PRIZES}
                isSpinning={isSpinning}
                onSpinEnd={handleSpinEnd}
            />
            
            <button
                onClick={handleSpin}
                disabled={isSpinning}
                className={`mt-8 px-8 py-3 rounded-full font-bold text-white shadow-lg transition ${
                    isSpinning ? 'bg-gray-400' : 'bg-primary hover:bg-primary-hover'
                }`}
            >
                {isSpinning ? <span className="flex items-center gap-2"><Spinner /> Girando...</span> : '¡GIRAR!'}
            </button>
        </div>
      </div>

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