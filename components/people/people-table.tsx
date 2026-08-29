"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import type { PersonSummary } from "@/types";

type PersonStatus = "RECEIVABLE" | "PAYABLE" | "SETTLED";

const getStatus = (remainingAmount: number): PersonStatus => {
  if (remainingAmount === 0) {
    return "SETTLED";
  }

  if (remainingAmount > 0) {
    return "RECEIVABLE";
  }

  return "PAYABLE";
};

const STATUS_LABELS: Record<PersonStatus, string> = {
  RECEIVABLE: "You'll receive",
  PAYABLE: "You owe",
  SETTLED: "Settled",
};

const STATUS_VARIANT: Record<
  PersonStatus,
  "profit" | "loss" | "secondary"
> = {
  RECEIVABLE: "profit",
  PAYABLE: "loss",
  SETTLED: "secondary",
};

const getToReceive = (person: PersonSummary) => {
  return Math.max(person.remainingAmount, 0);
};

const getToPay = (person: PersonSummary) => {
  return Math.max(-person.remainingAmount, 0);
};

export function PeopleTable({
  people,
}: {
  people: PersonSummary[];
}) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
              <th className="px-4 py-3">Person</th>
              <th className="px-4 py-3 text-right">To Receive</th>
              <th className="px-4 py-3 text-right">To Pay</th>
              <th className="px-4 py-3 text-right">Net Balance</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {people.map((p) => {
              const status = getStatus(p.remainingAmount);
              const toReceive = getToReceive(p);
              const toPay = getToPay(p);

              return (
                <tr
                  key={p.personName}
                  className="border-b border-border last:border-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    <Link
                      href={`/ people / ${encodeURIComponent(p.personName)} `}
                      className="hover:text-primary"
                    >
                      {p.personName}
                    </Link>
                  </td>

                  <td className="px-4 py-3 text-right text-profit">
                    {formatCurrency(toReceive)}
                  </td>

                  <td className="px-4 py-3 text-right text-loss">
                    {formatCurrency(toPay)}
                  </td>

                  <td className="px-4 py-3 text-right font-medium text-foreground">
                    {formatCurrency(p.remainingAmount)}
                  </td>

                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[status]}>
                      {STATUS_LABELS[status]}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 p-3 lg:hidden">
        {people.map((p) => {
          const status = getStatus(p.remainingAmount);
          const toReceive = getToReceive(p);
          const toPay = getToPay(p);

          return (
            <Link
              key={p.personName}
              href={`/ people / ${encodeURIComponent(p.personName)} `}
              className="rounded-lg border border-border p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-foreground">
                  {p.personName}
                </p>

                <Badge variant={STATUS_VARIANT[status]}>
                  {STATUS_LABELS[status]}
                </Badge>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">To Receive</p>
                  <p className="text-profit">
                    {formatCurrency(toReceive)}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">To Pay</p>
                  <p className="text-loss">
                    {formatCurrency(toPay)}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Net</p>
                  <p className="font-medium text-foreground">
                    {formatCurrency(p.remainingAmount)}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}