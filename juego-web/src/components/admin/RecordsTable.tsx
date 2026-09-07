import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { sound } from '../../lib/sound';
import type { Registration } from '../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ITEMS_PER_PAGE = 10;

interface RecordsTableProps {
  records?: Registration[];
  loading?: boolean;
}

export function RecordsTable({ records: propRecords, loading: propLoading = false }: RecordsTableProps) {
  const [localRecords, setLocalRecords] = useState<Registration[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState<'all' | 'ruleta' | 'busqueda'>('all');
  const [page, setPage] = useState(1);

  const records = propRecords ?? localRecords;
  const loading = propRecords ? propLoading : localLoading;

  useEffect(() => {
    if (propRecords) return;

    const fetchRecords = async () => {
      let query = supabase
        .from('records')
        .select('*')
        .order('created_at', { ascending: false });

      if (gameFilter !== 'all') {
        query = query.eq('juego', gameFilter);
      }

      const { data } = await query;
      setLocalRecords(data || []);
      setLocalLoading(false);
    };

    fetchRecords();
  }, [gameFilter, propRecords]);

  const filteredRecords = useMemo(() => {
    let filtered = records;
    if (gameFilter !== 'all') {
      filtered = filtered.filter(r => r.juego === gameFilter);
    }
    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(r =>
        r.nombre.toLowerCase().includes(lower) ||
        r.telefono.toLowerCase().includes(lower) ||
        (r.resultado && r.resultado.toLowerCase().includes(lower))
      );
    }
    return filtered;
  }, [records, search, gameFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / ITEMS_PER_PAGE));
  const paginatedRecords = filteredRecords.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const exportCSV = () => {
    sound.playClick();
    const headers = ['Nombre,Teléfono,Juego,Resultado,Fecha\n'];
    const rows = filteredRecords.map(r =>
      `"${r.nombre}","${r.telefono}","${r.juego}","${r.resultado || ''}","${r.created_at || ''}"\n`
    );

    const blob = new Blob([headers.join('') + rows.join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `registros-uniempresarial-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    sound.playClick();
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('Registros — ¿Dónde Está Stuttgart? (Uniempresarial)', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado el: ${new Date().toLocaleString('es-CO')} | Total registros: ${filteredRecords.length}`, 14, 28);

    const tableData = filteredRecords.map(r => [
      r.nombre,
      r.telefono,
      r.juego.toUpperCase(),
      r.resultado || '—',
      r.created_at ? new Date(r.created_at).toLocaleString('es-CO') : '—',
    ]);

    autoTable(doc, {
      startY: 34,
      head: [['Nombre', 'Teléfono', 'Juego', 'Resultado', 'Fecha y Hora']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [255, 107, 107] },
      styles: { fontSize: 8 },
    });

    doc.save(`registros-uniempresarial-${new Date().toISOString().slice(0,10)}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-gray-100 bg-white p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* ── Search Bar & Quick Filters ── */}
      <div className="p-5 border-b border-gray-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o carrera..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
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

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-500 mr-1">Filtrar:</span>
          {(['all', 'ruleta', 'busqueda'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => {
                sound.playClick();
                setGameFilter(filter);
                setPage(1);
              }}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                gameFilter === filter
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter === 'all' && 'Todos los Juegos'}
              {filter === 'ruleta' && '🎡 Solo Ruleta'}
              {filter === 'busqueda' && '🔍 Solo Búsqueda'}
            </button>
          ))}
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 active:scale-95 transition-all shadow-xs"
            title="Descargar archivo Excel / CSV"
          >
            <span>📊</span>
            <span>Excel / CSV</span>
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-100 active:scale-95 transition-all shadow-xs"
            title="Descargar informe PDF"
          >
            <span>📕</span>
            <span>Descargar PDF</span>
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/80 border-b border-gray-100 text-xs font-black uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-6 py-4">Participante</th>
              <th className="px-6 py-4">Teléfono</th>
              <th className="px-6 py-4">Modalidad</th>
              <th className="px-6 py-4">Resultado Obtenido</th>
              <th className="px-6 py-4">Fecha y Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record, index) => (
                <tr key={record.id || `record-${index}`} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs text-primary font-bold">
                      {record.nombre.slice(0, 1).toUpperCase()}
                    </span>
                    <span>{record.nombre}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{record.telefono}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold ${
                        record.juego === 'ruleta'
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : 'bg-teal-100 text-teal-800 border border-teal-200'
                      }`}
                    >
                      {record.juego === 'ruleta' ? '🎡 Ruleta' : '🔍 Búsqueda'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {record.resultado || '—'}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400 font-medium">
                    {record.created_at ? new Date(record.created_at).toLocaleString('es-CO') : '—'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400">
                  No se encontraron registros que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 px-6 py-4 bg-gray-50/50">
          <span className="text-xs font-semibold text-gray-500">
            Página {page} de {totalPages} ({filteredRecords.length} participantes encontrados)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setPage((p) => Math.max(1, p - 1));
              }}
              disabled={page === 1}
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-40 transition-all shadow-xs"
            >
              ← Anterior
            </button>
            <span className="rounded-xl bg-gray-200/80 px-3 py-1.5 text-xs font-black text-gray-800">
              {page}
            </span>
            <button
              onClick={() => {
                sound.playClick();
                setPage((p) => Math.min(totalPages, p + 1));
              }}
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
