"use client";

import * as React from "react";
import Link from "next/link";
import { PlusCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { ipoService } from "@/services/ipo.service";
import { normalizeApiError } from "@/lib/api-client";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useOnlineStatus } from "@/hooks/use-online-status";
import type { IPO, IPOFilters, PaginationMeta } from "@/types";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { IpoFiltersBar } from "@/components/ipo/ipo-filters";
import { IpoTable } from "@/components/ipo/ipo-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function IposPage() {
  const isOnline = useOnlineStatus();
  const [filters, setFilters] = React.useState<IPOFilters>({
    status: "ALL",
    page: 1,
    limit: 10,
  });
  const debouncedSearch = useDebouncedValue(filters.search, 350);

  const [ipos, setIpos] = React.useState<IPO[] | null>(null);
  const [pagination, setPagination] = React.useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<IPO | null>(null);
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
      const result = await ipoService.list(effectiveFilters);
      setIpos(result.data);
      setPagination(result.meta);
      console.log("IPO RESULT:", result);
      console.log("IPO RESULT DATA:", result.data);
      console.log("IS ARRAY:", Array.isArray(result.data));
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
      await ipoService.remove(pendingDelete.id);
      toast.success("IPO deleted");
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
        title="IPO Management"
        description="All IPO applications, shared between Deepak and Aman."
        actions={
          <Button asChild>
            <Link href="/ipos/new">
              <PlusCircle className="size-4" />
              Add IPO
            </Link>
          </Button>
        }
      />

      <Card className="mb-4 p-4">
        <IpoFiltersBar filters={filters} onChange={setFilters} />
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
        ) : !ipos || ipos.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={TrendingUp}
              title="No IPOs found."
              description="Start tracking your IPO applications."
              actionLabel="+ Add IPO"
              actionHref="/ipos/new"
            />
          </div>
        ) : (
          <>
            <IpoTable ipos={ipos} onDelete={setPendingDelete} />
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
        title="Delete IPO?"
        description="This action will remove the record from normal views."
        onConfirm={handleDelete}
        isDeleting={isDeleting || !isOnline}
      />
    </div>
  );
}
