"use client"

import * as React from "react"

interface SwState {
  registration: ServiceWorkerRegistration | null
  updateAvailable: boolean
  applyUpdate: () => void
}

const SwContext = React.createContext<SwState>({
  registration: null,
  updateAvailable: false,
  applyUpdate: () => {},
})

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const [registration, setRegistration] = React.useState<ServiceWorkerRegistration | null>(null)
  const [updateAvailable, setUpdateAvailable] = React.useState(false)
  const [waitingWorker, setWaitingWorker] = React.useState<ServiceWorker | null>(null)

  React.useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return
    if (process.env.NODE_ENV !== "production") return

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        setRegistration(registration)

        // A worker may already be waiting from a previous session.
        if (registration.waiting && navigator.serviceWorker.controller) {
          setWaitingWorker(registration.waiting)
          setUpdateAvailable(true)
        }

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (!newWorker) return
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller // an existing SW controls the page, so this is an update, not the first install
            ) {
              setWaitingWorker(newWorker)
              setUpdateAvailable(true)
            }
          })
        })
      })
      .catch(() => {
        // Registration failures shouldn't break the app; FinTrack works fine
        // without an installed service worker, just without offline app-shell caching.
      })

    let reloading = false
    const handleControllerChange = () => {
      if (reloading) return
      reloading = true
      window.location.reload()
    }
    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange)

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange)
    }
  }, [])

  const applyUpdate = React.useCallback(() => {
    if (!waitingWorker) return
    waitingWorker.postMessage({ type: "SKIP_WAITING" })
    setUpdateAvailable(false)
  }, [waitingWorker])

  const value = React.useMemo(
    () => ({ registration, updateAvailable, applyUpdate }),
    [registration, updateAvailable, applyUpdate]
  )

  return <SwContext.Provider value={value}>{children}</SwContext.Provider>
}

export function useServiceWorker() {
  return React.useContext(SwContext)
}
