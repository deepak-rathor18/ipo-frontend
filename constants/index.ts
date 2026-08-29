import type { UserName } from "@/types"

export const APP_USERS: UserName[] = ["Deepak", "Aman"]

export const IPO_STATUS_LABELS: Record<string, string> = {
  APPLIED: "Applied",
  ALLOTTED: "Allotted",
  NOT_ALLOTTED: "Not Allotted",
  PARTIALLY_ALLOTTED: "Partially Allotted",
  LISTED: "Listed",
  REFUNDED: "Refunded",
}

export const MONEY_TYPE_LABELS: Record<string, string> = {
  GIVEN: "Given",
  BORROWED: "Borrowed",
}

export const MONEY_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PARTIALLY_PAID: "Partially Paid",
  PAID: "Paid",
  OVERDUE: "Overdue",
}

export const NAV_SECTIONS = [
  {
    title: null,
    items: [{ label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" }],
  },
  {
    title: "IPO Management",
    items: [
      { label: "All IPOs", href: "/ipos", icon: "List" },
      { label: "Add IPO", href: "/ipos/new", icon: "PlusCircle" },
      { label: "IPO Calculator", href: "/ipos/calculator", icon: "Calculator" },
    ],
  },
  {
    title: "Money Management",
    items: [
      { label: "Money Ledger", href: "/money", icon: "Wallet" },
      { label: "Add Transaction", href: "/money/new", icon: "PlusCircle" },
      { label: "People", href: "/people", icon: "Users" },
    ],
  },
  {
    title: null,
    items: [
      { label: "Reports", href: "/reports", icon: "FileBarChart" },
      { label: "Settings", href: "/settings", icon: "Settings" },
    ],
  },
] as const
