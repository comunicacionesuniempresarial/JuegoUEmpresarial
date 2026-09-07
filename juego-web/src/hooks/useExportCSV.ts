import { useCallback } from 'react';
import type { Registration } from '../types';

export function useExportCSV() {
  const exportCSV = useCallback((records: Registration[], filename = 'registros.csv') => {
    const headers = ['Nombre', 'Teléfono', 'Juego', 'Resultado', 'Fecha'];
    const rows = records.map((r) => [
      r.nombre,
      r.telefono,
      r.juego,
      r.resultado ?? '',
      r.created_at ? new Date(r.created_at).toLocaleDateString('es-CO') : '',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  return { exportCSV };
}
