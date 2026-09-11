import { useState, useEffect } from 'react';
import { sound } from '../../lib/sound';
import type { Registration } from '../../types';

interface RecordEditModalProps {
  record: Registration | null;
  onClose: () => void;
  onSave: (id: string, data: Partial<Registration>) => Promise<boolean>;
}

export function RecordEditModal({ record, onClose, onSave }: RecordEditModalProps) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [carrera, setCarrera] = useState('');
  const [resultado, setResultado] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (record) {
      setNombre(record.nombre);
      setTelefono(record.telefono);
      setCorreo(record.correo || '');
      setCarrera(record.carrera || '');
      setResultado(record.resultado || '');
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [record]);

  if (!record) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const success = await onSave(record.id, {
      nombre,
      telefono,
      correo: correo || null,
      carrera: carrera || null,
      resultado: resultado || null,
    });

    setSaving(false);
    if (success) {
      onClose();
    } else {
      setError('Error al guardar. Intenta de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-gray-900">Editar Registro</h3>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              required
              minLength={2}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-semibold text-gray-800 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Teléfono *
            </label>
            <input
              type="text"
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-mono text-gray-800 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Correo */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Correo
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Carrera */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Carrera
            </label>
            <input
              type="text"
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Resultado */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Resultado
            </label>
            <input
              type="text"
              value={resultado}
              onChange={(e) => setResultado(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={() => { sound.playClick(); onClose(); }}
              className="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
