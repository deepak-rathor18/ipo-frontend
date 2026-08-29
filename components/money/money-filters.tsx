"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MONEY_STATUS_LABELS, MONEY_TYPE_LABELS } from "@/constants"
import type { MoneyFilters } from "@/types"

export function MoneyFiltersBar({
  filters,
  onChange,
}: {
  filters: MoneyFilters
  onChange: (next: MoneyFilters) => void
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-[220px]">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search ?? ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
          placeholder="Search by person name"
          className="pl-8"
        />
      </div>

      <Select
        value={filters.type ?? "ALL"}
        onValueChange={(value) =>
          onChange({ ...filters, type: value as MoneyFilters["type"], page: 1 })
        }
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Types</SelectItem>
          {Object.entries(MONEY_TYPE_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status ?? "ALL"}
        onValueChange={(value) =>
          onChange({ ...filters, status: value as MoneyFilters["status"], page: 1 })
        }
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          {Object.entries(MONEY_STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={filters.dateFrom ?? ""}
        onChange={(e) => onChange({ ...filters, dateFrom: e.target.value, page: 1 })}
        className="w-full sm:w-40"
        aria-label="From date"
      />
      <Input
        type="date"
        value={filters.dateTo ?? ""}
        onChange={(e) => onChange({ ...filters, dateTo: e.target.value, page: 1 })}
        className="w-full sm:w-40"
        aria-label="To date"
      />
    </div>
  )
}
