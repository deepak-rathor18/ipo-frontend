import { apiClient } from "@/lib/api-client"
import type { APIResponse, MoneyTransaction, PersonSummary } from "@/types"

export const peopleService = {
async list(): Promise<PersonSummary[]> {
  const { data } = await apiClient.get<APIResponse<PersonSummary[]>>(
    "/people"
  );

  return data.data;
},

  async get(name: string): Promise<{
    summary: PersonSummary
    transactions: MoneyTransaction[]
  }> {
    const { data } = await apiClient.get<
      APIResponse<{ summary: PersonSummary; transactions: MoneyTransaction[] }>
    >(`/people/${encodeURIComponent(name)}`)
    return data.data
  },
}
