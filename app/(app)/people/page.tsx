"use client";

import * as React from "react";
import { Users } from "lucide-react";

import { peopleService } from "@/services/people.service";
import { normalizeApiError } from "@/lib/api-client";
import type { PersonSummary } from "@/types";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PeopleTable } from "@/components/people/people-table";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PeoplePage() {
  const [people, setPeople] = React.useState<PersonSummary[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const people = await peopleService.list();

      setPeople(people);
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, []);


  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <PageHeader
        title="People"
        description="Everyone with a money-given or money-borrowed record."
      />

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
        ) : !people || people.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={Users}
              title="No people found."
              description="People appear here once you add a money transaction."
              actionLabel="+ Add Transaction"
              actionHref="/money/new"
            />
          </div>
        ) : (
          <PeopleTable people={people} />
        )}
      </Card>
    </div>
  );
}
