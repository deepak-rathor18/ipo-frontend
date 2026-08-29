"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { reportService } from "@/services/report.service";
import { exportService } from "@/services/export.service";
import { normalizeApiError } from "@/lib/api-client";
import type { IPOReportRow, MoneyReportRow, ReportFilters } from "@/types";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ReportFiltersBar } from "@/components/reports/report-filters";
import { IpoReportTable, MoneyReportTable } from "@/components/reports/report-tables";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ReportTab = "ipo" | "money" | "combined";

export default function ReportsPage() {
  const [tab, setTab] = React.useState<ReportTab>("ipo");
  const [filters, setFilters] = React.useState<ReportFilters>({});

  const [ipoRows, setIpoRows] = React.useState<IPOReportRow[] | null>(null);
  const [moneyRows, setMoneyRows] = React.useState<MoneyReportRow[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isExporting, setIsExporting] = React.useState(false);
  const filtersKey = React.useMemo(() => JSON.stringify(filters), [filters]);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (tab === "ipo") {
        setIpoRows(await reportService.ipo(filters));
      } else if (tab === "money") {
        setMoneyRows(await reportService.money(filters));
      } else {
        const combined = await reportService.combined(filters);
        setIpoRows(combined.ipo);
        setMoneyRows(combined.money);
      }
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, filtersKey]);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params = filters as unknown as Record<string, string>;
      if (tab === "ipo") await exportService.ipos(params);
      else if (tab === "money") await exportService.money(params);
      else await exportService.complete(params);
      toast.success("Export started");
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Reports"
        description="IPO, money, and combined reports with export to CSV."
        actions={
          <Button onClick={handleExport} disabled={isExporting} variant="outline">
            {isExporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            Export CSV
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as ReportTab)}>
        <TabsList className="mb-4">
          <TabsTrigger value="ipo">IPO Report</TabsTrigger>
          <TabsTrigger value="money">Money Report</TabsTrigger>
          <TabsTrigger value="combined">Combined Report</TabsTrigger>
        </TabsList>

        <Card className="mb-4 p-4">
          <ReportFiltersBar filters={filters} onChange={setFilters} showIpoFields={tab !== "money"} />
        </Card>

        <TabsContent value="ipo">
          <Card className="overflow-hidden py-0">
            {isLoading ? (
              <LoadingRows />
            ) : error ? (
              <div className="p-4">
                <ErrorState message={error} onRetry={load} />
              </div>
            ) : !ipoRows || ipoRows.length === 0 ? (
              <div className="p-4">
                <EmptyState title="No results" description="No IPOs match these filters." />
              </div>
            ) : (
              <IpoReportTable rows={ipoRows} />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="money">
          <Card className="overflow-hidden py-0">
            {isLoading ? (
              <LoadingRows />
            ) : error ? (
              <div className="p-4">
                <ErrorState message={error} onRetry={load} />
              </div>
            ) : !moneyRows || moneyRows.length === 0 ? (
              <div className="p-4">
                <EmptyState title="No results" description="No transactions match these filters." />
              </div>
            ) : (
              <MoneyReportTable rows={moneyRows} />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="combined" className="flex flex-col gap-4">
          <Card className="overflow-hidden py-0">
            <p className="border-b border-border px-4 py-3 text-sm font-medium text-foreground">
              IPO Applications
            </p>
            {isLoading ? (
              <LoadingRows />
            ) : !ipoRows || ipoRows.length === 0 ? (
              <div className="p-4">
                <EmptyState title="No results" description="No IPOs match these filters." />
              </div>
            ) : (
              <IpoReportTable rows={ipoRows} />
            )}
          </Card>
          <Card className="overflow-hidden py-0">
            <p className="border-b border-border px-4 py-3 text-sm font-medium text-foreground">
              Money Transactions
            </p>
            {isLoading ? (
              <LoadingRows />
            ) : !moneyRows || moneyRows.length === 0 ? (
              <div className="p-4">
                <EmptyState title="No results" description="No transactions match these filters." />
              </div>
            ) : (
              <MoneyReportTable rows={moneyRows} />
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="flex flex-col gap-3 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}
