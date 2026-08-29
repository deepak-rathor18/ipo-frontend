"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  List,
  PlusCircle,
  Calculator,
  Wallet,
  Users,
  FileBarChart,
  Settings,
  LogOut,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

interface NavSection {
  title: string | null
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: null,
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "IPO Management",
    items: [
      { label: "All IPOs", href: "/ipos", icon: List },
      { label: "Add IPO", href: "/ipos/new", icon: PlusCircle },
      { label: "IPO Calculator", href: "/ipos/calculator", icon: Calculator },
    ],
  },
  {
    title: "Money Management",
    items: [
      { label: "Money Ledger", href: "/money", icon: Wallet },
      { label: "Add Transaction", href: "/money/new", icon: PlusCircle },
      { label: "People", href: "/people", icon: Users },
    ],
  },
  {
    title: null,
    items: [
      { label: "Reports", href: "/reports", icon: FileBarChart },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
]

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <TrendingUp className="size-4.5" />
        </div>
        <span className="text-base font-semibold tracking-tight text-sidebar-foreground">
          FinTrack
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className={cn(idx > 0 && "mt-5")}>
            {section.title && (
              <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {section.title}
              </p>
            )}
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href)
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2.5 text-sidebar-foreground/80 hover:text-sidebar-foreground"
          onClick={() => logout()}
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
