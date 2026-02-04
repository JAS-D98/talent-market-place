"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Download, Smartphone, Star, Share, Plus } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [canInstall, setCanInstall] = useState(false)
  const [browserType, setBrowserType] = useState<"chrome" | "safari" | "other">("other")

  useEffect(() => {
    // Check device and browser type
    const userAgent = navigator.userAgent.toLowerCase()
    const isIOSDevice = /ipad|iphone|ipod/.test(userAgent)
    const isAndroidDevice = /android/.test(userAgent)
    const isChrome = /chrome/.test(userAgent) && !/edg/.test(userAgent)
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent)

    setIsIOS(isIOSDevice)
    setIsAndroid(isAndroidDevice)
    setBrowserType(isChrome ? "chrome" : isSafari ? "safari" : "other")

    // Check if app is already installed
    const checkIfInstalled = () => {
      const isStandaloneMode = window.matchMedia("(display-mode: standalone)").matches
      const isIOSStandalone = (window.navigator as any).standalone === true
      const isInstalled = isStandaloneMode || isIOSStandalone

      setIsStandalone(isInstalled)
      setIsInstalled(isInstalled)
    }

    // Check if installation is possible
    const checkInstallability = () => {
      const isHTTPS = window.location.protocol === "https:" || window.location.hostname === "localhost"
      const hasManifest = document.querySelector('link[rel="manifest"]') !== null
      const isSupported = "serviceWorker" in navigator

      setCanInstall(isHTTPS && hasManifest && isSupported)
    }

    checkIfInstalled()
    checkInstallability()

    // Listen for the beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("beforeinstallprompt event fired")
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show install prompt after a delay for better UX
      setTimeout(() => {
        if (!isInstalled && canInstall && !sessionStorage.getItem("installPromptDismissed")) {
          setShowInstallPrompt(true)
        }
      }, 3000)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log("PWA was installed")
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      sessionStorage.removeItem("installPromptDismissed")
    }

    // For iOS devices, show prompt after some time if not installed
    const handleIOSPrompt = () => {
      if (isIOSDevice && !isInstalled && canInstall && !sessionStorage.getItem("installPromptDismissed")) {
        setTimeout(() => {
          setShowInstallPrompt(true)
        }, 5000)
      }
    }

    if (canInstall) {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.addEventListener("appinstalled", handleAppInstalled)

      if (isIOSDevice) {
        handleIOSPrompt()
      }
    }

    return () => {
      if (canInstall) {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
        window.removeEventListener("appinstalled", handleAppInstalled)
      }
    }
  }, [isInstalled, canInstall, isIOS])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      console.log("Showing install prompt")
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      console.log(`User response to the install prompt: ${outcome}`)

      if (outcome === "accepted") {
        setIsInstalled(true)
        console.log("User accepted the install prompt")
      } else {
        console.log("User dismissed the install prompt")
      }

      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    } catch (error) {
      console.error("Error during installation:", error)
      setShowInstallPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Remember dismissal for this session
    sessionStorage.setItem("installPromptDismissed", "true")
  }

  const handleIOSInstallClick = () => {
    // For iOS, we can't programmatically install, so we show instructions
    setShowInstallPrompt(true)
  }

  // Don't show if already installed or dismissed
  if (isInstalled || !showInstallPrompt || !canInstall) {
    return null
  }

  // iOS Install Instructions
  if (isIOS && !isStandalone) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4">
        <Card className="w-full max-w-md animate-slide-up shadow-2xl border-0">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-foreground mb-2">Install FundiLink</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add FundiLink to your home screen for quick access and a better experience
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-xs">1</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>Tap the Share button</span>
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                        <Share className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-xs">2</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>Select "Add to Home Screen"</span>
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                        <Plus className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-xs">3</span>
                    </div>
                    <span>Tap "Add" to install</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleDismiss}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0"
                  >
                    Got it!
                  </Button>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="p-2 hover:bg-muted/50 rounded-full flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Android/Chrome Install Prompt
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <Card className="w-full max-w-md animate-slide-up shadow-2xl border-0">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-foreground mb-2">Install FundiLink App</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get the full app experience with faster loading, offline access, and push notifications
              </p>

              <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                  <span>Fast & Reliable</span>
                </div>
                <div className="flex items-center">
                  <Smartphone className="w-3 h-3 mr-1" />
                  <span>Native Experience</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleInstallClick}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white border-0"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install Now
                </Button>
                <Button variant="outline" onClick={handleDismiss} className="px-4 bg-transparent">
                  Later
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="p-2 hover:bg-muted/50 rounded-full flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
