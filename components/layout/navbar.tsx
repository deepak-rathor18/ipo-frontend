"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Menu, Wifi, WifiOff, LogOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/layout/theme-toggle"

const PAGE_TITLES: { match: RegExp; title: string }[] = [
  { match: /^\/dashboard/, title: "Dashboard" },
  { match: /^\/ipos\/calculator/, title: "IPO Calculator" },
  { match: /^\/ipos\/new/, title: "Add IPO" },
  { match: /^\/ipos\/[^/]+\/edit/, title: "Edit IPO" },
  { match: /^\/ipos\/[^/]+$/, title: "IPO Details" },
  { match: /^\/ipos/, title: "IPO Management" },
  { match: /^\/money\/new/, title: "Add Transaction" },
  { match: /^\/money\/[^/]+\/edit/, title: "Edit Transaction" },
  { match: /^\/money\/[^/]+$/, title: "Transaction Details" },
  { match: /^\/money/, title: "Money Management" },
  { match: /^\/people\/[^/]+$/, title: "Person Details" },
  { match: /^\/people/, title: "People" },
  { match: /^\/reports/, title: "Reports" },
  { match: /^\/settings/, title: "Settings" },
]

function usePageTitle() {
  const pathname = usePathname()
  const found = PAGE_TITLES.find((entry) => entry.match.test(pathname))
  return found?.title ?? "FinTrack"
}

export function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth()
  const isOnline = useOnlineStatus()
  const title = usePageTitle()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Button>

      <h1 className="min-w-0 flex-1 truncate text-base font-semibold text-foreground sm:text-lg">
        {title}
      </h1>

      <div
        className={cn(
          "hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium sm:flex",
          isOnline ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"
        )}
        role="status"
        aria-live="polite"
      >
        {isOnline ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
        {isOnline ? "Online" : "Offline"}
      </div>

      <ThemeToggle />

      <div className="flex items-center gap-2 pl-1">
        <Avatar className="size-8">
          <AvatarFallback>{user?.name?.[0] ?? "?"}</AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium text-foreground sm:inline">
          {user?.name ?? "…"}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => logout()}
        aria-label="Logout"
        className="text-muted-foreground hover:text-foreground"
      >
        <LogOut className="size-4" />
      </Button>
    </header>
  )
}
