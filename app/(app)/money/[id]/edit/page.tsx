"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { moneyService } from "@/services/money.service";
import { normalizeApiError } from "@/lib/api-client";
import type { MoneyTransaction } from "@/types";

import { PageHeader } from "@/components/shared/page-header";
import { MoneyForm } from "@/components/money/money-form";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditMoneyPage() {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = React.useState<MoneyTransaction | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await moneyService.get(id);
      setTransaction(data);
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <PageHeader title="Edit Transaction" description="Update this money record." />
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : error || !transaction ? (
        <ErrorState message={error ?? "Transaction not found."} onRetry={load} />
      ) : (
        <MoneyForm transaction={transaction} />
      )}
    </div>
  );
}
