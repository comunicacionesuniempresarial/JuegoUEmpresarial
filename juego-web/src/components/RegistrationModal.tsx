import { Spinner } from './Spinner';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { sound } from '../lib/sound';

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-md animate-fade-in p-4">
      <div className="relative w-full max-w-md animate-scale-in">
        <div className="rounded-3xl border border-white/60 bg-white p-6 sm:p-8 shadow-2xl relative">
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

          {/* Header */}
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/30 to-secondary/10 text-3xl shadow-sm ring-4 ring-secondary/10">
              📝
            </div>
          </div>
          <h2 className="mb-1 text-center text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Registra tu Participación
          </h2>
          <p className="mb-5 text-center text-xs sm:text-sm text-gray-500">
            {resultado ? (
              <>
                Resultado obtenido:{' '}
                <span className="font-extrabold text-teal-800 bg-secondary/15 px-2 py-0.5 rounded-md">
                  {resultado}
                </span>
              </>
            ) : (
              'Ingresa tus datos para validar tu récord o premio'
            )}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* ── Nombre ── */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="reg-nombre" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Nombre completo
                </label>
                {isNameValid && (
                  <span className="text-xs font-bold text-teal-800 flex items-center gap-0.5">
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
                    ? 'border-teal-400 bg-teal-50/30 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
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
                  <span className="text-xs font-bold text-teal-800 flex items-center gap-0.5">
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
                    ? 'border-teal-400 bg-teal-50/30 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                    : 'border-gray-200 bg-gray-50 focus:border-secondary focus:bg-white focus:ring-2 focus:ring-secondary/20'
                }`}
              />
              {fieldErrors.telefono && (
                <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.telefono}</p>
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
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-secondary focus:ring-secondary accent-secondary cursor-pointer"
              />
              <span className="text-xs leading-relaxed text-gray-600 group-hover:text-gray-800 transition-colors">
                Autorizo a Uniempresarial para el tratamiento de mis datos personales según la{' '}
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
                  : 'bg-gradient-to-r from-secondary to-teal-500 text-gray-950 hover:scale-[1.02] active:scale-95 hover:shadow-teal-500/30'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="h-4 w-4" />
                  Guardando registro...
                </span>
              ) : (
                '✅ Guardar y Completar'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ── Success Toast ── */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 z-[200] -translate-x-1/2 animate-scale-in">
          <div className="flex items-center gap-3 rounded-full bg-slate-900 border border-secondary/50 px-6 py-4 text-sm font-bold text-white shadow-2xl backdrop-blur-md">
            <span className="text-lg">🎉</span>
            <span>¡Registro guardado con éxito en Uniempresarial!</span>
          </div>
        </div>
      )}
    </div>
  );
}
