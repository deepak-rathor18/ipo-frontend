"use client"

import Link from "next/link"
import { Eye, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoneyStatusBadge } from "@/components/shared/status-badges"
import { formatCurrency, formatDate } from "@/lib/format"
import { MONEY_TYPE_LABELS } from "@/constants"
import type { MoneyTransaction } from "@/types"

export function MoneyTable({
  transactions,
  onDelete,
}: {
  transactions: MoneyTransaction[]
  onDelete: (transaction: MoneyTransaction) => void
}) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
              <th className="px-4 py-3">Person</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">Paid</th>
              <th className="px-4 py-3 text-right">Remaining</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created By</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                <td className="px-4 py-3 font-medium text-foreground">
                  <Link href={`/money/${t.id}`} className="hover:text-primary">
                    {t.personName}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={t.type === "GIVEN" ? "profit" : "warning"}>
                    {MONEY_TYPE_LABELS[t.type]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right text-secondary-text">
                  {formatCurrency(t.amount)}
                </td>
                <td className="px-4 py-3 text-right text-secondary-text">
                  {formatCurrency(t.totalPaid)}
                </td>
                <td className="px-4 py-3 text-right font-medium text-foreground">
                  {formatCurrency(t.remaining)}
                </td>
                <td className="px-4 py-3 text-secondary-text">{formatDate(t.dueDate)}</td>
                <td className="px-4 py-3">
                  <MoneyStatusBadge status={t.status} />
                </td>
                <td className="px-4 py-3 text-secondary-text">{t.createdBy}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild size="icon" variant="ghost" className="size-8">
                      <Link href={`/money/${t.id}`} aria-label="View">
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild size="icon" variant="ghost" className="size-8">
                      <Link href={`/money/${t.id}/edit`} aria-label="Edit">
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-loss hover:text-loss"
                      aria-label="Delete"
                      onClick={() => onDelete(t)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 p-3 lg:hidden">
        {transactions.map((t) => (
          <div key={t.id} className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link href={`/money/${t.id}`} className="font-medium text-foreground hover:text-primary">
                  {t.personName}
                </Link>
                <div className="mt-1">
                  <Badge variant={t.type === "GIVEN" ? "profit" : "warning"}>
                    {MONEY_TYPE_LABELS[t.type]}
                  </Badge>
                </div>
              </div>
              <MoneyStatusBadge status={t.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">Amount</p>
                <p className="text-foreground">{formatCurrency(t.amount)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Remaining</p>
                <p className="font-medium text-foreground">{formatCurrency(t.remaining)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Due Date</p>
                <p className="text-foreground">{formatDate(t.dueDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created By</p>
                <p className="text-foreground">{t.createdBy}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-1 border-t border-border pt-2">
              <Button asChild size="sm" variant="ghost">
                <Link href={`/money/${t.id}`}>View</Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link href={`/money/${t.id}/edit`}>Edit</Link>
              </Button>
              <Button size="sm" variant="ghost" className="text-loss" onClick={() => onDelete(t)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
