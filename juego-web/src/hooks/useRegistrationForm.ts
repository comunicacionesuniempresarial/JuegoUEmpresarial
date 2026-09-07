import { useCallback, useState } from 'react';
import { registrationSchema } from '../lib/validations';
import { useRegistration } from './useRegistration';

type FieldKey = 'nombre' | 'telefono' | 'consent';

interface UseRegistrationFormOptions {
  /** Which game triggered this registration */
  juego: 'ruleta' | 'busqueda';
  /** Optional result text (prize label or time) */
  resultado?: string;
  /** Called after successful registration */
  onSuccess?: () => void;
}

/**
 * Shared registration form state + submit logic used by both
 * BusquedaPage (inline form) and RegistrationModal.
 *
 * Manages nombre, telefono, consent, fieldErrors, showToast,
 * and handles Zod validation + Supabase insert.
 */
export function useRegistrationForm({ juego, resultado, onSuccess }: UseRegistrationFormOptions) {
  const { submit, isSubmitting, error: submitError } = useRegistration();

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [consent, setConsent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [showToast, setShowToast] = useState(false);

  /** Validate a single field against the full schema */
  const validateField = useCallback(
    (field: FieldKey, value: unknown) => {
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldErrors({});

      const result = registrationSchema.safeParse({
        nombre,
        telefono,
        consent,
        juego,
        resultado,
      });

      if (!result.success) {
        const errors: Partial<Record<FieldKey, string>> = {};
        for (const issue of result.error.issues) {
          const field = String(issue.path[0]) as FieldKey;
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
          onSuccess?.();
        }, 2000);
      }
    },
    [nombre, telefono, consent, juego, resultado, submit, onSuccess],
  );

  const resetForm = useCallback(() => {
    setNombre('');
    setTelefono('');
    setConsent(false);
    setFieldErrors({});
  }, []);

  return {
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
    resetForm,
  };
}
