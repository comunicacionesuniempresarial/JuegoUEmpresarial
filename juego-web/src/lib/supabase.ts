import { createClient } from '@supabase/supabase-js';

function requireEnv(name: string): string {
  const value = import.meta.env[name];
  if (typeof value !== 'string' || value === '') {
    throw new Error(
      `Missing environment variable "${name}". Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.`
    );
  }
  return value;
}

export const supabase = createClient(
  requireEnv('VITE_SUPABASE_URL'),
  requireEnv('VITE_SUPABASE_ANON_KEY'),
);
