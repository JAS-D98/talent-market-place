"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"

export function PWAStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check if app is installed
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isIOSStandalone = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isIOSStandalone)
    }

    checkInstallStatus()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <div className="flex items-center">
      <div
        className={cn(
          "w-5 h-5 rounded-2xl flex items-center justify-center backdrop-blur-xl border shadow-lg transition-all duration-300",
          isOnline
            ? "bg-green-100/20 border-green-200/30 text-green-600"
            : "bg-red-100/20 border-red-200/30 text-red-600",
        )}
        title={isOnline ? "Online" : "Offline"}
      >
        {isOnline ? <Wifi className="w-4 h-3" /> : <WifiOff className="w-4 h-4" />}
      </div>
    </div>
  )
}
