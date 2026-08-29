"use client"

import * as React from "react"
import { WifiOff } from "lucide-react"

import { SidebarNav } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useOnlineStatus } from "@/hooks/use-online-status"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)
  const isOnline = useOnlineStatus()

  return (
    <div className="flex min-h-svh bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border lg:block">
        <div className="sticky top-0 h-svh">
          <SidebarNav />
        </div>
      </aside>

      {/* Mobile drawer sidebar */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="p-0">
          <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setMobileNavOpen(true)} />

        {!isOnline && (
          <div
            className="flex items-center justify-center gap-2 bg-warning/10 px-4 py-2 text-xs font-medium text-warning sm:hidden"
            role="status"
          >
            <WifiOff className="size-3.5" />
            You&apos;re offline. Some actions are disabled.
          </div>
        )}

        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
