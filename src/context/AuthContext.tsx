import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEV_EMAIL = process.env.EXPO_PUBLIC_DEV_EMAIL ?? '';
const DEV_PASSWORD = process.env.EXPO_PUBLIC_DEV_PASSWORD ?? '';

// Minimal mock session used in dev mode — satisfies the Session shape for routing.
const makeDevSession = (): Session =>
  ({
    access_token: 'dev-access-token',
    refresh_token: 'dev-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: {
      id: 'dev-user-00000000-0000-0000-0000-000000000000',
      email: DEV_EMAIL,
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    },
  } as Session);

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      if (email === DEV_EMAIL && password === DEV_PASSWORD) {
        setSession(makeDevSession());
        return null;
      }
      return 'Invalid email or password (dev mode)';
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  };

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return 'Sign-up is disabled in dev mode. Use the test credentials to sign in.';
    }
    const { error } = await supabase.auth.signUp({ email, password });
    return error?.message ?? null;
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
