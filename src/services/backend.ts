// Backend adapter for the Google Apps Script Web App.
// The GAS URL is user-configurable (Settings) and stored locally, so the same
// build works for Cameroon and US deployments — or in demo mode with no backend.

const URL_KEY = "t21.backendUrl";
const TOKEN_KEY = "t21.token";

export const getBackendUrl = () => localStorage.getItem(URL_KEY) ?? "";
export const setBackendUrl = (url: string) => localStorage.setItem(URL_KEY, url.trim());
export const getToken = () => localStorage.getItem(TOKEN_KEY) ?? "";
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
export const hasBackend = () => getBackendUrl().startsWith("https://");

export class BackendError extends Error {
  constructor(message: string, public code?: string) { super(message); }
}

/**
 * Calls the Apps Script router. POST with text/plain body is a "simple request"
 * (no CORS preflight), which Apps Script Web Apps accept and answer readably.
 */
export async function api<T = unknown>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  if (!hasBackend()) throw new BackendError("No backend configured. Add your Apps Script URL in Settings.", "NO_BACKEND");
  const res = await fetch(getBackendUrl(), {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, token: getToken(), ...payload })
  });
  const data = await res.json();
  if (!data.ok) throw new BackendError(data.error ?? "Request failed", data.code);
  return data.result as T;
}
