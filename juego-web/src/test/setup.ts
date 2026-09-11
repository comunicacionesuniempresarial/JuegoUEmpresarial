import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock Supabase client globally
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
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
      then: vi.fn().mockResolvedValue({ data: [], error: null, count: 0 }),
    })),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

// Mock sound module
vi.mock('../lib/sound', () => ({
  sound: {
    playClick: vi.fn(),
    playWin: vi.fn(),
    playLose: vi.fn(),
  },
}));
