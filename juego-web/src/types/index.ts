// ============================================================
// TypeScript Interfaces — ¿Dónde Está Stuttgart?
// ============================================================

/** Registration record — maps to Supabase `records` table */
export interface Registration {
  id: string;
  nombre: string;
  telefono: string;
  correo?: string | null;
  carrera?: string | null;
  juego: 'ruleta' | 'busqueda';
  resultado?: string | null;
  consentimiento?: boolean;
  consentimiento_timestamp?: string | null;
  created_at?: string;
  deleted_at?: string | null;
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

/** Audit log entry — maps to Supabase `audit_log` table */
export interface AuditEntry {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string;
  record_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

/** Daily stats for chart */
export interface DailyStat {
  date: string;
  count: number;
}

/** Date range filter */
export interface DateRange {
  from: string | null;
  to: string | null;
}
