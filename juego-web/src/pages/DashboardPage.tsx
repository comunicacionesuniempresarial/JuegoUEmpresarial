import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useSessionTimeout } from '../hooks/useSessionTimeout';
import { RecordsTable } from '../components/admin/RecordsTable';
import { AuditLog } from '../components/admin/AuditLog';
import { sound } from '../lib/sound';
import type { Registration, DailyStat } from '../types';

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
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);

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
        total: typed.filter((r) => !r.deleted_at).length,
        ruleta: typed.filter((r) => r.juego === 'ruleta' && !r.deleted_at).length,
        busqueda: typed.filter((r) => r.juego === 'busqueda' && !r.deleted_at).length,
        today: typed.filter((r) => r.created_at?.startsWith(today) && !r.deleted_at).length,
      });

      // Build daily stats for last 7 days
      const dayMap = new Map<string, number>();
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dayMap.set(d.toISOString().split('T')[0], 0);
      }
      for (const r of typed) {
        if (r.created_at && !r.deleted_at) {
          const day = r.created_at.split('T')[0];
          if (dayMap.has(day)) {
            dayMap.set(day, (dayMap.get(day) || 0) + 1);
          }
        }
      }
      setDailyStats(Array.from(dayMap.entries()).map(([date, count]) => ({ date, count })));
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

  const maxDaily = Math.max(1, ...dailyStats.map((d) => d.count));

  const statCards = [
    { label: 'Total Participantes', value: stats.total, icon: '📊', from: 'from-secondary/10', to: 'to-primary/10', text: 'text-secondary', border: 'border-secondary/30' },
    { label: 'Tiradas de Ruleta', value: stats.ruleta, icon: '🎡', from: 'from-primary/10', to: 'to-accent/10', text: 'text-primary', border: 'border-primary/30' },
    { label: 'Retos de Búsqueda', value: stats.busqueda, icon: '🔍', from: 'from-secondary/10', to: 'to-primary/10', text: 'text-secondary', border: 'border-secondary/30' },
    { label: 'Registros Hoy', value: stats.today, icon: '⚡', from: 'from-accent/10', to: 'to-primary/10', text: 'text-accent', border: 'border-accent/30' },
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
            onClick={() => { sound.playClick(); fetchRecords(); }}
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

      {/* Distribution Bar */}
      <div className="mb-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
          <span>Distribución de Juegos:</span>
          <span>🎡 Ruleta: {ruletaPercentage}% | 🔍 Búsqueda: {busquedaPercentage}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${ruletaPercentage}%` }}
            title={`Ruleta: ${ruletaPercentage}%`}
          />
          <div
            className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500"
            style={{ width: `${busquedaPercentage}%` }}
            title={`Búsqueda: ${busquedaPercentage}%`}
          />
        </div>
      </div>

      {/* Daily Chart */}
      {dailyStats.length > 0 && (
        <div className="mb-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Participantes por día (Últimos 7 días)</p>
          <div className="flex items-end gap-2 h-32">
            {dailyStats.map((day) => {
              const height = day.count > 0 ? Math.max(8, (day.count / maxDaily) * 100) : 2;
              const label = new Date(day.date + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' });
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-black text-gray-700">{day.count}</span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary to-accent transition-all duration-500"
                    style={{ height: `${height}%`, minHeight: '2px' }}
                  />
                  <span className="text-[9px] font-semibold text-gray-400 truncate w-full text-center">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
          📋 Registros y Participantes ({stats.total})
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
