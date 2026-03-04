import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadStoredToken, setAuthToken } from '@/api/client';
import { AuthResponse, User, login as apiLogin, register as apiRegister, logout as apiLogout, me } from '@/api/auth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login(email: string, password: string): Promise<void>;
  register(data: { name: string; email: string; password: string; password_confirmation: string }): Promise<void>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const BOOTSTRAP_TIMEOUT_MS = 5000;

    const bootstrap = async () => {
      try {
        const token = await loadStoredToken();
        if (token) {
          await setAuthToken(token);
          const u = await me();
          setUser(u);
        }
      } catch {
        await setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, BOOTSTRAP_TIMEOUT_MS);

    bootstrap().finally(() => {
      clearTimeout(timeoutId);
      setLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res: AuthResponse = await apiLogin({ email, password });
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; password_confirmation: string }) => {
    setLoading(true);
    try {
      const res: AuthResponse = await apiRegister(data);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

