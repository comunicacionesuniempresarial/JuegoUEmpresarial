// ============================================================
// TypeScript Interfaces — ¿Dónde Está Stuttgart?
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

/** Prize available on the ruleta */
export interface Prize {
  id: string;
  label: string;
  color: string;
  probability: number;
}

/** Admin user profile */
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
}
