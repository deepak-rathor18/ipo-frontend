import { apiClient } from "@/lib/api-client";
import type {
  APIResponse,
  MoneyFilters,
  MoneyFormValues,
  MoneyTransaction,
  Paginated,
  Repayment,
} from "@/types";

export const moneyService = {
  async list(filters: MoneyFilters = {}): Promise<Paginated<MoneyTransaction>> {
    const params = { ...filters };

    if (params.type === "ALL") {
      delete params.type;
    }

    if (params.status === "ALL") {
      delete params.status;
    }

    const { data } = await apiClient.get<PaginatedResponse<MoneyTransaction>>(
      "/money",
      {
        params,
      },
    );

    return {
      data: data.data,
      meta: data.meta,
    };
  },

  async get(id: string): Promise<MoneyTransaction> {
    const { data } = await apiClient.get<APIResponse<MoneyTransaction>>(
      `/money/${id}`,
    );
    return data.data;
  },

  async create(payload: MoneyFormValues): Promise<MoneyTransaction> {
    const { data } = await apiClient.post<APIResponse<MoneyTransaction>>(
      "/money",
      payload,
    );
    return data.data;
  },

  async update(
    id: string,
    payload: Partial<MoneyFormValues>,
  ): Promise<MoneyTransaction> {
    const { data } = await apiClient.put<APIResponse<MoneyTransaction>>(
      `/money/${id}`,
      payload,
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/money/${id}`);
  },

  async listRepayments(transactionId: string): Promise<Repayment[]> {
    const { data } = await apiClient.get<APIResponse<Repayment[]>>(
      `/money/${transactionId}/repayments`,
    );
    return data.data;
  },

  async addRepayment(
    transactionId: string,
    payload: { amount: number; paymentDate: string; notes?: string },
  ): Promise<Repayment> {
    const { data } = await apiClient.post<APIResponse<Repayment>>(
      `/money/${transactionId}/repayments`,
      payload,
    );
    return data.data;
  },

  async updateRepayment(
    id: string,
    payload: Partial<{ amount: number; paymentDate: string; notes: string }>,
  ): Promise<Repayment> {
    const { data } = await apiClient.put<APIResponse<Repayment>>(
      `/repayments/${id}`,
      payload,
    );
    return data.data;
  },

  async removeRepayment(id: string): Promise<void> {
    await apiClient.delete(`/repayments/${id}`);
  },
};
