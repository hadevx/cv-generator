import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api, type AuthUser } from '../api'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (stored && storedUser) {
      setToken(stored)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  function persist(tok: string, u: AuthUser) {
    localStorage.setItem('token', tok)
    localStorage.setItem('user', JSON.stringify(u))
    setToken(tok)
    setUser(u)
  }

  async function login(email: string, password: string) {
    const res = await api.login(email, password)
    persist(res.token, res.user)
  }

  async function register(email: string, password: string, name: string) {
    const res = await api.register(email, password, name)
    persist(res.token, res.user)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
