import { useNavigate } from 'react-router-dom';
import { sound } from '../lib/sound';

export function LandingPage() {
  const navigate = useNavigate();

  const handlePlayGame = (path: string) => {
    sound.playClick();
    navigate(path);
  };

  return (
    <div className="relative overflow-hidden bg-[#f7f3ed] text-slate-800 h-full w-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none">
      {/* Dynamic Animated Ambient Background Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[450px] w-[450px] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 -right-32 h-[450px] w-[450px] rounded-full bg-secondary/10 blur-[130px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute -bottom-32 left-1/3 h-[400px] w-[400px] rounded-full bg-accent/15 blur-[140px] animate-pulse" style={{ animationDelay: '2.5s' }} />
      </div>

      {/* Top Hero Section */}
      <div className="relative z-10 mx-auto max-w-4xl text-center shrink-0">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-3.5 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur-md mb-2 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          ¡Experiencia Universitaria Uniempresarial! 🎓
        </div>

        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
          ¿Dónde Está <span className="text-primary">Stuttgart</span>?
        </h1>

        <p className="mt-2 text-xs sm:text-sm lg:text-base text-slate-600 font-normal max-w-xl mx-auto">
          Acepta el reto, gana premios y demuestra tu agilidad visual junto a Stuttgart.
        </p>
      </div>

      {/* 2 Dynamic Game Selection Cards (Flex-1 to fit screen without scrolling) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto w-full my-auto flex-1 items-center max-h-[64vh]">
        {/* Card 1: Ruleta */}
        <div
          onClick={() => handlePlayGame('/ruleta')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-[#eadfd2] bg-white/80 p-4 sm:p-6 backdrop-blur-xl shadow-[0_18px_50px_rgba(100,70,40,0.10)] transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:bg-white flex flex-col justify-between h-full max-h-[58vh]"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-60" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="rounded-xl bg-primary/10 border border-primary/20 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-primary">
                Pon a prueba tu suerte
              </span>
              <span className="text-2xl group-hover:rotate-45 transition-transform duration-300">🎡</span>
            </div>

            <div className="flex justify-center my-2 sm:my-3">
              <div className="relative">
                <img
                  src="/images/stuttgart-sonriente.png"
                  alt="Stuttgart Ruleta"
                  className="h-28 sm:h-36 lg:h-44 w-auto object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1.5 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-sm">🎯</span>
                </div>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">
              Gira y gana
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 line-clamp-2">
              Pon a prueba tu suerte y descubre qué premio te espera.
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">7 premios en juego</span>
            <button
              type="button"
              className="btn-glow inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs sm:text-sm font-black text-white shadow-lg group-hover:bg-primary-hover group-hover:shadow-primary/50 transition-all"
            >
              <span>¡JUGAR RULETA!</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>

        {/* Card 2: Búsqueda */}
        <div
          onClick={() => handlePlayGame('/busqueda')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-[#eadfd2] bg-white/80 p-4 sm:p-6 backdrop-blur-xl shadow-[0_18px_50px_rgba(100,70,40,0.10)] transition-all duration-300 hover:scale-[1.02] hover:border-secondary/50 hover:bg-white flex flex-col justify-between h-full max-h-[58vh]"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-secondary/20 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-60" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="rounded-xl bg-secondary/10 border border-secondary/20 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-secondary">
                Reto visual
              </span>
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🔍</span>
            </div>

            <div className="flex justify-center my-2 sm:my-3">
              <div className="relative">
                <img
                    src="/images/stuttgart-investigador.png"
                    alt="Stuttgart Investigador"
                  className="h-28 sm:h-36 lg:h-44 w-auto rounded-2xl object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute -bottom-1 -right-1 rounded-full bg-secondary p-1.5 shadow-lg group-hover:scale-110 transition-transform text-white">
                  <span className="text-sm">⏱️</span>
                </div>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-secondary transition-colors">
              Encuentra a Stuttgart
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 line-clamp-2">
              Stuttgart se escondió en la imagen. Encuéntralo rápido y supera tu propio récord.
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Contrarreloj</span>
            <button
              type="button"
              className="btn-glow inline-flex items-center gap-1.5 rounded-full bg-secondary px-5 py-2 text-xs sm:text-sm font-black text-gray-950 shadow-lg group-hover:bg-secondary-hover group-hover:shadow-secondary/50 transition-all"
            >
              <span>¡BUSCAR AHORA!</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Banner Info (Always visible, single line) */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 px-2 shrink-0">
        <span>⚡ 7 premios para ganar</span>
        <span>Uniempresarial · Juego para estudiantes</span>
        <span>🏆 Diseñado para jugar en equipo</span>
      </div>
    </div>
  );
}
