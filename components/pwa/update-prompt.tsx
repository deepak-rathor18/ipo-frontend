"use client"

import { RefreshCw } from "lucide-react"

import { useServiceWorker } from "@/providers/service-worker-provider"
import { Button } from "@/components/ui/button"

export function UpdatePrompt() {
  const { updateAvailable, applyUpdate } = useServiceWorker()

  if (!updateAvailable) return null

  return (
    <div className="fixed inset-x-4 top-4 z-40 mx-auto flex max-w-md items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-lg sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
        <RefreshCw className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">New version available</p>
        <p className="text-xs text-muted-foreground">Update when convenient — your data is safe.</p>
      </div>
      <Button size="sm" onClick={applyUpdate}>
        Update
      </Button>
    </div>
  )
}
