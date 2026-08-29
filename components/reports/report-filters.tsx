"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IPO_STATUS_LABELS } from "@/constants"
import type { ReportFilters } from "@/types"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 6 }, (_, i) => String(currentYear - i))

export function ReportFiltersBar({
  filters,
  onChange,
  showIpoFields,
}: {
  filters: ReportFilters
  onChange: (next: ReportFilters) => void
  showIpoFields?: boolean
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <Input
        type="date"
        value={filters.dateFrom ?? ""}
        onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
        className="w-full sm:w-40"
        aria-label="From date"
      />
      <Input
        type="date"
        value={filters.dateTo ?? ""}
        onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
        className="w-full sm:w-40"
        aria-label="To date"
      />

      <Select
        value={filters.year ?? "ALL"}
        onValueChange={(value) => onChange({ ...filters, year: value === "ALL" ? undefined : value })}
      >
        <SelectTrigger className="w-full sm:w-28">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Years</SelectItem>
          {YEARS.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.month ?? "ALL"}
        onValueChange={(value) => onChange({ ...filters, month: value === "ALL" ? undefined : value })}
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Months</SelectItem>
          {MONTHS.map((m, i) => (
            <SelectItem key={m} value={String(i + 1)}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showIpoFields && (
        <>
          <Input
            value={filters.dematName ?? ""}
            onChange={(e) => onChange({ ...filters, dematName: e.target.value })}
            placeholder="Demat name"
            className="w-full sm:w-36"
          />

          <Select
            value={filters.status ?? "ALL"}
            onValueChange={(value) => onChange({ ...filters, status: value === "ALL" ? undefined : value })}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="IPO Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {Object.entries(IPO_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  )
}
