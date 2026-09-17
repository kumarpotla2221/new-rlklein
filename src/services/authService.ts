// ============================================================
// AUTH SERVICE — Admin Authentication
// NOTE: In production, this must connect to a secure backend.
// Never store real credentials in frontend code.
// ============================================================

import type { AdminUser } from '../types';

const ADMIN_SESSION_KEY = 'rlk_admin_session';

// DEVELOPMENT ONLY — replace with real auth endpoint in production
const DEV_ADMIN_CREDENTIALS = {
  email: 'admin@rlklein.com',
  password: 'RLK-Admin-2024!',
};

const DEV_ADMIN_USER: AdminUser = {
  id: 'admin-001',
  email: 'admin@rlklein.com',
  name: 'R.L. Klein Administrator',
  role: 'admin',
};

export const authService = {
  async loginAdmin(email: string, password: string): Promise<AdminUser> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // DEVELOPMENT: In production, call your auth API here
    if (
      email === DEV_ADMIN_CREDENTIALS.email &&
      password === DEV_ADMIN_CREDENTIALS.password
    ) {
      const token = btoa(JSON.stringify({ userId: DEV_ADMIN_USER.id, exp: Date.now() + 3600000 * 8 }));
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ user: DEV_ADMIN_USER, token }));
      return DEV_ADMIN_USER;
    }
    throw new Error('Invalid credentials. Please check your email and password.');
  },

  logoutAdmin(): void {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  },

  getCurrentAdmin(): AdminUser | null {
    try {
      const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (!session) return null;
      const { user, token } = JSON.parse(session);
      const decoded = JSON.parse(atob(token));
      if (decoded.exp < Date.now()) {
        this.logoutAdmin();
        return null;
      }
      return user as AdminUser;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getCurrentAdmin() !== null;
  },
};
