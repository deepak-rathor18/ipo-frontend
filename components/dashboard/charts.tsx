"use client"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

import type { IPODashboardData, MoneyDashboardData } from "@/types"
import { formatCurrency, formatNumber } from "@/lib/format"

const AXIS_COLOR = "var(--color-muted-foreground)"
const GRID_COLOR = "var(--color-border)"

const PIE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--color-foreground)",
}

function currencyFormatter(value: unknown): string {
  return formatCurrency(typeof value === "number" ? value : Number(value) || 0)
}

function numberFormatter(value: unknown): string {
  return formatNumber(typeof value === "number" ? value : Number(value) || 0)
}

export function MonthlyApplicationsChart({ data }: { data: IPODashboardData["monthlyApplications"] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID_COLOR} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: AXIS_COLOR }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: AXIS_COLOR }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} formatter={numberFormatter} />
        <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Applications" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function MonthlyInvestmentChart({ data }: { data: IPODashboardData["monthlyInvestment"] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID_COLOR} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: AXIS_COLOR }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: AXIS_COLOR }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} formatter={currencyFormatter} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-primary)"
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Investment"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function IpoProfitLossChart({ data }: { data: IPODashboardData["profitLoss"] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID_COLOR} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: AXIS_COLOR }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: AXIS_COLOR }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} formatter={currencyFormatter} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="listing" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} name="Listing P/L" />
        <Bar dataKey="current" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} name="Current P/L" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function DematWiseChart({ data }: { data: IPODashboardData["dematWiseApplications"] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke={GRID_COLOR} />
        <XAxis type="number" tick={{ fontSize: 11, fill: AXIS_COLOR }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="demat"
          tick={{ fontSize: 11, fill: AXIS_COLOR }}
          axisLine={false}
          tickLine={false}
          width={70}
        />
        <Tooltip contentStyle={tooltipStyle} formatter={numberFormatter} />
        <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 4, 4, 0]} name="Applications" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function IpoStatusChart({
  data,
}: {
  data: IPODashboardData["statusBreakdown"]
}) {
  const chartData = Array.isArray(data) ? data : []

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="status"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
        >
          {chartData.map((_, i) => (
            <Cell
              key={`status-cell-${i}`}
              fill={PIE_COLORS[i % PIE_COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip
          contentStyle={tooltipStyle}
          formatter={numberFormatter}
        />

        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function MoneyGivenVsBorrowedChart({ data }: { data: MoneyDashboardData["givenVsBorrowed"] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={GRID_COLOR} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: AXIS_COLOR }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: AXIS_COLOR }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} formatter={currencyFormatter} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="given" fill="var(--color-profit)" radius={[4, 4, 0, 0]} name="Given" />
        <Bar dataKey="borrowed" fill="var(--color-warning)" radius={[4, 4, 0, 0]} name="Borrowed" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function ReceivableVsPayableChart({
  data,
}: {
  data: MoneyDashboardData["receivableVsPayable"]
}) {
  const chartData = Array.isArray(data) ? data : []

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="category"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
        >
          {chartData.map((_, i) => (
            <Cell
              key={`receivable-payable-${i}`}
              fill={PIE_COLORS[i % PIE_COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip
          contentStyle={tooltipStyle}
          formatter={currencyFormatter}
        />

        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
