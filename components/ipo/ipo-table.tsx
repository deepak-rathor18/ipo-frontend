"use client"

import Link from "next/link"
import { Eye, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { IpoStatusBadge } from "@/components/shared/status-badges"
import { formatCurrency, formatDate, formatPL, plClass } from "@/lib/format"
import type { IPO } from "@/types"

export function IpoTable({
  ipos,
  onDelete,
}: {
  ipos: IPO[]
  onDelete: (ipo: IPO) => void
}) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
              <th className="px-4 py-3">IPO Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Applied Date</th>
              <th className="px-4 py-3">Demat</th>
              <th className="px-4 py-3 text-right">Application Amt</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Allotted</th>
              <th className="px-4 py-3 text-right">Listing Price</th>
              <th className="px-4 py-3 text-right">Listing P/L</th>
              <th className="px-4 py-3 text-right">Current P/L</th>
              <th className="px-4 py-3">Created By</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ipos.map((ipo) => (
              <tr key={ipo.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                <td className="px-4 py-3 font-medium text-foreground">
                  <Link href={`/ipos/${ipo.id}`} className="hover:text-primary">
                    {ipo.ipoName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-secondary-text">{ipo.companyName}</td>
                <td className="px-4 py-3 text-secondary-text">{formatDate(ipo.appliedDate)}</td>
                <td className="px-4 py-3 text-secondary-text">{ipo.dematName}</td>
                <td className="px-4 py-3 text-right text-secondary-text">
                  {formatCurrency(ipo.applicationAmount)}
                </td>
                <td className="px-4 py-3">
                  <IpoStatusBadge status={ipo.status} />
                </td>
                <td className="px-4 py-3 text-right text-secondary-text">
                  {ipo.allottedShares ?? "—"}
                </td>
                <td className="px-4 py-3 text-right text-secondary-text">
                  {ipo.listingPrice ? formatCurrency(ipo.listingPrice) : "—"}
                </td>
                <td className={`px-4 py-3 text-right font-medium ${plClass(ipo.listingProfitLoss)}`}>
                  {formatPL(ipo.listingProfitLoss)}
                </td>
                <td className={`px-4 py-3 text-right font-medium ${plClass(ipo.currentProfitLoss)}`}>
                  {formatPL(ipo.currentProfitLoss)}
                </td>
                <td className="px-4 py-3 text-secondary-text">{ipo.createdBy}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild size="icon" variant="ghost" className="size-8">
                      <Link href={`/ipos/${ipo.id}`} aria-label="View">
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild size="icon" variant="ghost" className="size-8">
                      <Link href={`/ipos/${ipo.id}/edit`} aria-label="Edit">
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-loss hover:text-loss"
                      aria-label="Delete"
                      onClick={() => onDelete(ipo)}
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
        {ipos.map((ipo) => (
          <div key={ipo.id} className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link href={`/ipos/${ipo.id}`} className="font-medium text-foreground hover:text-primary">
                  {ipo.ipoName}
                </Link>
                <p className="text-xs text-muted-foreground">{ipo.companyName}</p>
              </div>
              <IpoStatusBadge status={ipo.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">Applied</p>
                <p className="text-foreground">{formatDate(ipo.appliedDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Demat</p>
                <p className="text-foreground">{ipo.dematName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Application Amt</p>
                <p className="text-foreground">{formatCurrency(ipo.applicationAmount)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current P/L</p>
                <p className={plClass(ipo.currentProfitLoss)}>{formatPL(ipo.currentProfitLoss)}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-1 border-t border-border pt-2">
              <Button asChild size="sm" variant="ghost">
                <Link href={`/ipos/${ipo.id}`}>View</Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link href={`/ipos/${ipo.id}/edit`}>Edit</Link>
              </Button>
              <Button size="sm" variant="ghost" className="text-loss" onClick={() => onDelete(ipo)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
