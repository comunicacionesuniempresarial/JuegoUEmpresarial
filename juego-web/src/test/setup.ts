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

// Mock sound module — mirrors the public API of lib/sound.ts
vi.mock('../lib/sound', () => ({
  sound: {
    playClick: vi.fn(),
    playTick: vi.fn(),
    playVictory: vi.fn(),
    playFind: vi.fn(),
    toggleMute: vi.fn(() => true),
    getSoundEnabled: vi.fn(() => true),
  },
}));
