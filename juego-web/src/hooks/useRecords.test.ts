import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRecords } from './useRecords';
import { supabase } from '../lib/supabase';

// Get the mocked supabase
const mockSupabase = vi.mocked(supabase);

function setupQueryChain(data: any[] = [], error: any = null, count: number = 0) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    then: vi.fn((resolve: any) => resolve({ data, error, count })),
  };
  return chain;
}

describe('useRecords', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty state', () => {
    mockSupabase.from.mockReturnValue(setupQueryChain() as any);
    const { result } = renderHook(() => useRecords());

    expect(result.current.records).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should fetch records successfully', async () => {
    const mockRecords = [
      { id: '1', nombre: 'Juan', telefono: '+573001234567', juego: 'ruleta', resultado: 'Agenda', created_at: '2026-09-10T10:00:00Z' },
      { id: '2', nombre: 'María', telefono: '+573007654321', juego: 'busqueda', resultado: '1:23', created_at: '2026-09-10T11:00:00Z' },
    ];
    mockSupabase.from.mockReturnValue(setupQueryChain(mockRecords) as any);

    const { result } = renderHook(() => useRecords());

    await act(async () => {
      await result.current.fetchRecords();
    });

    expect(result.current.records).toHaveLength(2);
    expect(result.current.records[0].nombre).toBe('Juan');
  });

  it('should filter by juego', async () => {
    const mockRecords = [
      { id: '1', nombre: 'Juan', telefono: '+573001234567', juego: 'ruleta', resultado: 'Agenda' },
    ];
    mockSupabase.from.mockReturnValue(setupQueryChain(mockRecords) as any);

    const { result } = renderHook(() => useRecords());

    await act(async () => {
      await result.current.fetchRecords({ juego: 'ruleta' });
    });

    // Verify eq filter was called
    const fromCall = mockSupabase.from.mock.results[0].value;
    expect(fromCall.eq).toHaveBeenCalledWith('juego', 'ruleta');
  });

  it('should filter by date range', async () => {
    mockSupabase.from.mockReturnValue(setupQueryChain([]) as any);

    const { result } = renderHook(() => useRecords());

    await act(async () => {
      await result.current.fetchRecords({
        dateRange: {
          from: '2026-09-10T00:00:00Z',
          to: '2026-09-10T23:59:59Z',
        },
      });
    });

    const fromCall = mockSupabase.from.mock.results[0].value;
    expect(fromCall.gte).toHaveBeenCalledWith('created_at', '2026-09-10T00:00:00Z');
    expect(fromCall.lt).toHaveBeenCalled();
  });

  it('should handle fetch errors', async () => {
    mockSupabase.from.mockReturnValue(setupQueryChain([], { message: 'Connection failed' }) as any);

    const { result } = renderHook(() => useRecords());

    await act(async () => {
      await result.current.fetchRecords();
    });

    expect(result.current.error).toBe('Connection failed');
    expect(result.current.records).toEqual([]);
  });

  it('should soft delete a record', async () => {
    const updateChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    };
    mockSupabase.from
      .mockReturnValueOnce(updateChain as any) // for update
      .mockReturnValueOnce({ insert: vi.fn().mockResolvedValue({ error: null }) } as any); // for audit_log

    const { result } = renderHook(() => useRecords());

    let success: boolean = false;
    await act(async () => {
      success = await result.current.softDeleteRecord('record-1');
    });

    expect(success).toBe(true);
    expect(updateChain.update).toHaveBeenCalledWith(
      expect.objectContaining({ deleted_at: expect.any(String) })
    );
  });

  it('should update a record', async () => {
    const updateChain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    };
    mockSupabase.from
      .mockReturnValueOnce(updateChain as any)
      .mockReturnValueOnce({ insert: vi.fn().mockResolvedValue({ error: null }) } as any);

    const { result } = renderHook(() => useRecords());

    let success: boolean = false;
    await act(async () => {
      success = await result.current.updateRecord('record-1', {
        nombre: 'Juan Actualizado',
        telefono: '+573001234567',
      });
    });

    expect(success).toBe(true);
    expect(updateChain.update).toHaveBeenCalledWith(
      expect.objectContaining({ nombre: 'Juan Actualizado' })
    );
  });
});
