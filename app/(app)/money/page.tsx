"use client";

import * as React from "react";
import Link from "next/link";
import { PlusCircle, Wallet } from "lucide-react";
import { toast } from "sonner";

import { moneyService } from "@/services/money.service";
import { normalizeApiError } from "@/lib/api-client";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useOnlineStatus } from "@/hooks/use-online-status";
import type { MoneyFilters, MoneyTransaction, PaginationMeta } from "@/types";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { MoneyFiltersBar } from "@/components/money/money-filters";
import { MoneyTable } from "@/components/money/money-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MoneyPage() {
  const isOnline = useOnlineStatus();
  const [filters, setFilters] = React.useState<MoneyFilters>({
    type: "ALL",
    status: "ALL",
    page: 1,
    limit: 10,
  });
  const debouncedSearch = useDebouncedValue(filters.search, 350);

  const [transactions, setTransactions] = React.useState<MoneyTransaction[] | null>(null);
  const [pagination, setPagination] = React.useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<MoneyTransaction | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const effectiveFilters = React.useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  );
  const filtersKey = React.useMemo(() => JSON.stringify(effectiveFilters), [effectiveFilters]);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await moneyService.list(effectiveFilters);

      console.log("MONEY RESULT:", result);
      console.log("MONEY DATA:", result.data);
      console.log("IS ARRAY:", Array.isArray(result.data));

      setTransactions(result.data);
      setPagination(result.meta);
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await moneyService.remove(pendingDelete.id);
      toast.success("Transaction deleted");
      setPendingDelete(null);
      load();
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Money Ledger"
        description="All money given and borrowed, shared between Deepak and Aman."
        actions={
          <Button asChild>
            <Link href="/money/new">
              <PlusCircle className="size-4" />
              Add Transaction
            </Link>
          </Button>
        }
      />

      <Card className="mb-4 p-4">
        <MoneyFiltersBar filters={filters} onChange={setFilters} />
      </Card>

      <Card className="overflow-hidden py-0">
        {isLoading ? (
          <div className="flex flex-col gap-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-4">
            <ErrorState message={error} onRetry={load} />
          </div>
        ) : !transactions || transactions.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={Wallet}
              title="No money transactions found."
              description="Start tracking your money."
              actionLabel="+ Add Transaction"
              actionHref="/money/new"
            />
          </div>
        ) : (
          <>
            <MoneyTable transactions={transactions} onDelete={setPendingDelete} />
            {pagination && (
              <PaginationBar
                pagination={pagination}
                onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
              />
            )}
          </>
        )}
      </Card>

      <DeleteConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete transaction?"
        description="This action will remove the record from normal views."
        onConfirm={handleDelete}
        isDeleting={isDeleting || !isOnline}
      />
    </div>
  );
}
