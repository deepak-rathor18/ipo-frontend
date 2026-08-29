"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { authService } from "@/services/auth.service"
import { normalizeApiError } from "@/lib/api-client"
import type { LoginPayload, User } from "@/types"

interface AuthContextValue {
  user: User | null
  /** True while the initial /auth/me check (or a login/logout call) is in flight. */
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  /** Re-checks the session against the backend, e.g. after a 401. */
  refresh: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const refresh = React.useCallback(async () => {
    try {
      const me = await authService.me()
      setUser(me)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = React.useCallback(
    async (payload: LoginPayload) => {
      setIsLoading(true)
      try {
        const loggedInUser = await authService.login(payload)
        setUser(loggedInUser)
        router.replace("/dashboard")
      } catch (error) {
        throw normalizeApiError(error)
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  const logout = React.useCallback(async () => {
    setIsLoading(true)
    try {
      await authService.logout()
    } finally {
      setUser(null)
      setIsLoading(false)
      router.replace("/login")
    }
  }, [router])

  const value = React.useMemo(
    () => ({ user, isLoading, login, logout, refresh }),
    [user, isLoading, login, logout, refresh]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
