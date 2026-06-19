import type { CVData } from './types'

const BASE = '/api'

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders() } as HeadersInit,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Request failed')
  return data as T
}

export interface AuthUser {
  id: number
  email: string
  name: string
}

interface AuthResponse {
  token: string
  user: AuthUser
}

export const api = {
  register: (email: string, password: string, name: string) =>
    request<AuthResponse>('POST', '/auth/register', { email, password, name }),

  login: (email: string, password: string) =>
    request<AuthResponse>('POST', '/auth/login', { email, password }),

  loadCV: () => request<{ cv: CVData | null }>('GET', '/cv'),

  saveCV: (cv: CVData) => request<{ ok: boolean }>('PUT', '/cv', { cv }),
}
