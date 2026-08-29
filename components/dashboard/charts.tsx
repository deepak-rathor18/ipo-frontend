"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { formatCurrency, formatNumber } from "@/lib/format";

const AXIS_COLOR = "var(--color-muted-foreground)";
const GRID_COLOR = "var(--color-border)";

const PIE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--color-foreground)",
};

function currencyFormatter(value: unknown): string {
  return formatCurrency(
    typeof value === "number" ? value : Number(value) || 0
  );
}

function numberFormatter(value: unknown): string {
  return formatNumber(
    typeof value === "number" ? value : Number(value) || 0
  );
}

/* =========================
   IPO PROFIT / LOSS
========================= */

interface IpoProfitLossData {
  month: string;
  listing: number;
  current: number;
}

export function IpoProfitLossChart({
  data,
}: {
  data: IpoProfitLossData[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 4, right: 4, left: -12, bottom: 0 }}
      >
        <CartesianGrid
          vertical={false}
          stroke={GRID_COLOR}
        />

        <XAxis
          dataKey="month"
          tick={{
            fontSize: 11,
            fill: AXIS_COLOR,
          }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{
            fontSize: 11,
            fill: AXIS_COLOR,
          }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          contentStyle={tooltipStyle}
          formatter={currencyFormatter}
        />

        <Legend
          wrapperStyle={{
            fontSize: 12,
          }}
        />

        <Bar
          dataKey="listing"
          fill="var(--color-chart-1)"
          radius={[4, 4, 0, 0]}
          name="Listing P/L"
        />

        <Bar
          dataKey="current"
          fill="var(--color-chart-2)"
          radius={[4, 4, 0, 0]}
          name="Current P/L"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* =========================
   IPO STATUS
========================= */

interface IpoStatusData {
  status: string;
  count: number;
}

export function IpoStatusChart({
  data,
}: {
  data: IpoStatusData[];
}) {
  const chartData = Array.isArray(data) ? data : [];

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
          {chartData.map((_, index) => (
            <Cell
              key={`status - cell - ${index} `}
              fill={PIE_COLORS[index % PIE_COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip
          contentStyle={tooltipStyle}
          formatter={numberFormatter}
        />

        <Legend
          wrapperStyle={{
            fontSize: 11,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* =========================
   RECEIVABLE VS PAYABLE
========================= */

interface ReceivablePayableData {
  category: string;
  value: number;
}

export function ReceivableVsPayableChart({
  data,
}: {
  data: ReceivablePayableData[];
}) {
  const chartData = Array.isArray(data) ? data : [];

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
          {chartData.map((_, index) => (
            <Cell
              key={`receivable - payable - ${index} `}
              fill={PIE_COLORS[index % PIE_COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip
          contentStyle={tooltipStyle}
          formatter={currencyFormatter}
        />

        <Legend
          wrapperStyle={{
            fontSize: 11,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}