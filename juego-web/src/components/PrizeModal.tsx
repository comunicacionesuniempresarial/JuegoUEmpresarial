import { sound } from '../lib/sound';

interface PrizeModalProps {
  prize: string;
  onClose: () => void;
}

export function PrizeModal({ prize, onClose }: PrizeModalProps) {
  const isScholarship = prize.toLowerCase().includes('beca');
  const handleProceed = () => {
    sound.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-md animate-fade-in p-4">
      <div
        className="relative w-full max-w-md animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prize-modal-title"
      >
        {/* Dynamic Multi-Color Confetti */}
        <div className="pointer-events-none absolute inset-x-0 -top-10 overflow-hidden h-40" aria-hidden>
          <div className="confetti-particle" />
          <div className="confetti-particle" />
          <div className="confetti-particle" />
          <div className="confetti-particle" />
          <div className="confetti-particle" />
          <div className="confetti-particle" />
        </div>

        <div className="rounded-3xl border border-white/60 bg-white p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
          {/* Ambient subtle glow background */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-accent/30 blur-2xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />

          {/* Trophy Avatar */}
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-accent via-primary to-secondary text-4xl sm:text-5xl shadow-xl">
                🏆
              </div>
              <span className="absolute -bottom-2 -right-2 rounded-full bg-secondary p-1.5 text-xs text-white shadow-md animate-bounce">
                ✨
              </span>
            </div>
          </div>

          <span className={`inline-block rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider mb-2 ${
            isScholarship ? 'border-accent bg-accent/10 text-accent' : 'border-primary/20 bg-primary/10 text-primary'
          }`}>
            {isScholarship ? '¡Premio mayor!' : '¡Premio ganado!'}
          </span>

          <h2 id="prize-modal-title" className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            ¡Ganaste!
          </h2>

          {/* Prize Presentation Card */}
          <div className={`my-5 rounded-2xl border p-5 shadow-inner ${
            isScholarship
              ? 'border-accent bg-gradient-to-r from-accent/20 via-primary/10 to-secondary/10'
              : 'border-primary/20 bg-gradient-to-r from-primary/10 via-accent/15 to-secondary/10'
          }`}>
            <span className="text-xl sm:text-2xl font-black text-gray-900 block leading-tight">
              {prize}
            </span>
          </div>

          <button
            onClick={handleProceed}
            className="btn-glow flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-4 text-base font-black uppercase tracking-wider text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 hover:shadow-primary/40"
          >
            <span>Registrar</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
