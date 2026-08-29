"use client"

import * as React from "react"
import { Download, X } from "lucide-react"

import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISS_KEY = "fintrack:install-prompt-dismissed-at"
const DISMISS_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000 // 14 days

function wasRecentlyDismissed() {
  if (typeof window === "undefined") return false
  const raw = window.localStorage.getItem(DISMISS_KEY)
  if (!raw) return false
  const dismissedAt = Number(raw)
  if (Number.isNaN(dismissedAt)) return false
  return Date.now() - dismissedAt < DISMISS_COOLDOWN_MS
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault()
      if (wasRecentlyDismissed()) return
      setDeferredPrompt(event as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()))
    setVisible(false)
  }

  const install = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      setVisible(false)
    } else {
      dismiss()
    }
    setDeferredPrompt(null)
  }

  if (!visible || !deferredPrompt) return null

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-4 sm:left-auto">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
        <Download className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">Install FinTrack</p>
        <p className="text-xs text-muted-foreground">Add it to your home screen for quick access.</p>
      </div>
      <Button size="sm" onClick={install}>
        Install
      </Button>
      <Button size="icon" variant="ghost" className="size-7 shrink-0" onClick={dismiss} aria-label="Dismiss">
        <X className="size-4" />
      </Button>
    </div>
  )
}
