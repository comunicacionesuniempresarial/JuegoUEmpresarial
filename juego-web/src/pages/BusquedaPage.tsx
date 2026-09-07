import { useCallback, useEffect, useState } from 'react';
import { useElapsedTimer } from '../hooks/useElapsedTimer';
import { useRegistration } from '../hooks/useRegistration';
import { registrationSchema } from '../lib/validations';

// ── Career images ──────────────────────────────────────────
const CAREER_IMAGES: { src: string; alt: string }[] = [
  { src: '/images/Administración de Empresas.png', alt: 'Administración de Empresas' },
  { src: '/images/Finanzas y Comercio Exterior.png', alt: 'Finanzas y Comercio Exterior' },
  { src: '/images/ING INDUSTRIAL.png', alt: 'Ingeniero Industrial' },
  { src: '/images/ING SOFTWARE.png', alt: 'Ingeniería de Software' },
  { src: '/images/Marketing.png', alt: 'Marketing' },
  { src: '/images/Negocios Internacionales.png', alt: 'Negocios Internacionales' },
  { src: '/images/Negocios Turísticos y Hoteleros.png', alt: 'Negocios Turísticos y Hoteleros' },
];

const STUTTGART_IMAGE = '/images/Stuttgard girando ruleta/Stuttgart Ruleta.jpg';

// ── Studgard states ────────────────────────────────────────
type StudgardState = 'idle' | 'searching' | 'found';

const STUDGARD_MESSAGES: Record<StudgardState, string> = {
  idle: '¡Busca a Stuttgart!',
  searching: '¡Rápido, encontrá a Stuttgart!',
  found: '¡Lo encontraste! Increíble!',
};

const STUDGARD_IMAGES: Record<StudgardState, string> = {
  idle: '/images/studgard-pointing.png',
  searching: '/images/studgard-open.png',
  found: '/images/studgard-thumbs-up.png',
};

// ── Random index selector ─────────────────────────────────
function getRandomIndex(excluding: number | null = null): number {
  let index;
  do {
    index = Math.floor(Math.random() * CAREER_IMAGES.length);
  } while (index === excluding && CAREER_IMAGES.length > 1);
  return index;
}

// ── Component ──────────────────────────────────────────────
export function BusquedaPage() {
  const timer = useElapsedTimer();
  const { submit, isSubmitting, error: submitError } = useRegistration();

  // Random current image — different each time we restart
  const [currentImageIndex, setCurrentImageIndex] = useState(() => getRandomIndex());

  const [hasFound, setHasFound] = useState(false);

  // ── Registration form state ──
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});
  const [showToast, setShowToast] = useState(false);

  // Start timer on mount
  useEffect(() => {
    timer.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  // Studgard state
  const studgardState: StudgardState = hasFound ? 'found' : timer.isRunning ? 'searching' : 'idle';

  const handleFound = useCallback(() => {
    if (hasFound) return;
    timer.stop();
    setHasFound(true);
  }, [hasFound, timer]);

  const handlePlayAgain = useCallback(() => {
    // Pick a DIFFERENT image than the current one
    setCurrentImageIndex(prev => getRandomIndex(prev));
    setHasFound(false);
    // Reset form
    setNombre('');
    setTelefono('');
    setConsent(false);
    setFieldErrors({});
    // Atomic reset + restart to avoid stale closure issues
    timer.restart();
  }, [timer]);

  const handleGoHome = useCallback(() => {
    window.location.href = '/';
  }, []);

  // ── Registration submit ──
  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldErrors({});

      const result = registrationSchema.safeParse({
        nombre,
        telefono,
        consent,
        juego: 'busqueda',
        resultado: timer.formatted,
      });

      if (!result.success) {
        const errors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0] as string;
          if (!errors[field]) errors[field] = issue.message;
        }
        setFieldErrors(errors);
        return;
      }

      const ok = await submit(result.data);
      if (ok) {
        setShowToast(true);
        // After 2s, hide toast and show play again buttons
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
      }
    },
    [nombre, telefono, consent, timer.formatted, submit],
  );

  const currentImage = CAREER_IMAGES[currentImageIndex];

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] flex-col px-2 py-2 sm:px-6 lg:px-8">
      {/* ── Header + Timer (top row, side by side) ──── */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex-1">
          <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
            ¡Busca a Stuttgart!
          </h1>
          <p className="text-xs text-gray-600 sm:text-sm">
            Stuttgart está escondido. ¡Encontrálo rápido!
          </p>
        </div>
        <div className="rounded-full bg-gray-900 px-4 py-1.5 shadow-lg">
          <span className="font-mono text-xl font-bold tracking-widest text-secondary sm:text-2xl">
            {timer.formatted}
          </span>
        </div>
      </div>

      {/* ── Main row: Image (left, big) + Button (right) ── */}
      <div className="flex flex-1 flex-col items-stretch gap-4 lg:flex-row">
        {/* ── Large Image (left, takes most space) ──── */}
        <div className="relative flex flex-1 items-center justify-center">
          <div
            className={`group relative overflow-hidden rounded-2xl border-4 transition-all duration-300 ${
              hasFound
                ? 'border-primary shadow-2xl'
                : 'border-transparent shadow-xl hover:shadow-primary/20'
            }`}
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 12rem)',
              width: 'fit-content',
              height: 'fit-content',
            }}
          >
            {/* Career Image - scales to fit without cropping */}
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="block max-h-[calc(100vh-5rem)] max-w-full object-contain"
              draggable={false}
            />

            {/* Stuttgart Overlay - hidden until found, then dramatic reveal */}
            {hasFound && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="animate-pulse text-center">
                  <img
                    src={STUTTGART_IMAGE}
                    alt="Stuttgart"
                    className="mx-auto h-32 w-auto shadow-xl drop-shadow-2xl sm:h-40"
                    style={{
                      filter: 'drop-shadow(0 0 30px rgba(255, 107, 107, 0.8))',
                    }}
                  />
                  <p className="mt-4 text-xl font-bold text-white">¡Estaba aquí!</p>
                </div>
              </div>
            )}

            {/* Immersive hover hint */}
            {!hasFound && (
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white/80 drop-shadow-lg">
                    Mirá con atención... 🔍
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right side: Button + Studgard (no scroll needed) ── */}
        <div className="flex flex-col items-center justify-center gap-4 lg:w-72 lg:items-stretch">
          {/* Studgard companion */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={STUDGARD_IMAGES[studgardState]}
              alt="Stuttgart"
              className="h-20 w-auto sm:h-24"
            />
            <p className="rounded-lg bg-white px-3 py-2 text-center text-sm font-semibold text-gray-700 shadow-md">
              {STUDGARD_MESSAGES[studgardState]}
            </p>
          </div>

          {/* "¡LO ENCONTRÉ!!" Button */}
          <button
            onClick={handleFound}
            disabled={hasFound}
            className={`btn-glow rounded-2xl px-6 py-6 text-lg font-bold uppercase tracking-wider text-white shadow-xl transition-all sm:text-xl ${
              hasFound
                ? 'cursor-not-allowed bg-gray-400 opacity-60'
                : 'bg-primary hover:scale-105 active:scale-95'
            }`}
          >
            ¡LO ENCONTRÉ!!
          </button>

          {!hasFound && (
            <p className="text-center text-xs text-gray-500">
              Haz clic solo cuando lo encuentres
            </p>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
         RESULT MODAL — Integrated registration + result
         ════════════════════════════════════════════════════ */}
      {hasFound && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in overflow-y-auto py-4">
          <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scale-in sm:p-8">
            {/* ── Confetti decoration ── */}
            <div className="mb-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-3xl shadow-md">
                🎉
              </div>
            </div>

            <h2 className="mb-1 text-center text-xl font-extrabold text-gray-900 sm:text-2xl">
              ¡Encontraste a Stuttgart!
            </h2>
            <p className="mb-3 text-center text-sm text-gray-600">
              Tu tiempo fue:
            </p>

            {/* ── Time display ── */}
            <div className="mb-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-3 text-center">
              <span className="font-mono text-2xl font-bold tracking-widest text-primary sm:text-3xl">
                {timer.formatted}
              </span>
            </div>

            {/* ── Performance feedback ── */}
            <p className="mb-4 text-center text-xs text-gray-500 sm:text-sm">
              {timer.elapsedMs < 10_000
                ? '¡Increíble! Eres un ojo de halcón 🦅'
                : timer.elapsedMs < 30_000
                  ? '¡Buen trabajo! No estuvo mal 👏'
                  : '¡Lo lograste! Nada mal 💪'}
            </p>

            {/* ═══ REGISTRATION FORM (inline, mandatory) ═══ */}
            <form onSubmit={handleRegister} noValidate className="space-y-3 border-t border-gray-100 pt-4">
              <p className="text-center text-sm font-semibold text-gray-700">
                📝 Regístrate para continuar
              </p>

              {/* ── Nombre ── */}
              <div>
                <label htmlFor="reg-nombre" className="mb-1 block text-xs font-semibold text-gray-700">
                  Nombre
                </label>
                <input
                  id="reg-nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre completo"
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition-colors ${
                    fieldErrors.nombre
                      ? 'border-red-400 bg-red-50 focus:border-red-500'
                      : 'border-gray-300 focus:border-secondary focus:ring-2 focus:ring-secondary/20'
                  }`}
                />
                {fieldErrors.nombre && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.nombre}</p>
                )}
              </div>

              {/* ── Teléfono ── */}
              <div>
                <label htmlFor="reg-telefono" className="mb-1 block text-xs font-semibold text-gray-700">
                  Teléfono
                </label>
                <input
                  id="reg-telefono"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="3001234567"
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition-colors ${
                    fieldErrors.telefono
                      ? 'border-red-400 bg-red-50 focus:border-red-500'
                      : 'border-gray-300 focus:border-secondary focus:ring-2 focus:ring-secondary/20'
                  }`}
                />
                {fieldErrors.telefono && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.telefono}</p>
                )}
              </div>

              {/* ── Consentimiento ── */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-secondary focus:ring-secondary"
                />
                <span className="text-xs leading-relaxed text-gray-600">
                  Acepto el tratamiento de mis datos de acuerdo con la{' '}
                  <a href="/politicas" target="_blank" rel="noopener noreferrer" className="underline text-secondary hover:text-secondary-hover">
                    Política de Privacidad
                  </a>.
                </span>
              </label>
              {fieldErrors.consent && (
                <p className="text-xs text-red-500">{fieldErrors.consent}</p>
              )}

              {/* ── Server error ── */}
              {submitError && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                  Error al registrar: {submitError}
                </div>
              )}

              {/* ── Submit ── */}
              <button
                type="submit"
                disabled={!consent || isSubmitting}
                className={`w-full rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all ${
                  !consent || isSubmitting
                    ? 'cursor-not-allowed bg-gray-400 opacity-60'
                    : 'bg-secondary hover:scale-[1.02] active:scale-95 hover:bg-secondary-hover'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  'REGISTRAR'
                )}
              </button>
            </form>

            {/* ── Action buttons (after registration) ── */}
            <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
              <button
                onClick={handlePlayAgain}
                className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                🎮 Jugar de nuevo
              </button>
              <button
                onClick={handleGoHome}
                className="w-full rounded-full border-2 border-gray-300 bg-white px-6 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
              >
                🏠 Volver al menú
              </button>
            </div>
          </div>

          {/* ── Success Toast ── */}
          {showToast && (
            <div className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 animate-fade-in">
              <div className="flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-xl">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                ¡Registrado!
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
