"use client";

import * as React from "react";

import { dashboardService } from "@/services/dashboard.service";
import { normalizeApiError } from "@/lib/api-client";
import { formatCurrency, formatNumber, formatPL, plClass } from "@/lib/format";
import type { DashboardSummary, IPODashboardData, MoneyDashboardData } from "@/types";

import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import {
  MonthlyApplicationsChart,
  MonthlyInvestmentChart,
  IpoProfitLossChart,
  DematWiseChart,
  IpoStatusChart,
  MoneyGivenVsBorrowedChart,
  ReceivableVsPayableChart,
} from "@/components/dashboard/charts";

export default function DashboardPage() {
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null);
  const [ipoData, setIpoData] = React.useState<IPODashboardData | null>(null);
  const [moneyData, setMoneyData] = React.useState<MoneyDashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [s, i, m] = await Promise.all([
        dashboardService.summary(),
        dashboardService.ipo(),
        dashboardService.money(),
      ]);
      setSummary(s);
      setIpoData(i);
      setMoneyData(m);
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Shared overview for Deepak and Aman." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !summary || !ipoData || !moneyData) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Shared overview for Deepak and Aman." />
        <ErrorState message={error ?? "Dashboard data unavailable."} onRetry={load} />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total IPO Applications",
      value: formatNumber(summary.ipo.totalApplications),
    },
    {
      label: "Total Application Amount",
      value: formatCurrency(summary.ipo.totalApplicationAmount),
    },
    {
      label: "Total Actual Investment",
      value: formatCurrency(summary.ipo.totalActualInvestment),
    },
    {
      label: "Total Allotted",
      value: formatNumber(summary.ipo.totalAllotted),
    },
    {
      label: "Total Not Allotted",
      value: formatNumber(summary.ipo.totalNotAllotted),
    },
    {
      label: "Total Listing P/L",
      value: formatPL(summary.ipo.totalListingProfitLoss),
      valueClassName: plClass(summary.ipo.totalListingProfitLoss),
    },
    {
      label: "Total Current P/L",
      value: formatPL(summary.ipo.totalCurrentProfitLoss),
      valueClassName: plClass(summary.ipo.totalCurrentProfitLoss),
    },

    {
      label: "Total Money Given",
      value: formatCurrency(summary.money.totalMoneyGiven),
    },
    {
      label: "Total Money Borrowed",
      value: formatCurrency(summary.money.totalMoneyBorrowed),
    },
    {
      label: "Money To Receive",
      value: formatCurrency(summary.money.moneyToReceive),
      valueClassName: "text-profit",
    },
    {
      label: "Money To Pay",
      value: formatCurrency(summary.money.moneyToPay),
      valueClassName: "text-loss",
    },
    {
      label: "Pending Receivable",
      value: formatCurrency(summary.money.pendingReceivable),
    },
    {
      label: "Pending Payable",
      value: formatCurrency(summary.money.pendingPayable),
    },
    {
      label: "Overdue Receivable",
      value: formatCurrency(summary.money.overdueReceivable),
      valueClassName: "text-warning",
    },
    {
      label: "Overdue Payable",
      value: formatCurrency(summary.money.overduePayable),
      valueClassName: "text-warning",
    },
    {
      label: "Net Balance",
      value: formatPL(summary.netBalance),
      valueClassName: plClass(summary.netBalance),
    },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Shared overview for Deepak and Aman." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Money Receivable vs Payable">
          <ReceivableVsPayableChart
            data={[
              {
                category: "To Receive",
                value: moneyData.moneyToReceive,
              },
              {
                category: "To Pay",
                value: moneyData.moneyToPay,
              },
            ]}
          />
        </ChartCard>
        <ChartCard title="IPO Status">
          <IpoStatusChart
            data={[
              {
                status: "ALLOTTED",
                count: ipoData.totalAllotted,
              },
              {
                status: "NOT_ALLOTTED",
                count: ipoData.totalNotAllotted,
              },
            ]}
          />
        </ChartCard>
        <ChartCard title="IPO Profit / Loss">
          <IpoProfitLossChart
            data={[
              {
                month: "Total",
                listing: ipoData.totalListingProfitLoss,
                current: ipoData.totalCurrentProfitLoss,
              },
            ]}
          />
        </ChartCard>
      </div>
    </div>
  );
}
