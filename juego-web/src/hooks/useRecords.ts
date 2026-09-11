import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Registration, AuditEntry, DailyStat, DateRange } from '../types';

// ============================================================
// useRecords — CRUD + queries for the admin panel
// ============================================================

export interface RecordFilters {
  search?: string;
  juego?: 'all' | 'ruleta' | 'busqueda';
  dateRange?: DateRange;
}

export interface UseRecordsReturn {
  records: Registration[];
  loading: boolean;
  error: string | null;
  fetchRecords: (filters?: RecordFilters) => Promise<void>;
  updateRecord: (id: string, data: Partial<Registration>) => Promise<boolean>;
  softDeleteRecord: (id: string) => Promise<boolean>;
  hardDeleteRecord: (id: string) => Promise<boolean>;
  restoreRecord: (id: string) => Promise<boolean>;
}

export function useRecords(): UseRecordsReturn {
  const [records, setRecords] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async (filters?: RecordFilters) => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('records')
      .select('id, nombre, telefono, correo, carrera, juego, resultado, consentimiento, consentimiento_timestamp, created_at, deleted_at')
      .order('created_at', { ascending: false });

    // Game filter
    if (filters?.juego && filters.juego !== 'all') {
      query = query.eq('juego', filters.juego);
    }

    // Date range filter
    if (filters?.dateRange?.from) {
      query = query.gte('created_at', filters.dateRange.from);
    }
    if (filters?.dateRange?.to) {
      // Add 1 day to include the full end day
      const endDate = new Date(filters.dateRange.to);
      endDate.setDate(endDate.getDate() + 1);
      query = query.lt('created_at', endDate.toISOString());
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
      setRecords([]);
    } else {
      let filtered = (data || []) as Registration[];

      // Client-side search ( Supabase full-text search is limited for this schema )
      if (filters?.search) {
        const lower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.nombre.toLowerCase().includes(lower) ||
            r.telefono.toLowerCase().includes(lower) ||
            (r.correo && r.correo.toLowerCase().includes(lower)) ||
            (r.carrera && r.carrera.toLowerCase().includes(lower)) ||
            (r.resultado && r.resultado.toLowerCase().includes(lower))
        );
      }

      setRecords(filtered);
    }

    setLoading(false);
  }, []);

  const updateRecord = useCallback(async (id: string, data: Partial<Registration>): Promise<boolean> => {
    setError(null);

    const { error: updateError } = await supabase
      .from('records')
      .update({
        nombre: data.nombre,
        telefono: data.telefono,
        correo: data.correo ?? null,
        carrera: data.carrera ?? null,
        resultado: data.resultado ?? null,
      })
      .eq('id', id);

    if (updateError) {
      setError(updateError.message);
      return false;
    }

    // Log to audit_log
    await supabase.from('audit_log').insert({
      action: 'update',
      table_name: 'records',
      record_id: id,
      user_agent: navigator.userAgent,
    });

    return true;
  }, []);

  const softDeleteRecord = useCallback(async (id: string): Promise<boolean> => {
    setError(null);

    const { error: deleteError } = await supabase
      .from('records')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      return false;
    }

    await supabase.from('audit_log').insert({
      action: 'soft_delete',
      table_name: 'records',
      record_id: id,
      user_agent: navigator.userAgent,
    });

    return true;
  }, []);

  const hardDeleteRecord = useCallback(async (id: string): Promise<boolean> => {
    setError(null);

    const { error: deleteError } = await supabase
      .from('records')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      return false;
    }

    await supabase.from('audit_log').insert({
      action: 'hard_delete',
      table_name: 'records',
      record_id: id,
      user_agent: navigator.userAgent,
    });

    return true;
  }, []);

  const restoreRecord = useCallback(async (id: string): Promise<boolean> => {
    setError(null);

    const { error: restoreError } = await supabase
      .from('records')
      .update({ deleted_at: null })
      .eq('id', id);

    if (restoreError) {
      setError(restoreError.message);
      return false;
    }

    await supabase.from('audit_log').insert({
      action: 'restore',
      table_name: 'records',
      record_id: id,
      user_agent: navigator.userAgent,
    });

    return true;
  }, []);

  return {
    records,
    loading,
    error,
    fetchRecords,
    updateRecord,
    softDeleteRecord,
    hardDeleteRecord,
    restoreRecord,
  };
}

// ============================================================
// useAuditLog — paginated audit log
// ============================================================

export interface UseAuditLogReturn {
  entries: AuditEntry[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  total: number;
  setPage: (page: number) => void;
  fetchAuditLog: () => Promise<void>;
}

const AUDIT_PAGE_SIZE = 25;

export function useAuditLog(): UseAuditLogReturn {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / AUDIT_PAGE_SIZE));

  const fetchAuditLog = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Get total count
    const { count } = await supabase
      .from('audit_log')
      .select('*', { count: 'exact', head: true });

    setTotal(count || 0);

    // Get paginated data
    const from = (page - 1) * AUDIT_PAGE_SIZE;
    const to = from + AUDIT_PAGE_SIZE - 1;

    const { data, error: fetchError } = await supabase
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (fetchError) {
      setError(fetchError.message);
      setEntries([]);
    } else {
      setEntries((data || []) as AuditEntry[]);
    }

    setLoading(false);
  }, [page]);

  return {
    entries,
    loading,
    error,
    page,
    totalPages,
    total,
    setPage,
    fetchAuditLog,
  };
}

// ============================================================
// useDailyStats — last 7 days participation chart
// ============================================================

export function useDailyStats(): { stats: DailyStat[]; loading: boolean; fetch: () => Promise<void> } {
  const [stats, setStats] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);

    // Fetch last 7 days of records
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { data } = await supabase
      .from('records')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    // Group by day
    const dayMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dayMap.set(key, 0);
    }

    if (data) {
      for (const row of data) {
        if (row.created_at) {
          const day = row.created_at.split('T')[0];
          if (dayMap.has(day)) {
            dayMap.set(day, (dayMap.get(day) || 0) + 1);
          }
        }
      }
    }

    const result: DailyStat[] = Array.from(dayMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    setStats(result);
    setLoading(false);
  }, []);

  return { stats, loading, fetch };
}
