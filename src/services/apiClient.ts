// ============================================================
// API CLIENT — the only place that talks to the Google Apps Script Web App.
//
// VITE_API_URL is the public Web App URL (it ends in /exec). Vite puts every
// VITE_* variable into the public JavaScript bundle, so it must never hold a
// password, token, or Google credential — the URL alone grants no admin access.
//
// Requests are CORS "simple requests" (GET, or POST with a text/plain body)
// because Apps Script cannot answer CORS preflight requests.
// ============================================================

import type { AdminUser } from '../types';

const API_URL = (import.meta.env.VITE_API_URL ?? '').trim();
const SESSION_KEY = 'rlk_admin_session';

/** Fired when the server rejects the admin token, so the UI can sign out. */
export const SESSION_EXPIRED_EVENT = 'rlk:admin-session-expired';

export class ApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

// ------------------------------------------------------------
// Admin session storage. Holds a revocable session token issued by the
// server — never the password. sessionStorage clears when the tab closes.
// ------------------------------------------------------------

export interface StoredSession {
  token: string;
  expiresAt: number;
  admin: AdminUser;
}

export function readSession(): StoredSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as StoredSession;
    if (!session.token || !session.admin || session.expiresAt < Date.now()) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveSession(session: StoredSession): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Storage unavailable: the session lasts for this page load only.
  }
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to clear.
  }
}

// ------------------------------------------------------------
// Requests
// ------------------------------------------------------------

async function send<T>(url: string, init: RequestInit): Promise<T> {
  if (!API_URL) {
    throw new ApiError('CONFIG', 'The job portal is not connected yet. Please try again later.');
  }

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new ApiError('NETWORK', 'Unable to reach the server. Please check your connection and try again.');
  }
  if (!response.ok) {
    throw new ApiError(`HTTP_${response.status}`, 'The server is unavailable right now. Please try again shortly.');
  }

  let payload: ApiResponse<T>;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError('BAD_RESPONSE', 'Received an unexpected response from the server.');
  }

  if (!payload.ok) {
    if (payload.error.code === 'UNAUTHORIZED') {
      clearSession();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    throw new ApiError(payload.error.code, payload.error.message);
  }
  return payload.data;
}

function actionUrl(action: string, params: Record<string, string> = {}): string {
  const url = new URL(API_URL);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.toString();
}

/** Public read-only endpoints. */
export function apiGet<T>(action: string, params: Record<string, string> = {}): Promise<T> {
  return send<T>(API_URL ? actionUrl(action, params) : '', { method: 'GET' });
}

/** Public write endpoints (login, application submission). */
export function apiPost<T>(action: string, body: Record<string, unknown> = {}): Promise<T> {
  return send<T>(API_URL ? actionUrl(action) : '', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  });
}

/** Admin endpoints. The server verifies the token on every call. */
export function adminPost<T>(action: string, body: Record<string, unknown> = {}): Promise<T> {
  const session = readSession();
  if (!session) {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    return Promise.reject(new ApiError('UNAUTHORIZED', 'Your session has expired. Please sign in again.'));
  }
  return apiPost<T>(action, { ...body, token: session.token });
}

export function errorMessage(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}
