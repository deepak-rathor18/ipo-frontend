
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { peopleService } from "@/services/people.service";
import { normalizeApiError } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format";
import type { MoneyTransaction, PersonSummary } from "@/types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { MoneyTable } from "@/components/money/money-table";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { moneyService } from "@/services/money.service";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { toast } from "sonner";

const STATUS_LABELS = {
  RECEIVABLE: "You'll receive",
  PAYABLE: "You owe",
  SETTLED: "Settled",
} as const;

const STATUS_VARIANT = {
  RECEIVABLE: "profit",
  PAYABLE: "loss",
  SETTLED: "secondary",
} as const;

const getStatus = (summary: PersonSummary) => {
  if (summary.remainingAmount > 0) return "RECEIVABLE";
  if (summary.remainingAmount < 0) return "PAYABLE";
  return "SETTLED";
};

export default function PersonDetailPage() {
  const params = useParams<{ name: string }>();
  const name = decodeURIComponent(params.name);
  const isOnline = useOnlineStatus();

  const [summary, setSummary] = React.useState<PersonSummary | null>(null);
  const [transactions, setTransactions] = React.useState<MoneyTransaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [pendingDelete, setPendingDelete] =
    React.useState<MoneyTransaction | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await peopleService.get(name);
      setSummary(data.summary);
      setTransactions(data.transactions);
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, [name]);

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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !summary) {
    return (
      <ErrorState
        message={error ?? "Person not found."}
        onRetry={load}
      />
    );
  }

  const status = getStatus(summary);

  const toReceive = Math.max(
    0,
    summary.totalGiven - summary.totalReceived
  );

  const toPay = Math.max(
    0,
    summary.totalBorrowed - summary.totalPaid
  );

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="shrink-0"
        >
          <Link href="/people" aria-label="Back to People">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {summary.personName}
            </h2>

            <Badge variant={STATUS_VARIANT[status]}>
              {STATUS_LABELS[status]}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">
            To Receive
          </p>

          <p className="mt-1.5 text-xl font-semibold text-profit">
            {formatCurrency(toReceive)}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">
            To Pay
          </p>

          <p className="mt-1.5 text-xl font-semibold text-loss">
            {formatCurrency(toPay)}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Net Balance
          </p>

          <p className="mt-1.5 text-xl font-semibold text-foreground">
            {formatCurrency(summary.remainingAmount)}
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden py-0">
        {transactions.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="No transactions found."
              description={`No money transactions recorded for ${summary.personName} yet.`}
              actionLabel="+ Add Transaction"
              actionHref="/money/new"
            />
          </div>
        ) : (
          <MoneyTable
            transactions={transactions}
            onDelete={setPendingDelete}
          />
        )}
      </Card>

      <DeleteConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) =>
          !open && setPendingDelete(null)
        }
        title="Delete transaction?"
        description="This action will remove the record from normal views."
        onConfirm={handleDelete}
        isDeleting={isDeleting || !isOnline}
      />
    </div>
  );
}
