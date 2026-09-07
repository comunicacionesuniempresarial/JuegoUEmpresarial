import { useCallback, useState } from 'react';
import { registrationSchema, type RegistrationInput } from '../lib/validations';
import { useRegistration } from '../hooks/useRegistration';

interface RegistrationModalProps {
  /** Which game triggered this registration */
  juego: 'ruleta' | 'busqueda';
  /** Optional result text (prize label or time) */
  resultado?: string;
  /** Called after successful registration OR on close */
  onClose: () => void;
}

/**
 * Modal form for collecting player registration data.
 *
 * Validates name (≥2 chars), phone (+57XXXXXXXXX), and consent.
 * On success inserts into Supabase `records` table and shows a toast.
 */
export function RegistrationModal({ juego, resultado, onClose }: RegistrationModalProps) {
  const { submit, isSubmitting, error: submitError } = useRegistration();

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegistrationInput, string>>>({});
  const [showToast, setShowToast] = useState(false);

  // ── Validate single field on blur ──
  const validateField = useCallback(
    (field: keyof RegistrationInput, value: unknown) => {
      const partial = { nombre, telefono, consent, juego, resultado, [field]: value };
      const result = registrationSchema.safeParse(partial);
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path.includes(field));
        setFieldErrors((prev) => ({ ...prev, [field]: issue?.message ?? '' }));
      } else {
        setFieldErrors((prev) => ({ ...prev, [field]: '' }));
      }
    },
    [nombre, telefono, consent, juego, resultado],
  );

  // ── Submit handler ──
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldErrors({});

      const result = registrationSchema.safeParse({ nombre, telefono, consent, juego, resultado });
      if (!result.success) {
        const errors: typeof fieldErrors = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0] as keyof RegistrationInput;
          if (!errors[field]) errors[field] = issue.message;
        }
        setFieldErrors(errors);
        return;
      }

      const ok = await submit(result.data);
      if (ok) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          onClose();
        }, 2000);
      }
    },
    [nombre, telefono, consent, juego, resultado, submit, onClose],
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[10px] animate-fade-in">
      <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Cerrar"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/20 text-2xl shadow-sm">
            📝
          </div>
        </div>
        <h2 className="mb-1 text-center text-2xl font-extrabold text-gray-900">
          Regístrate
        </h2>
        <p className="mb-5 text-center text-sm text-gray-500">
          Completa tus datos para participar
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* ── Nombre ── */}
          <div>
            <label htmlFor="reg-nombre" className="mb-1 block text-sm font-semibold text-gray-700">
              Nombre
            </label>
            <input
              id="reg-nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={() => validateField('nombre', nombre)}
              placeholder="Tu nombre completo"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${
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
            <label htmlFor="reg-telefono" className="mb-1 block text-sm font-semibold text-gray-700">
              Teléfono
            </label>
            <input
              id="reg-telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              onBlur={() => validateField('telefono', telefono)}
              placeholder="3001234567"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${
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
              onChange={(e) => {
                setConsent(e.target.checked);
                validateField('consent', e.target.checked);
              }}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-secondary focus:ring-secondary"
            />
            <span className="text-xs leading-relaxed text-gray-600">
              Acepto el tratamiento de mis datos personales de acuerdo con la{' '}
              <a href="/politicas" target="_blank" rel="noopener noreferrer" className="underline text-secondary hover:text-secondary-hover">
                Política de Privacidad
              </a>
              .
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
            className={`w-full rounded-full px-6 py-3 text-base font-bold text-white shadow-lg transition-all ${
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
  );
}
