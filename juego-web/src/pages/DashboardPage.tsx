import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useSessionTimeout } from '../hooks/useSessionTimeout';
import { RecordsTable } from '../components/admin/RecordsTable';
import { AuditLog } from '../components/admin/AuditLog';
import type { Registration } from '../types';

interface Stats {
  total: number;
  ruleta: number;
  busqueda: number;
  today: number;
}

export function DashboardPage() {
  const { admin, signOut } = useAuth();
  const [records, setRecords] = useState<Registration[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, ruleta: 0, busqueda: 0, today: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'records' | 'audit'>('records');

  const handleTimeout = useCallback(() => {
    signOut();
  }, [signOut]);

  useSessionTimeout({ onTimeout: handleTimeout, enabled: true });

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    setLoading(true);
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const typed = data as Registration[];
      setRecords(typed);

      const today = new Date().toISOString().split('T')[0];
      setStats({
        total: typed.length,
        ruleta: typed.filter((r) => r.juego === 'ruleta').length,
        busqueda: typed.filter((r) => r.juego === 'busqueda').length,
        today: typed.filter((r) => r.created_at?.startsWith(today)).length,
      });
    }
    setLoading(false);
  }

  const statCards = [
    { label: 'Total Registros', value: stats.total, icon: '📊', color: 'bg-blue-50 text-blue-700' },
    { label: 'Ruleta', value: stats.ruleta, icon: '🎡', color: 'bg-primary/10 text-primary' },
    { label: 'Búsqueda', value: stats.busqueda, icon: '🔍', color: 'bg-secondary/10 text-secondary' },
    { label: 'Hoy', value: stats.today, icon: '📅', color: 'bg-accent/20 text-amber-700' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="mt-1 text-sm text-gray-500">
            Bienvenido, {admin?.email ?? 'Admin'}
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          Cerrar Sesión
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border border-gray-100 p-5 shadow-sm ${card.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-3xl font-bold">{card.value}</span>
            </div>
            <p className="mt-2 text-sm font-medium opacity-80">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab('records')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'records'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Registros
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'audit'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Audit Log
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : activeTab === 'records' ? (
        <RecordsTable records={records} />
      ) : (
        <AuditLog />
      )}
    </div>
  );
}
