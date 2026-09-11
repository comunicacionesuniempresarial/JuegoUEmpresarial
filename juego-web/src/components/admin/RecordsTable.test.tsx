import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RecordsTable } from './RecordsTable';
import type { Registration } from '../../types';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    admin: { id: '1', email: 'admin@test.com', role: 'admin' },
    session: null,
    user: null,
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
  }),
}));

const mockRecords: Registration[] = [
  { id: '1', nombre: 'Juan Pérez', telefono: '+573001234567', juego: 'ruleta', resultado: 'Agenda', created_at: '2026-09-10T10:00:00Z' },
  { id: '2', nombre: 'María García', telefono: '+573007654321', juego: 'busqueda', resultado: '1:23', created_at: '2026-09-10T11:00:00Z' },
  { id: '3', nombre: 'Carlos López', telefono: '+573009876543', juego: 'ruleta', resultado: 'Termo', created_at: '2026-09-10T12:00:00Z' },
  { id: '4', nombre: 'Ana Martínez', telefono: '+573001112222', juego: 'ruleta', resultado: 'Sombrilla', created_at: '2026-09-11T09:00:00Z' },
];

describe('RecordsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    const { container } = render(<RecordsTable records={[]} loading={true} />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should render empty state', () => {
    render(<RecordsTable records={[]} loading={false} />);
    // Desktop + mobile both show empty state
    const emptyMessages = screen.getAllByText('No se encontraron registros.');
    expect(emptyMessages.length).toBeGreaterThanOrEqual(1);
  });

  it('should render records', () => {
    render(<RecordsTable records={mockRecords} loading={false} />);
    // Names appear in both desktop table and mobile cards
    expect(screen.getAllByText('Juan Pérez').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('María García').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Carlos López').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Ana Martínez').length).toBeGreaterThanOrEqual(1);
  });

  it('should filter records by search', async () => {
    const user = userEvent.setup();
    render(<RecordsTable records={mockRecords} loading={false} />);

    const searchInput = screen.getByPlaceholderText(/Buscar/);
    await user.type(searchInput, 'Juan');

    // Juan should still be visible (in both views)
    expect(screen.getAllByText('Juan Pérez').length).toBeGreaterThanOrEqual(1);
    // María should be filtered out from both views
    expect(screen.queryByText('María García')).not.toBeInTheDocument();
  });

  it('should filter records by game type', async () => {
    const user = userEvent.setup();
    render(<RecordsTable records={mockRecords} loading={false} />);

    // Click the first "🎡 Ruleta" button (game filter)
    const ruletaButtons = screen.getAllByText('🎡 Ruleta');
    await user.click(ruletaButtons[0]);

    // Juan should be visible (ruleta)
    expect(screen.getAllByText('Juan Pérez').length).toBeGreaterThanOrEqual(1);
    // María should be filtered out (busqueda)
    expect(screen.queryByText('María García')).not.toBeInTheDocument();
  });

  it('should show prize stats for ruleta', () => {
    render(<RecordsTable records={mockRecords} loading={false} />);
    expect(screen.getByText('Premios más ganados (Ruleta)')).toBeInTheDocument();
    // Agenda appears in both prize stats and table
    expect(screen.getAllByText('Agenda').length).toBeGreaterThanOrEqual(1);
  });

  it('should show date filter buttons', () => {
    render(<RecordsTable records={mockRecords} loading={false} />);
    expect(screen.getByText('Hoy')).toBeInTheDocument();
    expect(screen.getByText('Ayer')).toBeInTheDocument();
    expect(screen.getByText('Últimos 7')).toBeInTheDocument();
    expect(screen.getByText('Últimos 30')).toBeInTheDocument();
  });

  it('should render export buttons', () => {
    render(<RecordsTable records={mockRecords} loading={false} />);
    expect(screen.getByText('CSV')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('should render action buttons', () => {
    render(<RecordsTable records={mockRecords} loading={false} />);
    // View buttons appear in desktop table only (mobile cards don't have title attribute)
    const viewButtons = screen.getAllByTitle('Ver detalle');
    expect(viewButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('should paginate records (more than 10)', () => {
    const manyRecords = Array.from({ length: 15 }, (_, i) => ({
      id: String(i),
      nombre: `Participant${i}`,
      telefono: '+573001234567',
      juego: 'ruleta' as const,
      resultado: 'Agenda',
      created_at: '2026-09-10T10:00:00Z',
    }));

    render(<RecordsTable records={manyRecords} loading={false} />);

    // Pagination text shows page info (appears in both desktop and mobile)
    const pageInfo = screen.getAllByText(/Página/);
    expect(pageInfo.length).toBeGreaterThanOrEqual(1);
    // Should show 10 records on first page (unique names, appear in both views)
    expect(screen.getAllByText('Participant0').length).toBeGreaterThanOrEqual(1);
    // Participant10 should NOT exist (it's on page 2)
    expect(screen.queryAllByText('Participant10').length).toBe(0);
  });

  it('should show game filter chips', () => {
    render(<RecordsTable records={mockRecords} loading={false} />);
    // "Todos" appears in both game filter and date filter
    expect(screen.getAllByText('Todos').length).toBeGreaterThanOrEqual(1);
    // "🎡 Ruleta" appears in game filter AND prize stats
    expect(screen.getAllByText('🎡 Ruleta').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('🔍 Búsqueda').length).toBeGreaterThanOrEqual(1);
  });
});
