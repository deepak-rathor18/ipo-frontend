"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { moneyService } from "@/services/money.service";
import { normalizeApiError } from "@/lib/api-client";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { formatCurrency, formatDate } from "@/lib/format";
import { MONEY_TYPE_LABELS } from "@/constants";
import type { MoneyTransaction, Repayment } from "@/types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { MoneyStatusBadge } from "@/components/shared/status-badges";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { RepaymentList } from "@/components/money/repayment-list";
import { AddRepaymentDialog } from "@/components/money/add-repayment-dialog";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export default function MoneyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isOnline = useOnlineStatus();

  const [transaction, setTransaction] = React.useState<MoneyTransaction | null>(null);
  const [repayments, setRepayments] = React.useState<Repayment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [confirmDeleteTxn, setConfirmDeleteTxn] = React.useState(false);
  const [isDeletingTxn, setIsDeletingTxn] = React.useState(false);
  const [addRepaymentOpen, setAddRepaymentOpen] = React.useState(false);
  const [pendingDeleteRepayment, setPendingDeleteRepayment] = React.useState<Repayment | null>(null);
  const [isDeletingRepayment, setIsDeletingRepayment] = React.useState(false);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [t, r] = await Promise.all([
        moneyService.get(id),
        moneyService.listRepayments(id),
      ]);
      setTransaction(t);
      setRepayments(r);
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleDeleteTransaction = async () => {
    setIsDeletingTxn(true);
    try {
      await moneyService.remove(id);
      toast.success("Transaction deleted");
      router.push("/money");
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    } finally {
      setIsDeletingTxn(false);
    }
  };

  const handleDeleteRepayment = async () => {
    if (!pendingDeleteRepayment) return;
    setIsDeletingRepayment(true);
    try {
      await moneyService.removeRepayment(pendingDeleteRepayment.id);
      toast.success("Repayment deleted");
      setPendingDeleteRepayment(null);
      load();
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    } finally {
      setIsDeletingRepayment(false);
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

  if (error || !transaction) {
    return <ErrorState message={error ?? "Transaction not found."} onRetry={load} />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link href="/money" aria-label="Back to Money Ledger">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {transaction.personName}
              </h2>
              <Badge variant={transaction.type === "GIVEN" ? "profit" : "warning"}>
                {MONEY_TYPE_LABELS[transaction.type]}
              </Badge>
              <MoneyStatusBadge status={transaction.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {transaction.reason || "No reason specified"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/money/${transaction.id}/edit`}>
              <Pencil className="size-4" />
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            className="text-loss hover:text-loss"
            onClick={() => setConfirmDeleteTxn(true)}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <InfoRow label="Original Amount" value={formatCurrency(transaction.amount)} />
            <InfoRow label="Total Paid" value={formatCurrency(transaction.totalPaid)} />
            <InfoRow
              label="Remaining"
              value={<span className="font-semibold">{formatCurrency(transaction.remaining)}</span>}
            />
            <InfoRow label="Status" value={<MoneyStatusBadge status={transaction.status} />} />
            <InfoRow label="Transaction Date" value={formatDate(transaction.transactionDate)} />
            <InfoRow label="Due Date" value={formatDate(transaction.dueDate)} />
            <InfoRow label="Phone" value={transaction.phone || "—"} />
            <InfoRow label="Created By" value={transaction.createdBy} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reason &amp; Notes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <InfoRow label="Reason" value={transaction.reason || "—"} />
            <InfoRow label="Notes" value={transaction.notes || "No notes added."} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Repayment History</CardTitle>
            <Button
              size="sm"
              onClick={() => setAddRepaymentOpen(true)}
              disabled={!isOnline || transaction.remaining <= 0}
            >
              <PlusCircle className="size-4" />
              Add Repayment
            </Button>
          </CardHeader>
          <CardContent>
            <RepaymentList repayments={repayments} onDelete={setPendingDeleteRepayment} />
          </CardContent>
        </Card>
      </div>

      <AddRepaymentDialog
        open={addRepaymentOpen}
        onOpenChange={setAddRepaymentOpen}
        transactionId={transaction.id}
        originalAmount={transaction.amount}
        alreadyPaid={transaction.totalPaid}
        remaining={transaction.remaining}
        onSuccess={load}
      />

      <DeleteConfirmDialog
        open={confirmDeleteTxn}
        onOpenChange={setConfirmDeleteTxn}
        title="Delete transaction?"
        description="This action will remove the record from normal views."
        onConfirm={handleDeleteTransaction}
        isDeleting={isDeletingTxn || !isOnline}
      />

      <DeleteConfirmDialog
        open={!!pendingDeleteRepayment}
        onOpenChange={(open) => !open && setPendingDeleteRepayment(null)}
        title="Delete repayment?"
        description="This action will remove the repayment from normal views."
        onConfirm={handleDeleteRepayment}
        isDeleting={isDeletingRepayment || !isOnline}
      />
    </div>
  );
}
