import { sound } from '../lib/sound';

interface PrizeModalProps {
  prize: string;
  onClose: () => void;
}

export function PrizeModal({ prize, onClose }: PrizeModalProps) {
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
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-accent via-orange-400 to-primary text-4xl sm:text-5xl shadow-xl">
                🏆
              </div>
              <span className="absolute -bottom-2 -right-2 rounded-full bg-secondary p-1.5 text-xs text-white shadow-md animate-bounce">
                ✨
              </span>
            </div>
          </div>

          <span className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary mb-2">
            ¡Resultado Oficial!
          </span>

          <h2 id="prize-modal-title" className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            ¡Felicidades! 🎉
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Tu premio es:
          </p>

          {/* Prize Presentation Card */}
          <div className="my-5 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/25 to-secondary/15 p-5 border border-primary/20 shadow-inner">
            <span className="text-xl sm:text-2xl font-black text-gray-900 block leading-tight">
              {prize}
            </span>
            <span className="mt-1 inline-block text-xs font-semibold text-gray-600">
              Premio oficial del juego Uniempresarial
            </span>
          </div>

          {/* Stuttgart Mascot Cheer */}
          <div className="mb-5 flex items-center justify-center gap-3 bg-gray-50 rounded-2xl p-2.5 border border-gray-100">
            <img
              src="/images/stuttgart-ganador.png"
              alt="Stuttgart"
              className="h-16 w-auto drop-shadow-md animate-bounce-in"
            />
            <p className="text-xs font-semibold text-gray-600 text-left">
              ¡Excelente elección! Ahora regístrate para validar tu premio y participar.
            </p>
          </div>

          <button
            onClick={handleProceed}
            className="btn-glow flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-orange-500 px-6 py-4 text-base font-black uppercase tracking-wider text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 hover:shadow-primary/40"
          >
            <span>Continuar y Registrar</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
