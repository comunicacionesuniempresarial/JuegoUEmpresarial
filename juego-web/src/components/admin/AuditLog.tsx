import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface AuditEntry {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export function AuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLog();
  }, []);

  async function fetchAuditLog() {
    setLoading(true);
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setEntries(data as AuditEntry[]);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (entries.length === 0) {
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
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
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
            {entries.map((entry) => (
              <tr key={entry.id} className="transition-colors hover:bg-gray-50/50">
                <td className="px-4 py-3 text-gray-600">
                  {new Date(entry.created_at).toLocaleString('es-CO')}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                    {entry.action}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
