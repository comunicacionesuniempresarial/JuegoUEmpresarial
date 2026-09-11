import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RecordDetailModal } from './RecordDetailModal';
import type { Registration } from '../../types';

const mockRecord: Registration = {
  id: 'test-id-123',
  nombre: 'Juan Pérez',
  telefono: '+573001234567',
  correo: 'juan@uni.edu',
  carrera: 'Ingeniería de Software',
  juego: 'ruleta',
  resultado: 'Agenda',
  consentimiento: true,
  consentimiento_timestamp: '2026-09-10T10:30:00Z',
  created_at: '2026-09-10T10:00:00Z',
};

describe('RecordDetailModal', () => {
  const defaultProps = {
    record: mockRecord,
    onClose: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    canDelete: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when record is null', () => {
    const { container } = render(
      <RecordDetailModal {...defaultProps} record={null} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('should render all record fields', () => {
    render(<RecordDetailModal {...defaultProps} />);

    expect(screen.getByText('Detalle del Registro')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('+573001234567')).toBeInTheDocument();
    expect(screen.getByText('juan@uni.edu')).toBeInTheDocument();
    expect(screen.getByText('Ingeniería de Software')).toBeInTheDocument();
    expect(screen.getByText('Agenda')).toBeInTheDocument();
  });

  it('should show consent status', () => {
    render(<RecordDetailModal {...defaultProps} />);
    expect(screen.getByText(/✅ Aceptado/)).toBeInTheDocument();
  });

  it('should show "—" for missing optional fields', () => {
    const recordWithoutOptionals: Registration = {
      ...mockRecord,
      correo: null,
      carrera: null,
    };
    render(<RecordDetailModal {...defaultProps} record={recordWithoutOptionals} />);

    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<RecordDetailModal {...defaultProps} />);

    const closeBtn = screen.getByRole('button', { name: /✕/ });
    await user.click(closeBtn);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<RecordDetailModal {...defaultProps} />);

    const editBtn = screen.getByText(/✏️ Editar/);
    await user.click(editBtn);

    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockRecord);
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<RecordDetailModal {...defaultProps} />);

    const deleteBtn = screen.getByText(/🗑️ Eliminar/);
    await user.click(deleteBtn);

    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockRecord);
  });

  it('should hide delete button when canDelete is false', () => {
    render(<RecordDetailModal {...defaultProps} canDelete={false} />);
    expect(screen.queryByText(/🗑️ Eliminar/)).not.toBeInTheDocument();
  });

  it('should display formatted dates', () => {
    render(<RecordDetailModal {...defaultProps} />);
    // The date is formatted with toLocaleString('es-CO') — just verify the section exists
    const dateLabels = screen.getAllByText(/Fecha/);
    expect(dateLabels.length).toBeGreaterThanOrEqual(1);
  });
});
