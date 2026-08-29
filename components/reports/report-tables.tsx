import { IpoStatusBadge, MoneyStatusBadge } from "@/components/shared/status-badges"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate, formatPL, plClass } from "@/lib/format"
import { MONEY_TYPE_LABELS } from "@/constants"
import type { IPOReportRow, MoneyReportRow } from "@/types"

export function IpoReportTable({ rows }: { rows: IPOReportRow[] }) {
  const safeRows = Array.isArray(rows) ? rows : []

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
            <th className="px-4 py-3">IPO Name</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Applied Date</th>
            <th className="px-4 py-3">Demat</th>
            <th className="px-4 py-3 text-right">Application Amt</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Listing P/L</th>
            <th className="px-4 py-3 text-right">Current P/L</th>
            <th className="px-4 py-3">Created By</th>
          </tr>
        </thead>

        <tbody>
          {safeRows.map((r) => (
            <tr key={r.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-medium text-foreground">
                {r.ipoName}
              </td>

              <td className="px-4 py-3 text-secondary-text">
                {r.companyName}
              </td>

              <td className="px-4 py-3 text-secondary-text">
                {formatDate(r.appliedDate)}
              </td>

              <td className="px-4 py-3 text-secondary-text">
                {r.dematName}
              </td>

              <td className="px-4 py-3 text-right text-secondary-text">
                {formatCurrency(r.applicationAmount)}
              </td>

              <td className="px-4 py-3">
                <IpoStatusBadge status={r.status} />
              </td>

              <td
                className={`px - 4 py - 3 text - right font - medium ${plClass(
                  r.listingProfitLoss
                )
                  } `}
              >
                {formatPL(r.listingProfitLoss)}
              </td>

              <td
                className={`px - 4 py - 3 text - right font - medium ${plClass(
                  r.currentProfitLoss
                )
                  } `}
              >
                {formatPL(r.currentProfitLoss)}
              </td>

              <td className="px-4 py-3 text-secondary-text">
                {r.createdBy}
              </td>
            </tr>
          ))}

          {safeRows.length === 0 && (
            <tr>
              <td
                colSpan={9}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                No IPO records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function MoneyReportTable({ rows }: { rows: MoneyReportRow[] }) {
  const safeRows = Array.isArray(rows) ? rows : []

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
            <th className="px-4 py-3">Person</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3 text-right">Remaining</th>
            <th className="px-4 py-3">Due Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created By</th>
          </tr>
        </thead>

        <tbody>
          {safeRows.map((r) => (
            <tr key={r.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-medium text-foreground">
                {r.personName}
              </td>

              <td className="px-4 py-3">
                <Badge variant={r.type === "GIVEN" ? "profit" : "warning"}>
                  {MONEY_TYPE_LABELS[r.type]}
                </Badge>
              </td>

              <td className="px-4 py-3 text-right text-secondary-text">
                {formatCurrency(r.amount)}
              </td>

              <td className="px-4 py-3 text-right font-medium text-foreground">
                {formatCurrency(r.remaining)}
              </td>

              <td className="px-4 py-3 text-secondary-text">
                {formatDate(r.dueDate)}
              </td>

              <td className="px-4 py-3">
                <MoneyStatusBadge status={r.status} />
              </td>

              <td className="px-4 py-3 text-secondary-text">
                {r.createdBy}
              </td>
            </tr>
          ))}

          {safeRows.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                No money records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
