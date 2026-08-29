import { apiClient } from "@/lib/api-client";
import type {
  APIResponse,
  IPOReportRow,
  MoneyReportRow,
  ReportFilters,
} from "@/types";

export const reportService = {
  async ipo(filters: ReportFilters = {}): Promise<IPOReportRow[]> {
    const { data } = await apiClient.get<
      APIResponse<{
        items: IPOReportRow[];
        count: number;
        totals: Record<string, number>;
      }>
    >("/reports/ipo", {
      params: filters,
    });

    return data.data.items;
  },

  async money(filters: ReportFilters = {}): Promise<MoneyReportRow[]> {
    const { data } = await apiClient.get<
      APIResponse<{
        items: MoneyReportRow[];
        count: number;
        totals: {
          totalGiven: number;
          totalBorrowed: number;
          totalPaid: number;
          totalRemaining: number;
        };
      }>
    >("/reports/money", {
      params: filters,
    });

    return data.data.items;
  },

  async combined(filters: ReportFilters = {}): Promise<{
    ipo: IPOReportRow[];
    money: MoneyReportRow[];
  }> {
    const { data } = await apiClient.get<
      APIResponse<{
        ipo: {
          items: IPOReportRow[];
        };
        money: {
          items: MoneyReportRow[];
        };
      }>
    >("/reports/combined", {
      params: filters,
    });

    return {
      ipo: data.data.ipo.items,
      money: data.data.money.items,
    };
  },
};
