import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useSessionTimeout } from '../hooks/useSessionTimeout';
import { RecordsTable } from '../components/admin/RecordsTable';
import { AuditLog } from '../components/admin/AuditLog';
import { sound } from '../lib/sound';
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

  const fetchRecords = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleTabSwitch = (tab: 'records' | 'audit') => {
    sound.playClick();
    setActiveTab(tab);
  };

  const ruletaPercentage = stats.total > 0 ? Math.round((stats.ruleta / stats.total) * 100) : 0;
  const busquedaPercentage = stats.total > 0 ? Math.round((stats.busqueda / stats.total) * 100) : 0;

  const statCards = [
    { label: 'Total Participantes', value: stats.total, icon: '📊', from: 'from-blue-500/10', to: 'to-indigo-500/10', text: 'text-blue-700', border: 'border-blue-200' },
    { label: 'Tiradas de Ruleta', value: stats.ruleta, icon: '🎡', from: 'from-orange-500/10', to: 'to-red-500/10', text: 'text-primary', border: 'border-red-200' },
    { label: 'Retos de Búsqueda', value: stats.busqueda, icon: '🔍', from: 'from-teal-500/10', to: 'to-emerald-500/10', text: 'text-secondary-hover', border: 'border-teal-200' },
    { label: 'Registros Hoy', value: stats.today, icon: '⚡', from: 'from-amber-500/10', to: 'to-yellow-500/10', text: 'text-amber-700', border: 'border-amber-200' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Panel de Administración
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                En vivo
              </span>
            </div>
            <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
              Sesión activa: <span className="font-semibold text-gray-800">{admin?.email ?? 'Administrador'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              fetchRecords();
            }}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 active:scale-95 transition-all"
            title="Refrescar datos"
          >
            <span>🔄</span>
            <span className="hidden sm:inline">Actualizar</span>
          </button>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/50 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 active:scale-95 transition-all shadow-xs"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`group rounded-3xl border bg-gradient-to-br p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md cursor-default ${card.from} ${card.to} ${card.border}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl transition-transform group-hover:scale-110">{card.icon}</span>
              <span className={`text-3xl sm:text-4xl font-black ${card.text}`}>{card.value}</span>
            </div>
            <p className="mt-3 text-xs sm:text-sm font-bold text-gray-700">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Progress & Distribution Bar */}
      <div className="mb-8 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
          <span>Distribución de Juegos:</span>
          <span>🎡 Ruleta: {ruletaPercentage}% | 🔍 Búsqueda: {busquedaPercentage}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-500"
            style={{ width: `${ruletaPercentage}%` }}
            title={`Ruleta: ${ruletaPercentage}%`}
          />
          <div
            className="h-full bg-gradient-to-r from-secondary to-teal-500 transition-all duration-500"
            style={{ width: `${busquedaPercentage}%` }}
            title={`Búsqueda: ${busquedaPercentage}%`}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 flex gap-1 rounded-2xl bg-gray-200/70 p-1.5 backdrop-blur-md">
        <button
          onClick={() => handleTabSwitch('records')}
          className={`flex-1 rounded-xl px-5 py-3 text-sm font-bold transition-all ${
            activeTab === 'records'
              ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📋 Registros y Participantes ({records.length})
        </button>
        <button
          onClick={() => handleTabSwitch('audit')}
          className={`flex-1 rounded-xl px-5 py-3 text-sm font-bold transition-all ${
            activeTab === 'audit'
              ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🔒 Registro de Auditoría (Audit Log)
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-3xl border border-gray-100 bg-white p-12 shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-gray-400">Actualizando datos de Supabase...</p>
        </div>
      ) : activeTab === 'records' ? (
        <RecordsTable records={records} />
      ) : (
        <AuditLog />
      )}
    </div>
  );
}
