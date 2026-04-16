'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { PublicUser } from '@/core/domain/entities/User';
import { useRouter } from 'next/navigation';

interface AuthContextValue {
  user: PublicUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    displayName: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: PublicUser | null;
}) {
  const [user, setUser] = useState<PublicUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        setUser(data.user);
        router.push('/');
        router.refresh();
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const register = useCallback(
    async (email: string, username: string, displayName: string, password: string) => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, username, displayName, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        setUser(data.user);
        router.push('/');
        router.refresh();
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
