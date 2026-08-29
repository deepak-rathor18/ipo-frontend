"use client"

import * as React from "react"

/**
 * Tracks browser connectivity. Used to:
 *  - show the Online/Offline indicator in the navbar (never a notification)
 *  - disable financial mutations (add/edit/delete IPO, money, repayments) while offline
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = React.useState(true)

  React.useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return isOnline
}
