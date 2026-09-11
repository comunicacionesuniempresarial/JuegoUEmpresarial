import { useNavigate } from 'react-router-dom';
import { sound } from '../lib/sound';

interface ChallengeCardProps {
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  imageAlt: string;
  action: string;
  meta: string;
  icon: string;
  accent: 'roulette' | 'search';
  onClick: () => void;
}

function ChallengeCard({
  title,
  eyebrow,
  description,
  image,
  imageAlt,
  action,
  meta,
  icon,
  accent,
  onClick,
}: ChallengeCardProps) {
  const isRoulette = accent === 'roulette';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex min-h-[300px] w-full flex-col overflow-hidden rounded-[2rem] border p-5 text-left shadow-[0_24px_60px_rgba(13,27,62,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_72px_rgba(13,27,62,0.2)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 sm:min-h-[360px] sm:p-7 ${
        isRoulette
          ? 'border-primary/30 bg-[linear-gradient(145deg,#fffdfa_0%,#fff0ef_60%,#ffe0e0_100%)] focus-visible:ring-primary/50'
          : 'border-secondary/30 bg-[linear-gradient(145deg,#feffff_0%,#eef8fb_58%,#d7eef5_100%)] focus-visible:ring-secondary/50'
      }`}
    >
      <span
        className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl transition duration-500 group-hover:scale-125 ${
          isRoulette ? 'bg-primary/20' : 'bg-secondary/20'
        }`}
      />
      <span
        className={`pointer-events-none absolute -bottom-28 -left-20 h-56 w-56 rounded-full blur-3xl ${
          isRoulette ? 'bg-accent/20' : 'bg-primary/10'
        }`}
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <span
          className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] ${
            isRoulette
              ? 'border-primary/30 bg-white/80 text-primary'
              : 'border-secondary/30 bg-white/80 text-secondary'
          }`}
        >
          {eyebrow}
        </span>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-xl shadow-sm transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
          {icon}
        </span>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center py-2">
        <div className="relative">
          <div
            className={`absolute inset-6 rounded-full blur-2xl ${
              isRoulette ? 'bg-primary/20' : 'bg-secondary/20'
            }`}
          />
          <img
            src={image}
            alt={imageAlt}
            className="relative h-40 w-auto object-contain drop-shadow-[0_18px_20px_rgba(13,27,62,0.22)] transition duration-500 group-hover:scale-110 sm:h-52"
          />
          <span
            className={`absolute -right-1 bottom-2 flex h-11 w-11 items-center justify-center rounded-2xl text-lg text-white shadow-lg ${
              isRoulette ? 'bg-gradient-to-br from-primary to-accent' : 'bg-gradient-to-br from-secondary to-primary'
            }`}
          >
            {isRoulette ? '🎁' : '⏱️'}
          </span>
        </div>
      </div>

      <div className="relative z-10">
        {meta && <p className={`text-xs font-bold ${isRoulette ? 'text-primary/70' : 'text-secondary/70'}`}>{meta}</p>}
        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">{description}</p>

        <span
          className={`mt-5 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-lg transition duration-300 group-hover:translate-x-1 ${
            isRoulette
              ? 'bg-gradient-to-r from-primary via-accent to-primary shadow-primary/40'
              : 'bg-gradient-to-r from-secondary to-primary shadow-secondary/40'
          }`}
        >
          {action}
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </button>
  );
}

export function LandingPage() {
  const navigate = useNavigate();

  const handlePlayGame = (path: string) => {
    sound.playClick();
    navigate(path);
  };

  return (
    <div className="relative flex min-h-full w-full select-none flex-col overflow-y-auto bg-[radial-gradient(circle_at_8%_10%,#ffe0e0_0,transparent_28%),radial-gradient(circle_at_92%_14%,#e0f0fa_0,transparent_28%),linear-gradient(145deg,#F8FAFC_0%,#fff7ed_48%,#f2fbfa_100%)] px-3 py-4 text-slate-800 sm:px-7 sm:py-7 lg:overflow-hidden lg:px-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-28 bottom-0 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-secondary/10 blur-[110px]" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-6xl text-center">
        <h1 className="mt-2 text-[clamp(2rem,8vw,4.5rem)] font-black leading-[0.95] tracking-[-0.055em] text-slate-950">
          Elige tu próximo <span className="pr-1 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">reto</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Gira por premios o reta tu tiempo.
        </p>
      </section>

      <section className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-4 py-5 md:grid-cols-2 md:gap-7 lg:py-7">
        <ChallengeCard
          accent="roulette"
          eyebrow="Premios en juego"
          icon="🎡"
          image="/images/stuttgart-ruleta.png"
          imageAlt="Stuttgart con la ruleta de premios"
          meta=""
          title="Gira y gana"
          description="Gira y descubre qué premio ganas."
          action="Jugar ruleta"
          onClick={() => handlePlayGame('/ruleta')}
        />
        <ChallengeCard
          accent="search"
          eyebrow="Reto contrarreloj"
          icon="🔎"
          image="/images/stuttgart-investigador.png"
          imageAlt="Stuttgart investigador"
          meta=""
          title="Encuentra a Stuttgart"
          description="Busca Stuttgart y marca tu mejor tiempo."
          action="Comenzar búsqueda"
          onClick={() => handlePlayGame('/busqueda')}
        />
      </section>
    </div>
  );
}
