import { z } from 'zod';

/**
 * Zod schema for the registration form.
 *
 * Fields:
 *  - nombre:   min 2 chars
 *  - telefono: Colombian mobile format ^3[0-9]{9}$ (10 digits, no country code)
 *  - correo:   optional email
 *  - carrera:  optional carrera from pregrado list
 *  - consent:  must be true
 *  - juego:    'ruleta' | 'busqueda'
 *  - resultado: optional string (prize label or time)
 */
const CARRERAS_PREGRADO = [
  'Ingeniería de Software',
  'Marketing',
  'Administración de Empresas',
  'Negocios Internacionales',
  'Finanzas y Comercio Exterior',
  'Negocios Turísticos y Hoteleros',
  'Ingeniería Industrial',
] as const;

export const registrationSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  telefono: z
    .string()
    .regex(
      /^[3][0-9]{9}$/,
      'Formato inválido. Ingrese 10 dígitos (ej: 3001234567)',
    ),
  correo: z
    .string()
    .email('Correo inválido')
    .max(100, 'El correo es demasiado largo')
    .optional()
    .or(z.literal('')),
  carrera: z
    .enum(CARRERAS_PREGRADO)
    .optional(),
  consent: z
    .boolean()
    .refine((v) => v === true, 'Debe aceptar el tratamiento de datos'),
  juego: z.enum(['ruleta', 'busqueda']),
  resultado: z.string().optional(),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type CarreraPregrado = typeof CARRERAS_PREGRADO[number];
