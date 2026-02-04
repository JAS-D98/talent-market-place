"use client"

import { useEffect, useState } from "react"

export function useServiceWorker() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const registerSW = async () => {
      if (!("serviceWorker" in navigator)) {
        setError("Service Worker not supported")
        return
      }

      try {
        // Check if we're in a proper environment for service workers
        const isHTTPS = window.location.protocol === "https:" || window.location.hostname === "localhost"

        if (!isHTTPS) {
          console.log("Service Worker requires HTTPS or localhost")
          return
        }

        // Try to fetch the service worker file first
        const swResponse = await fetch("/sw.js", { method: "HEAD" }).catch(() => null)

        if (!swResponse || !swResponse.ok) {
          console.log("Service Worker file not available, skipping registration")
          return
        }

        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        })

        setRegistration(reg)
        console.log("Service Worker registered successfully")

        // Check for updates
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setUpdateAvailable(true)
              }
            })
          }
        })
      } catch (err) {
        console.log("Service Worker registration failed:", err)
        setError("Registration failed")
      }
    }

    registerSW()
  }, [])

  const updateServiceWorker = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" })
      window.location.reload()
    }
  }

  return {
    registration,
    updateAvailable,
    error,
    updateServiceWorker,
  }
}
