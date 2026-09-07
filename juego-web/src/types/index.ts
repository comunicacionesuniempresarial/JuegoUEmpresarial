// ============================================================
// TypeScript Interfaces — ¿Dónde Está Sttutgart?
// ============================================================

/** Registration record — maps to Supabase `records` table */
export interface Registration {
  id?: string;
  nombre: string;
  telefono: string;
  juego: 'ruleta' | 'busqueda';
  resultado?: string;
  created_at?: string;
}

/** Game result after completing a game */
export interface GameResult {
  id?: string;
  user_id?: string;
  game_type: 'ruleta' | 'busqueda';
  score: number;
  completed: boolean;
  time_spent: number; // seconds
  created_at?: string;
}

/** Ruleta (spin wheel) game state */
export interface RuletaState {
  isSpinning: boolean;
  currentPrize: string | null;
  prizes: Prize[];
  hasSpun: boolean;
}

/** Prize available on the ruleta */
export interface Prize {
  id: string;
  label: string;
  color: string;
  probability: number;
}

/** Búsqueda (image search) game state */
export interface BusquedaState {
  isPlaying: boolean;
  timeRemaining: number;
  score: number;
  foundItems: string[];
  totalItems: number;
  isComplete: boolean;
}

/** Studgard companion configuration */
export interface StudgardConfig {
  enabled: boolean;
  position: 'bottom-right' | 'bottom-left';
  greetingMessage: string;
  tips: string[];
}

/** Application route configuration */
export interface AppRoute {
  path: string;
  label: string;
  element: React.ReactNode;
  isPublic: boolean;
}

/** Admin user profile */
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
}

/** LGPD consent record */
export interface LgpdConsent {
  id?: string;
  user_id: string;
  accepted: boolean;
  accepted_at: string;
  ip_address?: string;
}

/** Career options for registration */
export type Career =
  | 'Administración'
  | 'Finanzas'
  | 'Ingeniería Industrial'
  | 'Ingeniería de Software'
  | 'Marketing'
  | 'Negocios Internacionales'
  | 'Negocios Turísticos';

/** Available careers array */
export const CAREERS: Career[] = [
  'Administración',
  'Finanzas',
  'Ingeniería Industrial',
  'Ingeniería de Software',
  'Marketing',
  'Negocios Internacionales',
  'Negocios Turísticos',
];
