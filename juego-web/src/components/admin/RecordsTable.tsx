import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import type { Registration } from '../../types';

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
    if (search) {
      const lower = search.toLowerCase();
      filtered = records.filter(r =>
        r.nombre.toLowerCase().includes(lower) ||
        r.telefono.toLowerCase().includes(lower)
      );
    }
    return filtered;
  }, [records, search]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = filteredRecords.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const exportCSV = () => {
    const headers = ['Nombre', 'Teléfono', 'Juego', 'Resultado', 'Fecha'];
    const rows = filteredRecords.map(r => [
      r.nombre,
      r.telefono,
      r.juego,
      r.resultado || '',
      r.created_at ? new Date(r.created_at).toLocaleString('es-CO') : ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `registros_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportPDF = () => {
    import('jspdf').then(({ jsPDF }) => {
      import('jspdf-autotable').then((autoTable) => {
        const doc = new jsPDF();
        const tableColumn = ['Nombre', 'Teléfono', 'Juego', 'Resultado', 'Fecha'];
        const tableRows = filteredRecords.map(r => [
          r.nombre,
          r.telefono,
          r.juego,
          r.resultado || '',
          r.created_at ? new Date(r.created_at).toLocaleString('es-CO') : ''
        ]);

        doc.setFontSize(18);
        doc.text('Registros - ¿Dónde Está Sttutgart?', 14, 22);
        doc.setFontSize(12);
        doc.text(`Generado: ${new Date().toLocaleString('es-CO')}`, 14, 32);

        (autoTable.default as any)(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 40,
          styles: { fontSize: 10 },
          headStyles: { fillColor: [255, 107, 107] },
        });

        doc.save(`registros_${new Date().toISOString().split('T')[0]}.pdf`);
      });
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow">
      {/* Header with filters and export */}
      <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Buscar nombre o teléfono..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-64"
          />
          <select
            value={gameFilter}
            onChange={(e) => { setGameFilter(e.target.value as any); setPage(1); }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos</option>
            <option value="ruleta">Ruleta</option>
            <option value="busqueda">Búsqueda</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-2"
          >
            📄 CSV
          </button>
          <button
            onClick={exportPDF}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            📕 PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Juego</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resultado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800">{record.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.telefono}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    record.juego === 'ruleta' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {record.juego}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.resultado || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {record.created_at ? new Date(record.created_at).toLocaleString('es-CO') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Mostrando {((page - 1) * ITEMS_PER_PAGE) + 1} a {Math.min(page * ITEMS_PER_PAGE, filteredRecords.length)} de {filteredRecords.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Anterior
            </button>
            <span className="px-4 py-1 bg-gray-100 rounded-lg">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
