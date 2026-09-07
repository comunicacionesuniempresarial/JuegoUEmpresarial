import { useCallback } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Registration } from '../types';

export function useExportPDF() {
  const exportPDF = useCallback((records: Registration[], filename = 'registros.pdf') => {
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(18);
    doc.text('Reporte de Registros — ¿Dónde Está Sttutgart?', 14, 22);

    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, 14, 30);
    doc.text(`Total registros: ${records.length}`, 14, 36);

    const tableData = records.map((r) => [
      r.nombre,
      r.telefono,
      r.juego === 'ruleta' ? 'Ruleta' : 'Búsqueda',
      r.resultado ?? '—',
      r.created_at ? new Date(r.created_at).toLocaleDateString('es-CO') : '—',
    ]);

    autoTable(doc, {
      startY: 42,
      head: [['Nombre', 'Teléfono', 'Juego', 'Resultado', 'Fecha']],
      body: tableData,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [255, 107, 107] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(filename);
  }, []);

  return { exportPDF };
}
