"use client"

import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Repayment } from "@/types"

export function RepaymentList({
  repayments,
  onDelete,
}: {
  repayments: Repayment[]
  onDelete: (repayment: Repayment) => void
}) {
  if (repayments.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No repayments recorded yet.
      </p>
    )
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {repayments.map((r) => (
        <li key={r.id} className="flex items-center justify-between gap-3 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">{formatCurrency(r.amount)}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(r.paymentDate)} · {r.createdBy}
              {r.notes ? ` · ${r.notes}` : ""}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 shrink-0 text-loss hover:text-loss"
            aria-label="Delete repayment"
            onClick={() => onDelete(r)}
          >
            <Trash2 className="size-4" />
          </Button>
        </li>
      ))}
    </ul>
  )
}
