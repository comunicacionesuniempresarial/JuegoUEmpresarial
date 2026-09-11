import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { sound } from '../../lib/sound';
import { useAuth } from '../../hooks/useAuth';
import { RecordDetailModal } from './RecordDetailModal';
import { RecordEditModal } from './RecordEditModal';
import type { Registration, DateRange } from '../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ITEMS_PER_PAGE = 10;

interface RecordsTableProps {
  records?: Registration[];
  loading?: boolean;
}

type QuickDate = 'all' | 'today' | 'yesterday' | '7days' | '30days';

export function RecordsTable({ records: propRecords, loading: propLoading = false }: RecordsTableProps) {
  const { admin } = useAuth();
  const [localRecords, setLocalRecords] = useState<Registration[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState<'all' | 'ruleta' | 'busqueda'>('all');
  const [quickDate, setQuickDate] = useState<QuickDate>('all');
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
  const [page, setPage] = useState(1);

  // Modals
  const [detailRecord, setDetailRecord] = useState<Registration | null>(null);
  const [editRecord, setEditRecord] = useState<Registration | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Registration | null>(null);

  const records = propRecords ?? localRecords;
  const loading = propRecords ? propLoading : localLoading;

  // Fetch records when filters change (only when used standalone)
  const fetchLocalRecords = useCallback(async () => {
    if (propRecords) return;
    setLocalLoading(true);
    let query = supabase.from('records').select('*').order('created_at', { ascending: false });
    if (gameFilter !== 'all') query = query.eq('juego', gameFilter);
    const { data } = await query;
    setLocalRecords((data || []) as Registration[]);
    setLocalLoading(false);
  }, [gameFilter, propRecords]);

  useEffect(() => {
    fetchLocalRecords();
  }, [fetchLocalRecords]);

  // Quick date presets
  const getDateRange = (preset: QuickDate): DateRange => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    switch (preset) {
      case 'today': {
        const from = new Date(today);
        from.setHours(0, 0, 0, 0);
        return { from: from.toISOString(), to: today.toISOString() };
      }
      case 'yesterday': {
        const from = new Date(today);
        from.setDate(from.getDate() - 1);
        from.setHours(0, 0, 0, 0);
        const to = new Date(from);
        to.setHours(23, 59, 59, 999);
        return { from: from.toISOString(), to: to.toISOString() };
      }
      case '7days': {
        const from = new Date(today);
        from.setDate(from.getDate() - 6);
        from.setHours(0, 0, 0, 0);
        return { from: from.toISOString(), to: today.toISOString() };
      }
      case '30days': {
        const from = new Date(today);
        from.setDate(from.getDate() - 29);
        from.setHours(0, 0, 0, 0);
        return { from: from.toISOString(), to: today.toISOString() };
      }
      default:
        return { from: null, to: null };
    }
  };

  const handleQuickDate = (preset: QuickDate) => {
    sound.playClick();
    setQuickDate(preset);
    setDateRange(getDateRange(preset));
    setPage(1);
  };

  // Client-side filtering
  const filteredRecords = useMemo(() => {
    let filtered = records.filter((r) => !r.deleted_at);
    if (gameFilter !== 'all') {
      filtered = filtered.filter((r) => r.juego === gameFilter);
    }
    if (dateRange.from) {
      filtered = filtered.filter((r) => r.created_at && r.created_at >= dateRange.from!);
    }
    if (dateRange.to) {
      filtered = filtered.filter((r) => r.created_at && r.created_at <= dateRange.to!);
    }
    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.nombre.toLowerCase().includes(lower) ||
          r.telefono.toLowerCase().includes(lower) ||
          (r.correo && r.correo.toLowerCase().includes(lower)) ||
          (r.carrera && r.carrera.toLowerCase().includes(lower)) ||
          (r.resultado && r.resultado.toLowerCase().includes(lower))
      );
    }
    return filtered;
  }, [records, search, gameFilter, dateRange]);

  // Prize stats for ruleta
  const prizeStats = useMemo(() => {
    const ruletaRecords = filteredRecords.filter((r) => r.juego === 'ruleta' && r.resultado);
    const counts = new Map<string, number>();
    for (const r of ruletaRecords) {
      const key = r.resultado || '';
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [filteredRecords]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / ITEMS_PER_PAGE));
  const paginatedRecords = filteredRecords.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Export CSV
  const exportCSV = () => {
    sound.playClick();
    const headers = 'Nombre,Teléfono,Correo,Carrera,Juego,Resultado,Fecha\n';
    const rows = filteredRecords
      .map((r) => `"${r.nombre}","${r.telefono}","${r.correo || ''}","${r.carrera || ''}","${r.juego}","${r.resultado || ''}","${r.created_at || ''}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `registros-uniempresarial-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF
  const exportPDF = () => {
    sound.playClick();
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('Registros — ¿Dónde Está Stuttgart? (Uniempresarial)', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado el: ${new Date().toLocaleString('es-CO')} | Total: ${filteredRecords.length}`, 14, 28);
    const tableData = filteredRecords.map((r) => [
      r.nombre,
      r.telefono,
      r.juego.toUpperCase(),
      r.resultado || '—',
      r.created_at ? new Date(r.created_at).toLocaleString('es-CO') : '—',
    ]);
    autoTable(doc, {
      startY: 34,
      head: [['Nombre', 'Teléfono', 'Juego', 'Resultado', 'Fecha']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [255, 107, 107] },
      styles: { fontSize: 8 },
    });
    doc.save(`registros-uniempresarial-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Handle soft delete
  const handleSoftDelete = async (record: Registration) => {
    sound.playClick();
    const { error } = await supabase
      .from('records')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', record.id);

    if (!error) {
      await supabase.from('audit_log').insert({
        action: 'soft_delete',
        table_name: 'records',
        record_id: record.id,
        user_agent: navigator.userAgent,
      });
      setDeleteConfirm(null);
      setDetailRecord(null);
      fetchLocalRecords();
    }
  };

  // Handle hard delete (super_admin only)
  const handleHardDelete = async (record: Registration) => {
    sound.playClick();
    const { error } = await supabase.from('records').delete().eq('id', record.id);

    if (!error) {
      await supabase.from('audit_log').insert({
        action: 'hard_delete',
        table_name: 'records',
        record_id: record.id,
        user_agent: navigator.userAgent,
      });
      setDeleteConfirm(null);
      setDetailRecord(null);
      fetchLocalRecords();
    }
  };

  // Handle edit save
  const handleEditSave = async (id: string, data: Partial<Registration>): Promise<boolean> => {
    const { error } = await supabase
      .from('records')
      .update({
        nombre: data.nombre,
        telefono: data.telefono,
        correo: data.correo ?? null,
        carrera: data.carrera ?? null,
        resultado: data.resultado ?? null,
      })
      .eq('id', id);

    if (!error) {
      await supabase.from('audit_log').insert({
        action: 'update',
        table_name: 'records',
        record_id: id,
        user_agent: navigator.userAgent,
      });
      fetchLocalRecords();
      return true;
    }
    return false;
  };

  const canDelete = admin?.role === 'admin' || admin?.role === 'super_admin';

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-gray-100 bg-white p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* ── Search, Filters & Export ── */}
      <div className="p-5 border-b border-gray-100 bg-slate-50/50">
        {/* Row 1: Search + Export */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono, correo, carrera..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="flex items-center gap-1.5 rounded-xl border border-secondary/30 bg-secondary/10 px-3.5 py-2 text-xs font-bold text-secondary hover:bg-secondary/20 active:scale-95 transition-all shadow-xs">
              <span>📊</span><span>CSV</span>
            </button>
            <button onClick={exportPDF} className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary/20 active:scale-95 transition-all shadow-xs">
              <span>📕</span><span>PDF</span>
            </button>
          </div>
        </div>

        {/* Row 2: Game filter chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold text-gray-500 mr-1">Juego:</span>
          {(['all', 'ruleta', 'busqueda'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => { sound.playClick(); setGameFilter(filter); setPage(1); }}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                gameFilter === filter
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter === 'all' && 'Todos'}
              {filter === 'ruleta' && '🎡 Ruleta'}
              {filter === 'busqueda' && '🔍 Búsqueda'}
            </button>
          ))}
        </div>

        {/* Row 3: Date range */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-500 mr-1">Fecha:</span>
          {([
            { key: 'all', label: 'Todos' },
            { key: 'today', label: 'Hoy' },
            { key: 'yesterday', label: 'Ayer' },
            { key: '7days', label: 'Últimos 7' },
            { key: '30days', label: 'Últimos 30' },
          ] as const).map((item) => (
            <button
              key={item.key}
              onClick={() => handleQuickDate(item.key)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                quickDate === item.key
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Custom date inputs */}
          <div className="flex items-center gap-1.5 ml-2">
            <input
              type="date"
              value={dateRange.from ? dateRange.from.split('T')[0] : ''}
              onChange={(e) => {
                const from = e.target.value ? new Date(e.target.value + 'T00:00:00').toISOString() : null;
                setDateRange((prev) => ({ ...prev, from }));
                setQuickDate('all');
                setPage(1);
              }}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] font-semibold text-gray-600 outline-none focus:border-primary"
            />
            <span className="text-[10px] text-gray-400">a</span>
            <input
              type="date"
              value={dateRange.to ? dateRange.to.split('T')[0] : ''}
              onChange={(e) => {
                const to = e.target.value ? new Date(e.target.value + 'T23:59:59').toISOString() : null;
                setDateRange((prev) => ({ ...prev, to }));
                setQuickDate('all');
                setPage(1);
              }}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] font-semibold text-gray-600 outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* ── Prize Stats (Ruleta only) ── */}
      {gameFilter !== 'busqueda' && prizeStats.length > 0 && (
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Premios más ganados (Ruleta)</p>
          <div className="flex flex-wrap gap-2">
            {prizeStats.map(([name, count]) => (
              <div key={name} className="flex items-center gap-1.5 rounded-xl bg-white border border-gray-100 px-3 py-1.5 shadow-xs">
                <span className="text-xs font-bold text-gray-800">{name}</span>
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-black text-primary">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Table (desktop) ── */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/80 border-b border-gray-100 text-xs font-black uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-6 py-4">Participante</th>
              <th className="px-6 py-4">Teléfono</th>
              <th className="px-6 py-4">Modalidad</th>
              <th className="px-6 py-4">Resultado</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record) => (
                <tr key={record.id} className="transition-colors hover:bg-slate-50/70 cursor-pointer" onClick={() => setDetailRecord(record)}>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs text-primary font-bold shrink-0">
                        {record.nombre.slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <span className="block truncate">{record.nombre}</span>
                        {record.carrera && <span className="block text-[10px] text-gray-400 truncate">{record.carrera}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{record.telefono}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold ${
                      record.juego === 'ruleta'
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'bg-secondary/10 text-secondary border border-secondary/20'
                    }`}>
                      {record.juego === 'ruleta' ? '🎡 Ruleta' : '🔍 Búsqueda'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{record.resultado || '—'}</td>
                  <td className="px-6 py-4 text-xs text-gray-400 font-medium whitespace-nowrap">
                    {record.created_at ? new Date(record.created_at).toLocaleString('es-CO') : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setDetailRecord(record)}
                        className="rounded-lg bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200 transition-all"
                        title="Ver detalle"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setEditRecord(record)}
                        className="rounded-lg bg-primary/10 p-1.5 text-primary hover:bg-primary/20 transition-all"
                        title="Editar"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400">
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Cards (mobile) ── */}
      <div className="sm:hidden divide-y divide-gray-100">
        {paginatedRecords.length > 0 ? (
          paginatedRecords.map((record) => (
            <div
              key={record.id}
              className="p-4 active:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => setDetailRecord(record)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm text-primary font-bold">
                    {record.nombre.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate text-sm">{record.nombre}</p>
                    <p className="font-mono text-[11px] text-gray-500">{record.telefono}</p>
                  </div>
                </div>
                <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  record.juego === 'ruleta'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-secondary/10 text-secondary'
                }`}>
                  {record.juego === 'ruleta' ? '🎡 Ruleta' : '🔍 Búsqueda'}
                </span>
              </div>
              {record.resultado && (
                <p className="text-xs font-semibold text-gray-700 mb-1">Premio: {record.resultado}</p>
              )}
              {record.carrera && (
                <p className="text-[11px] text-gray-400 truncate">{record.carrera}</p>
              )}
              <p className="text-[10px] text-gray-300 mt-1">
                {record.created_at ? new Date(record.created_at).toLocaleString('es-CO') : ''}
              </p>
              {/* Mobile action buttons */}
              <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setEditRecord(record)}
                  className="rounded-lg bg-primary/10 px-3 py-1.5 text-[11px] font-bold text-primary"
                >
                  ✏️ Editar
                </button>
                {canDelete && (
                  <button
                    onClick={() => setDeleteConfirm(record)}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-[11px] font-bold text-red-500"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-gray-400 text-sm">
            No se encontraron registros.
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 px-6 py-4 bg-gray-50/50">
          <span className="text-xs font-semibold text-gray-500">
            Página {page} de {totalPages} ({filteredRecords.length} registros)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { sound.playClick(); setPage((p) => Math.max(1, p - 1)); }}
              disabled={page === 1}
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition-all shadow-xs"
            >
              ← Anterior
            </button>
            <span className="rounded-xl bg-gray-200/80 px-3 py-1.5 text-xs font-black text-gray-800">
              {page}
            </span>
            <button
              onClick={() => { sound.playClick(); setPage((p) => Math.min(totalPages, p + 1)); }}
              disabled={page === totalPages}
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition-all shadow-xs"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      <RecordDetailModal
        record={detailRecord}
        onClose={() => setDetailRecord(null)}
        onEdit={(r) => { setDetailRecord(null); setEditRecord(r); }}
        onDelete={(r) => { setDetailRecord(null); setDeleteConfirm(r); }}
        canDelete={canDelete}
      />

      <RecordEditModal
        record={editRecord}
        onClose={() => setEditRecord(null)}
        onSave={handleEditSave}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-black text-gray-900 mb-2">Confirmar Eliminación</h3>
            <p className="text-sm text-gray-600 mb-4">
              ¿Eliminar registro de <strong>{deleteConfirm.nombre}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleSoftDelete(deleteConfirm)}
                className="flex-1 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-100 transition-all"
              >
                Archivar (Soft Delete)
              </button>
              {admin?.role === 'super_admin' && (
                <button
                  onClick={() => handleHardDelete(deleteConfirm)}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-all"
                >
                  Eliminar Permanentemente
                </button>
              )}
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
