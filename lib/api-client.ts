import axios, { AxiosError } from "axios"

/**
 * Central Axios instance.
 *
 * - Base URL comes from NEXT_PUBLIC_API_URL only. Never hardcode it in components.
 * - `withCredentials: true` sends the HTTP-only auth cookie set by the backend.
 * - No token is ever read from or written to any browser storage here.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export interface NormalizedApiError {
  status: number | null
  message: string
  errors?: Record<string, string[]>
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>
    return {
      status: err.response?.status ?? null,
      message:
        err.response?.data?.message ??
        (err.code === "ERR_NETWORK"
          ? "Couldn't reach the server. Check your connection and try again."
          : "Something went wrong. Please try again."),
      errors: err.response?.data?.errors,
    }
  }
  return { status: null, message: "Something went wrong. Please try again." }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401s are handled by the calling code / AuthProvider (redirect to /login),
    // never by forcing a hard navigation here, since some 401s are expected
    // (e.g. the initial /auth/me check on a fresh visit).
    return Promise.reject(error)
  }
)
