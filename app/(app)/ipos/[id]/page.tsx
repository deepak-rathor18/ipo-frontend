"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { ipoService } from "@/services/ipo.service";
import { normalizeApiError } from "@/lib/api-client";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { formatCurrency, formatDate, formatPL, plClass } from "@/lib/format";
import type { IPO } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { IpoStatusBadge } from "@/components/shared/status-badges";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export default function IpoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isOnline = useOnlineStatus();

  const [ipo, setIpo] = React.useState<IPO | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ipoService.get(id);
      setIpo(data);
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await ipoService.remove(id);
      toast.success("IPO deleted");
      router.push("/ipos");
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !ipo) {
    return <ErrorState message={error ?? "IPO not found."} onRetry={load} />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link href="/ipos" aria-label="Back to IPOs">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {ipo.ipoName}
              </h2>
              <IpoStatusBadge status={ipo.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{ipo.companyName}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/ipos/${ipo.id}/edit`}>
              <Pencil className="size-4" />
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            className="text-loss hover:text-loss"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Application Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <InfoRow label="Applied Date" value={formatDate(ipo.appliedDate)} />
            <InfoRow label="Demat Name" value={ipo.dematName} />
            <InfoRow label="Application Amount" value={formatCurrency(ipo.applicationAmount)} />
            <InfoRow label="Application Price" value={formatCurrency(ipo.applicationPrice)} />
            <InfoRow label="Lot Size" value={ipo.lotSize} />
            <InfoRow label="Lots Applied" value={ipo.lotsApplied} />
            <InfoRow label="Shares Applied" value={ipo.sharesApplied} />
            <InfoRow label="Created By" value={ipo.createdBy} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Allotment</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <InfoRow label="Allotted Shares" value={ipo.allottedShares ?? "—"} />
            <InfoRow
              label="Allotment Price"
              value={ipo.allotmentPrice ? formatCurrency(ipo.allotmentPrice) : "—"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Listing</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <InfoRow label="Listing Date" value={formatDate(ipo.listingDate)} />
            <InfoRow
              label="Listing Price"
              value={ipo.listingPrice ? formatCurrency(ipo.listingPrice) : "—"}
            />
            <InfoRow
              label="Current Price"
              value={ipo.currentPrice ? formatCurrency(ipo.currentPrice) : "—"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profit / Loss</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <InfoRow
              label="Listing P/L"
              value={
                <span className={plClass(ipo.listingProfitLoss)}>
                  {formatPL(ipo.listingProfitLoss)}
                </span>
              }
            />
            <InfoRow
              label="Current P/L"
              value={
                <span className={plClass(ipo.currentProfitLoss)}>
                  {formatPL(ipo.currentProfitLoss)}
                </span>
              }
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">{ipo.notes || "No notes added."}</p>
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete IPO?"
        description="This action will remove the record from normal views."
        onConfirm={handleDelete}
        isDeleting={isDeleting || !isOnline}
      />
    </div>
  );
}
