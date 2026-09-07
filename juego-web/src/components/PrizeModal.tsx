interface PrizeModalProps {
  prize: string;
  onClose: () => void;
}

export function PrizeModal({ prize, onClose }: PrizeModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-scale-in">
        {/* Confetti decoration */}
        <div className="mb-4 flex justify-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-hover text-4xl shadow-lg">
              🎉
            </div>
            {/* Sparkle dots */}
            <div className="absolute -left-2 -top-2 h-3 w-3 rounded-full bg-primary animate-pulse" />
            <div className="absolute -right-1 top-0 h-2 w-2 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="absolute -bottom-1 left-0 h-2.5 w-2.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0.6s' }} />
          </div>
        </div>

        <h2 className="mb-2 text-center text-2xl font-extrabold text-gray-900">
          ¡Felicidades!
        </h2>
        <p className="mb-4 text-center text-base text-gray-600">
          Has ganado:
        </p>

        {/* Prize display */}
        <div className="mb-6 rounded-xl bg-gradient-to-r from-primary/10 via-accent/20 to-secondary/10 px-6 py-5 text-center shadow-inner">
          <span className="text-2xl font-extrabold text-primary">{prize}</span>
        </div>

        {/* Studgard thumbs up */}
        <div className="mb-4 flex justify-center">
          <img
            src="/images/studgard-thumbs-up.png"
            alt="Stuttgart"
            className="h-16 w-auto drop-shadow-md"
          />
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-full bg-primary px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 hover:bg-primary-hover"
        >
          ¡Genial!
        </button>
      </div>
    </div>
  );
}
