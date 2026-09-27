import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';
import { SESSION_EXPIRED_EVENT } from '../services/apiClient';
import type { AdminUser } from '../types';

interface AuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(() => authService.getCurrentAdmin());
  const [isLoading, setIsLoading] = useState(false);
  // A stored session is confirmed with the server before admin pages render.
  const [isVerifying, setIsVerifying] = useState(() => authService.getCurrentAdmin() !== null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isVerifying) return;
    let cancelled = false;
    authService.verifySession()
      .then((verified) => { if (!cancelled) setAdmin(verified); })
      .finally(() => { if (!cancelled) setIsVerifying(false); });
    return () => { cancelled = true; };
  }, [isVerifying]);

  // Any admin API call rejected by the server signs the UI out.
  useEffect(() => {
    const handleExpired = () => setAdmin(null);
    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.loginAdmin(email, password);
      setAdmin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logoutAdmin();
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      admin,
      isAuthenticated: !!admin,
      isLoading: isLoading || isVerifying,
      error,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
