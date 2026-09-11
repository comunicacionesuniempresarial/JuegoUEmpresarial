import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import type { AuditEntry } from '../../types';

const PAGE_SIZE = 25;

export function AuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchEntries = useCallback(async () => {
    setLoading(true);

    const { count } = await supabase
      .from('audit_log')
      .select('*', { count: 'exact', head: true });
    setTotal(count || 0);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (!error && data) {
      setEntries(data as AuditEntry[]);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'update':
        return { text: 'Edición', color: 'bg-blue-50 text-blue-700' };
      case 'soft_delete':
        return { text: 'Archivado', color: 'bg-amber-50 text-amber-700' };
      case 'hard_delete':
        return { text: 'Eliminación', color: 'bg-red-50 text-red-700' };
      case 'restore':
        return { text: 'Restaurado', color: 'bg-emerald-50 text-emerald-700' };
      case 'login':
        return { text: 'Login', color: 'bg-purple-50 text-purple-700' };
      default:
        return { text: action, color: 'bg-gray-50 text-gray-700' };
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-gray-100 bg-white">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (entries.length === 0 && page === 1) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm">
        <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        <p className="mt-4 text-sm text-gray-500">No hay eventos en el audit log todavía.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Mobile: card layout */}
      <div className="sm:hidden divide-y divide-gray-50">
        {entries.map((entry) => {
          const actionInfo = getActionLabel(entry.action);
          return (
            <div key={entry.id} className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${actionInfo.color}`}>
                  {actionInfo.text}
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(entry.created_at).toLocaleString('es-CO')}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Tabla: <span className="font-semibold">{entry.table_name}</span>
                {entry.record_id && (
                  <span className="ml-1 text-gray-400">({entry.record_id.slice(0, 8)})</span>
                )}
              </p>
            </div>
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 font-medium text-gray-600">Fecha</th>
              <th className="px-4 py-3 font-medium text-gray-600">Acción</th>
              <th className="px-4 py-3 font-medium text-gray-600">Tabla</th>
              <th className="px-4 py-3 font-medium text-gray-600">ID Registro</th>
              <th className="px-4 py-3 font-medium text-gray-600">User Agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {entries.map((entry) => {
              const actionInfo = getActionLabel(entry.action);
              return (
                <tr key={entry.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                    {new Date(entry.created_at).toLocaleString('es-CO')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${actionInfo.color}`}>
                      {actionInfo.text}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{entry.table_name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {entry.record_id?.slice(0, 8) ?? '—'}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-xs text-gray-400">
                    {entry.user_agent ?? '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 px-6 py-3 bg-gray-50/50">
          <span className="text-xs font-semibold text-gray-500">
            Página {page} de {totalPages} ({total} eventos)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition-all shadow-xs"
            >
              ← Anterior
            </button>
            <span className="rounded-xl bg-gray-200/80 px-3 py-1.5 text-xs font-black text-gray-800">{page}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition-all shadow-xs"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
