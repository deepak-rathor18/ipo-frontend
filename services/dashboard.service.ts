import { apiClient } from "@/lib/api-client";
import type {
  APIResponse,
  DashboardSummary,
  IPODashboardData,
  MoneyDashboardData,
} from "@/types";

export const dashboardService = {
  async summary(): Promise<DashboardSummary> {
    const { data } =
      await apiClient.get<APIResponse<DashboardSummary>>("/dashboard/summary");

    return data.data;
  },

  async ipo(): Promise<IPODashboardData> {
    const { data } =
      await apiClient.get<APIResponse<IPODashboardData>>("/dashboard/ipo");

    return data.data;
  },

  async money(): Promise<MoneyDashboardData> {
    const { data } =
      await apiClient.get<APIResponse<MoneyDashboardData>>("/dashboard/money");

    return data.data;
  },
};
