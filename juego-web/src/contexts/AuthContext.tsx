import { createContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { AdminUser } from '../types';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  admin: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('admins')
      .select('id, email, role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      setAdmin(null);
      return null;
    }

    const adminUser: AdminUser = {
      id: data.id,
      email: data.email,
      role: data.role ?? 'admin',
    };
    setAdmin(adminUser);
    return adminUser;
  }, []);

  useEffect(() => {
    let resolveGeneration = 0;

    const resolveSession = async (currentSession: Session | null, generation: number) => {
      setSession(currentSession);
      if (currentSession?.user) {
        await fetchAdminProfile(currentSession.user.id);
      } else {
        setAdmin(null);
      }
      // Only clear loading if this is still the latest resolution
      if (generation === resolveGeneration) {
        setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      const gen = ++resolveGeneration;
      void resolveSession(currentSession, gen);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      // Only show loading spinner for sign-in events, not token refreshes
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        setLoading(true);
      }
      const gen = ++resolveGeneration;
      void resolveSession(newSession, gen);
    });

    return () => subscription.unsubscribe();
  }, [fetchAdminProfile]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { error: error.message };
      }
      return {};
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, admin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
