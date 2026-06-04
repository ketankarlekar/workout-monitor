import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { loadSession, saveSession, clearSession } from '../storage';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession().then(saved => {
      setUser(saved);
      setIsLoading(false);
    });
  }, []);

  const signIn = async (u: User) => {
    await saveSession(u);
    setUser(u);
  };

  const signOut = async () => {
    await clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
