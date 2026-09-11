import { useEffect } from 'react';
import { sound } from '../../lib/sound';
import type { Registration } from '../../types';

interface RecordDetailModalProps {
  record: Registration | null;
  onClose: () => void;
  onEdit: (record: Registration) => void;
  onDelete: (record: Registration) => void;
  canDelete: boolean;
}

export function RecordDetailModal({ record, onClose, onEdit, onDelete, canDelete }: RecordDetailModalProps) {
  useEffect(() => {
    if (record) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [record]);

  if (!record) return null;

  const fields = [
    { label: 'Nombre', value: record.nombre },
    { label: 'Teléfono', value: record.telefono, mono: true },
    { label: 'Correo', value: record.correo || '—' },
    { label: 'Carrera', value: record.carrera || '—' },
    {
      label: 'Juego',
      value: record.juego === 'ruleta' ? '🎡 Ruleta' : '🔍 Búsqueda',
      badge: true,
      badgeColor: record.juego === 'ruleta' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary/10 text-secondary border-secondary/20',
    },
    { label: 'Resultado', value: record.resultado || '—' },
    {
      label: 'Consentimiento',
      value: record.consentimiento ? '✅ Aceptado' : '❌ No aceptado',
    },
    {
      label: 'Fecha Consentimiento',
      value: record.consentimiento_timestamp
        ? new Date(record.consentimiento_timestamp).toLocaleString('es-CO')
        : '—',
    },
    {
      label: 'Fecha de Registro',
      value: record.created_at ? new Date(record.created_at).toLocaleString('es-CO') : '—',
    },
    { label: 'ID', value: record.id, mono: true, small: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-gray-900">Detalle del Registro</h3>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.label} className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{field.label}</span>
              {field.badge ? (
                <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold border ${field.badgeColor}`}>
                  {field.value}
                </span>
              ) : (
                <span
                  className={`text-sm font-semibold text-gray-800 ${
                    field.mono ? 'font-mono text-xs' : ''
                  } ${field.small ? 'text-[10px] text-gray-400 break-all' : ''}`}
                >
                  {field.value}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => { sound.playClick(); onEdit(record); }}
            className="flex-1 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/20 transition-all"
          >
            ✏️ Editar
          </button>
          {canDelete && (
            <button
              onClick={() => { sound.playClick(); onDelete(record); }}
              className="flex-1 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 transition-all"
            >
              🗑️ Eliminar
            </button>
          )}
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
