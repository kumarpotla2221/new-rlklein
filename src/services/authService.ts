// ============================================================
// AUTH SERVICE — Admin Authentication
// Credentials are checked by Google Apps Script against the private Admins
// sheet. The browser only ever holds a revocable session token issued by the
// server; every admin API call is re-authorized server-side.
// ============================================================

import { apiPost, adminPost, readSession, saveSession, clearSession, ApiError } from './apiClient';
import type { AdminUser } from '../types';

export const authService = {
  async loginAdmin(email: string, password: string): Promise<AdminUser> {
    const result = await apiPost<{ token: string; expiresAt: number; admin: AdminUser }>('login', {
      username: email.trim(),
      password,
    });
    saveSession(result);
    return result.admin;
  },

  logoutAdmin(): void {
    const session = readSession();
    clearSession();
    if (session) {
      // Revoke the token on the server; the local session is already gone either way.
      apiPost('logout', { token: session.token }).catch(() => {});
    }
  },

  /** Last known admin from this tab's session (for first paint only — not an authorization check). */
  getCurrentAdmin(): AdminUser | null {
    return readSession()?.admin ?? null;
  },

  /** Asks the server whether the stored session is still valid. */
  async verifySession(): Promise<AdminUser | null> {
    if (!readSession()) return null;
    try {
      const { admin } = await adminPost<{ admin: AdminUser }>('getSession');
      return admin;
    } catch (err) {
      if (err instanceof ApiError && err.code === 'UNAUTHORIZED') return null;
      // Network trouble: keep the session; the server still checks every admin call.
      return readSession()?.admin ?? null;
    }
  },

  isAuthenticated(): boolean {
    return this.getCurrentAdmin() !== null;
  },
};
