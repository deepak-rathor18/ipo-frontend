import { apiClient } from "@/lib/api-client"
import type { APIResponse, LoginPayload, User } from "@/types"

export const authService = {
  async login(payload: LoginPayload): Promise<User> {
    const { data } = await apiClient.post<APIResponse<User>>("/auth/login", {
      user: payload.user,
      authCode: payload.authCode,
    })
    return data.data
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout")
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get<APIResponse<User>>("/auth/me")
    return data.data
  },
}
