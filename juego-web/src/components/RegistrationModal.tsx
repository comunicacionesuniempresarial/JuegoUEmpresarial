import { Spinner } from './Spinner';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { sound } from '../lib/sound';
import type { CarreraPregrado } from '../lib/validations';

const CARRERAS: CarreraPregrado[] = [
  'Ingeniería de Software',
  'Marketing',
  'Administración de Empresas',
  'Negocios Internacionales',
  'Finanzas y Comercio Exterior',
  'Negocios Turísticos y Hoteleros',
  'Ingeniería Industrial',
];

interface RegistrationModalProps {
  /** Which game triggered this registration */
  juego: 'ruleta' | 'busqueda';
  /** Optional result text (prize label or time) */
  resultado?: string;
  /** Called after successful registration OR on close */
  onClose: () => void;
}

export function RegistrationModal({ juego, resultado, onClose }: RegistrationModalProps) {
  const {
    nombre,
    setNombre,
    telefono,
    setTelefono,
    correo,
    setCorreo,
    carrera,
    setCarrera,
    showCarreras,
    setShowCarreras,
    consent,
    setConsent,
    fieldErrors,
    showToast,
    isSubmitting,
    submitError,
    handleSubmit,
    validateField,
  } = useRegistrationForm({
    juego,
    resultado,
    onSuccess: () => {
      sound.playVictory();
      setTimeout(onClose, 1200);
    },
  });

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  const isNameValid = nombre.trim().length >= 2 && !fieldErrors.nombre;
  const isPhoneValid = /^\+?57[0-9]{10}$|^3[0-9]{9}$/.test(telefono.trim()) && !fieldErrors.telefono;
  const isEmailValid = correo === '' || (correo.includes('@') && !fieldErrors.correo);

  const toggleCarreras = () => {
    sound.playClick();
    setShowCarreras(!showCarreras);
  };

  const selectCarrera = (c: CarreraPregrado) => {
    sound.playClick();
    setCarrera(c);
    setShowCarreras(false);
    validateField('carrera', c);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-md animate-fade-in p-4">
      <div className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md animate-scale-in overflow-y-auto overscroll-contain">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="registration-modal-title"
          className="relative rounded-3xl border border-white/60 bg-white p-6 shadow-2xl sm:p-8"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Cerrar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Winner celebration */}
          <div className="relative mb-3 flex justify-center">
            <div className="absolute bottom-1 h-8 w-32 rounded-full bg-orange-300/30 blur-xl" />
            <img
              src="/images/stuttgart-ganador.png"
              alt="Stuttgart celebrando tu victoria"
              decoding="async"
              className="stuttgart-celebration relative z-10 h-28 w-auto object-contain drop-shadow-[0_12px_12px_rgba(74,53,28,0.25)]"
            />
            <span className="absolute right-[calc(50%-4.5rem)] top-0 z-20 animate-bounce text-2xl" aria-hidden="true">✨</span>
            <span className="absolute left-[calc(50%-5.5rem)] top-5 z-20 animate-pulse text-xl" aria-hidden="true">🎉</span>
          </div>
          <h2 id="registration-modal-title" className="mb-1 text-center text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Registrar premio
          </h2>
          {resultado && (
            <p className="mb-5 text-center text-sm text-gray-500">
              <span className="font-extrabold text-primary bg-accent/15 px-2 py-0.5 rounded-md">{resultado}</span>
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* ── Nombre ── */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="reg-nombre" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Nombre completo
                </label>
                {isNameValid && (
                  <span className="text-xs font-bold text-primary flex items-center gap-0.5">
                    ✓ Válido
                  </span>
                )}
              </div>
              <input
                id="reg-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onBlur={() => validateField('nombre', nombre)}
                placeholder="Ej. Carlos Mendoza"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
                  fieldErrors.nombre
                    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : isNameValid
                    ? 'border-primary bg-primary/5 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    : 'border-gray-200 bg-gray-50 focus:border-secondary focus:bg-white focus:ring-2 focus:ring-secondary/20'
                }`}
              />
              {fieldErrors.nombre && (
                <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.nombre}</p>
              )}
            </div>

            {/* ── Teléfono ── */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="reg-telefono" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Teléfono de contacto
                </label>
                {isPhoneValid && (
                  <span className="text-xs font-bold text-primary flex items-center gap-0.5">
                    ✓ Válido
                  </span>
                )}
              </div>
              <input
                id="reg-telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                onBlur={() => validateField('telefono', telefono)}
                placeholder="Ej. 3001234567"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
                  fieldErrors.telefono
                    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : isPhoneValid
                    ? 'border-primary bg-primary/5 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    : 'border-gray-200 bg-gray-50 focus:border-secondary focus:bg-white focus:ring-2 focus:ring-secondary/20'
                }`}
              />
              {fieldErrors.telefono && (
                <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.telefono}</p>
              )}
            </div>

            {/* ── Correo (Opcional) ── */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="reg-correo" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Correo electrónico <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                {isEmailValid && correo && (
                  <span className="text-xs font-bold text-primary flex items-center gap-0.5">
                    ✓ Válido
                  </span>
                )}
              </div>
              <input
                id="reg-correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                onBlur={() => validateField('correo', correo)}
                placeholder="Ej. estudiante@uniempresarial.edu.co"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
                  fieldErrors.correo
                    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : correo && isEmailValid
                    ? 'border-primary bg-primary/5 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    : 'border-gray-200 bg-gray-50 focus:border-secondary focus:bg-white focus:ring-2 focus:ring-secondary/20'
                }`}
              />
              {fieldErrors.correo && (
                <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.correo}</p>
              )}
            </div>

            {/* ── Carrera (Expandible) ── */}
            <div>
              <button
                type="button"
                onClick={toggleCarreras}
                className="w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm outline-none transition-all bg-gray-50 hover:bg-gray-100"
                aria-expanded={showCarreras}
              >
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Carrera de pregrado <span className="text-gray-400 font-normal">(opcional)</span>
                </span>
                <span className={`flex items-center gap-1 text-gray-500 transition-transform ${showCarreras ? 'rotate-180' : ''}`}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  {carrera && (
                    <span className="text-xs font-medium text-primary">{carrera}</span>
                  )}
                </span>
              </button>

              {showCarreras && (
                <div className="mt-2 animate-fade-in">
                  <div className="grid grid-cols-2 gap-2">
                    {CARRERAS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => selectCarrera(c)}
                        className={`w-full text-left rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                          carrera === c
                            ? 'border-primary bg-primary/5 text-primary shadow-[0_0_0_2px_rgba(239,18,24,0.15)]'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-secondary/50 hover:bg-gray-50'
                        }`}
                        aria-pressed={carrera === c}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  {carrera && (
                    <p className="mt-2 text-xs text-primary font-medium">
                      Seleccionado: {carrera}
                    </p>
                  )}
                </div>
              )}
              {fieldErrors.carrera && (
                <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.carrera}</p>
              )}
            </div>

            {/* ── Consentimiento ── */}
            <label className="flex items-start gap-3 cursor-pointer select-none group bg-gray-50/80 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  validateField('consent', e.target.checked);
                }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
              />
              <span className="text-xs leading-relaxed text-gray-600 group-hover:text-gray-800 transition-colors">
                Acepto la{' '}
                <a
                  href="https://uniempresarial.edu.co/wp-content/uploads/2026/08/Tratamiento-de-Datos-Personales.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-primary underline hover:text-primary-hover"
                >
                  Política de Privacidad
                </a>
                .
              </span>
            </label>
            {fieldErrors.consent && (
              <p className="text-xs text-red-500 font-medium">{fieldErrors.consent}</p>
            )}

            {/* ── Server error ── */}
            {submitError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600 font-medium">
                ⚠️ Error al registrar: {submitError}
              </div>
            )}

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={!consent || isSubmitting}
              className={`btn-glow w-full rounded-full py-4 text-sm font-extrabold uppercase tracking-wider text-white shadow-xl transition-all ${
                !consent || isSubmitting
                  ? 'cursor-not-allowed bg-gray-300 opacity-60'
                  : 'bg-gradient-to-r from-primary to-accent text-gray-950 hover:scale-[1.02] active:scale-95 hover:shadow-primary/30'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="h-4 w-4" />
                  Guardando registro...
                </span>
              ) : (
                '✅ Guardar'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ── Success Toast ── */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 z-[200] -translate-x-1/2 animate-scale-in">
          <div className="flex items-center gap-3 rounded-full bg-slate-900 border border-primary/50 px-6 py-4 text-sm font-bold text-white shadow-2xl backdrop-blur-md">
            <span className="text-lg">🎉</span>
            <span>¡Registro guardado con éxito en Uniempresarial!</span>
          </div>
        </div>
      )}
    </div>
  );
}
