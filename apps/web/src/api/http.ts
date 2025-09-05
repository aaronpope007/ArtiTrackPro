import type { Client, TherapySessionInput, ClientInput } from '@artitrack/shared';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export async function apiFetch<T>(path: string, opts: RequestInit = {}, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {})
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface LoginResponse {
  token: string;
  user: { id: string; email: string; role: 'admin' | 'slp' | 'staff' };
}

export function login(email: string, password: string) {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function getClients(token: string) {
  return apiFetch<Client[]>('/clients', { method: 'GET' }, token);
}

export function getClientById(token: string, id: string) {
  return apiFetch<Client>(`/clients/${id}`, { method: 'GET' }, token);
}

export function createSession(token: string, payload: TherapySessionInput) {
  return apiFetch(`/sessions`, { method: 'POST', body: JSON.stringify(payload) }, token);
}

export function createClient(token: string, payload: ClientInput) {
  return apiFetch<Client>(`/clients`, { method: 'POST', body: JSON.stringify(payload) }, token);
}

export function getSessionsByClient(token: string, clientId: string) {
  return apiFetch<{ id: string; clientId: string; sessionDate: string; overallAccuracy: number }[]>(
    `/sessions/by-client/${clientId}`,
    { method: 'GET' },
    token
  );
}

export function getAllSessions(token: string) {
  return apiFetch<{ id: string; clientId: string; sessionDate: string; overallAccuracy: number }[]>(
    `/sessions`,
    { method: 'GET' },
    token
  );
}


