import { apiClient } from "@/lib/api-client";
import type {
  APIResponse,
  IPO,
  IPOFilters,
  IPOFormValues,
  Paginated,
} from "@/types";

export const ipoService = {
  async list(filters: IPOFilters = {}): Promise<Paginated<IPO>> {
    const { data } = await apiClient.get("/ipos", {
      params: filters,
    });

    return {
      data: data.data,
      meta: data.meta,
    };
  },

  async get(id: string): Promise<IPO> {
    const { data } = await apiClient.get<APIResponse<IPO>>(`/ipos/${id}`);
    return data.data;
  },

  async create(payload: IPOFormValues): Promise<IPO> {
    const { data } = await apiClient.post<APIResponse<IPO>>("/ipos", payload);
    return data.data;
  },

  async update(id: string, payload: Partial<IPOFormValues>): Promise<IPO> {
    const { data } = await apiClient.put<APIResponse<IPO>>(
      `/ipos/${id}`,
      payload,
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/ipos/${id}`);
  },
};
