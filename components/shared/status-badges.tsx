import { Badge } from "@/components/ui/badge"
import { IPO_STATUS_LABELS, MONEY_STATUS_LABELS } from "@/constants"
import type { IPOStatus, MoneyStatus } from "@/types"

export function IpoStatusBadge({ status }: { status: IPOStatus }) {
  const variant =
    status === "ALLOTTED" || status === "LISTED"
      ? "profit"
      : status === "NOT_ALLOTTED" || status === "REFUNDED"
      ? "loss"
      : status === "PARTIALLY_ALLOTTED"
      ? "warning"
      : "default"

  return <Badge variant={variant}>{IPO_STATUS_LABELS[status] ?? status}</Badge>
}

export function MoneyStatusBadge({ status }: { status: MoneyStatus }) {
  const variant =
    status === "PAID"
      ? "profit"
      : status === "OVERDUE"
      ? "loss"
      : status === "PARTIALLY_PAID"
      ? "warning"
      : "secondary"

  return <Badge variant={variant}>{MONEY_STATUS_LABELS[status] ?? status}</Badge>
}
