import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { RegistrationInput } from '../lib/validations';

export interface UseRegistrationReturn {
  submit: (data: RegistrationInput) => Promise<boolean>;
  isSubmitting: boolean;
  error: string | null;
}

/**
 * Hook that inserts a registration record into the Supabase `records` table.
 *
 * Returns `submit`, `isSubmitting`, and `error`.
 * `submit` resolves to `true` on success, `false` on failure (error is set).
 */
export function useRegistration(): UseRegistrationReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (data: RegistrationInput): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from('records').insert({
      nombre: data.nombre,
      telefono: data.telefono,
      correo: data.correo ?? null,
      carrera: data.carrera ?? null,
      juego: data.juego,
      resultado: data.resultado ?? null,
    });

    setIsSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return false;
    }
    return true;
  }, []);

  return { submit, isSubmitting, error };
}
