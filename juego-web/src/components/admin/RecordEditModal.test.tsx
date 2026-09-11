import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RecordEditModal } from './RecordEditModal';
import type { Registration } from '../../types';

const mockRecord: Registration = {
  id: 'test-id-123',
  nombre: 'Juan Pérez',
  telefono: '+573001234567',
  correo: 'juan@uni.edu',
  carrera: 'Ingeniería de Software',
  juego: 'ruleta',
  resultado: 'Agenda',
  created_at: '2026-09-10T10:00:00Z',
};

describe('RecordEditModal', () => {
  const defaultProps = {
    record: mockRecord,
    onClose: vi.fn(),
    onSave: vi.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when record is null', () => {
    const { container } = render(
      <RecordEditModal {...defaultProps} record={null} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('should render form with pre-filled values', () => {
    render(<RecordEditModal {...defaultProps} />);

    expect(screen.getByText('Editar Registro')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+573001234567')).toBeInTheDocument();
    expect(screen.getByDisplayValue('juan@uni.edu')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Ingeniería de Software')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Agenda')).toBeInTheDocument();
  });

  it('should update form fields', async () => {
    const user = userEvent.setup();
    render(<RecordEditModal {...defaultProps} />);

    const nombreInput = screen.getByDisplayValue('Juan Pérez');
    await user.clear(nombreInput);
    await user.type(nombreInput, 'María García');

    expect(nombreInput).toHaveValue('María García');
  });

  it('should call onSave with updated data on submit', async () => {
    const user = userEvent.setup();
    render(<RecordEditModal {...defaultProps} />);

    const nombreInput = screen.getByDisplayValue('Juan Pérez');
    await user.clear(nombreInput);
    await user.type(nombreInput, 'María García');

    const submitBtn = screen.getByRole('button', { name: /Guardar Cambios/ });
    await user.click(submitBtn);

    expect(defaultProps.onSave).toHaveBeenCalledWith('test-id-123', {
      nombre: 'María García',
      telefono: '+573001234567',
      correo: 'juan@uni.edu',
      carrera: 'Ingeniería de Software',
      resultado: 'Agenda',
    });
  });

  it('should call onClose when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<RecordEditModal {...defaultProps} />);

    const cancelBtn = screen.getByRole('button', { name: /Cancelar/ });
    await user.click(cancelBtn);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should show saving state during submit', async () => {
    // Make onSave hang to test loading state
    let resolveSave: (value: boolean) => void;
    const hangingSave = new Promise<boolean>((resolve) => {
      resolveSave = resolve;
    });
    const onSave = vi.fn().mockReturnValue(hangingSave);

    const user = userEvent.setup();
    render(<RecordEditModal {...defaultProps} onSave={onSave} />);

    const submitBtn = screen.getByRole('button', { name: /Guardar Cambios/ });
    await user.click(submitBtn);

    expect(screen.getByText('Guardando...')).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();

    // Resolve to clean up
    resolveSave!(true);
  });

  it('should show error when save fails', async () => {
    const onSave = vi.fn().mockResolvedValue(false);
    const user = userEvent.setup();
    render(<RecordEditModal {...defaultProps} onSave={onSave} />);

    const submitBtn = screen.getByRole('button', { name: /Guardar Cambios/ });
    await user.click(submitBtn);

    expect(await screen.findByText('Error al guardar. Intenta de nuevo.')).toBeInTheDocument();
  });

  it('should have required attribute on nombre field', () => {
    render(<RecordEditModal {...defaultProps} />);
    const nombreInput = screen.getByDisplayValue('Juan Pérez');
    expect(nombreInput).toBeRequired();
  });
});
