import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuditLog } from './AuditLog';
import { supabase } from '../../lib/supabase';

const mockSupabase = vi.mocked(supabase);

function setupAuditQuery(data: any[] = [], count: number = 0) {
  const countResult = { data: null, error: null, count };
  const dataResult = { data, error: null, count };
  const dataChain: any = {};
  dataChain.select = vi.fn().mockReturnValue(dataChain);
  dataChain.order = vi.fn().mockReturnValue(dataChain);
  dataChain.range = vi.fn().mockReturnValue(Promise.resolve(dataResult));

  return {
    select: vi.fn().mockImplementation((_cols: string, opts?: any) => {
      // select('*', { count: 'exact', head: true }) → count query, returns Promise directly
      if (opts?.count === 'exact' && opts?.head) {
        return Promise.resolve(countResult);
      }
      // Normal select → chainable
      return dataChain;
    }),
    order: vi.fn().mockReturnValue(dataChain),
    range: vi.fn().mockReturnValue(Promise.resolve(dataResult)),
  };
}

describe('AuditLog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render empty state', async () => {
    mockSupabase.from.mockReturnValue(setupAuditQuery([], 0) as any);
    render(<AuditLog />);

    expect(await screen.findByText(/No hay eventos/)).toBeInTheDocument();
  });

  it('should render audit entries', async () => {
    const entries = [
      { id: '1', user_id: 'u1', action: 'update', table_name: 'records', record_id: 'r1', created_at: '2026-09-10T10:00:00Z' },
      { id: '2', user_id: 'u1', action: 'soft_delete', table_name: 'records', record_id: 'r2', created_at: '2026-09-10T11:00:00Z' },
    ];
    mockSupabase.from.mockReturnValue(setupAuditQuery(entries, 2) as any);

    render(<AuditLog />);

    // Action labels appear in both desktop table and mobile cards
    const editLabels = await screen.findAllByText('Edición');
    expect(editLabels.length).toBeGreaterThanOrEqual(1);
    const archiveLabels = screen.getAllByText('Archivado');
    expect(archiveLabels.length).toBeGreaterThanOrEqual(1);
  });

  it('should show correct action labels', async () => {
    const entries = [
      { id: '1', action: 'update', table_name: 'records', created_at: '2026-09-10T10:00:00Z' },
      { id: '2', action: 'soft_delete', table_name: 'records', created_at: '2026-09-10T10:00:00Z' },
      { id: '3', action: 'hard_delete', table_name: 'records', created_at: '2026-09-10T10:00:00Z' },
      { id: '4', action: 'restore', table_name: 'records', created_at: '2026-09-10T10:00:00Z' },
    ];
    mockSupabase.from.mockReturnValue(setupAuditQuery(entries, 4) as any);

    render(<AuditLog />);

    // Labels appear in both desktop table and mobile cards
    await screen.findAllByText('Edición');
    expect(screen.getAllByText('Archivado').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Eliminación').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Restaurado').length).toBeGreaterThanOrEqual(1);
  });

  it('should show empty state when no entries', async () => {
    mockSupabase.from.mockReturnValue(setupAuditQuery([], 0) as any);

    render(<AuditLog />);

    expect(await screen.findByText(/No hay eventos/)).toBeInTheDocument();
  });

  it('should show loading indicator initially', () => {
    mockSupabase.from.mockReturnValue(setupAuditQuery([], 50) as any);
    const { container } = render(<AuditLog />);
    // Loading spinner should be visible while data loads
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });
});
