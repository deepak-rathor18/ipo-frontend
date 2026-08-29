"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { ipoService } from "@/services/ipo.service";
import { normalizeApiError } from "@/lib/api-client";
import type { IPO } from "@/types";

import { PageHeader } from "@/components/shared/page-header";
import { IpoForm } from "@/components/ipo/ipo-form";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditIpoPage() {
  const { id } = useParams<{ id: string }>();
  const [ipo, setIpo] = React.useState<IPO | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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

  return (
    <div>
      <PageHeader title="Edit IPO" description="Update this IPO application." />
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : error || !ipo ? (
        <ErrorState message={error ?? "IPO not found."} onRetry={load} />
      ) : (
        <IpoForm ipo={ipo} />
      )}
    </div>
  );
}
