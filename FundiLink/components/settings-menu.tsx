"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Moon,
  Sun,
  Bell,
  Shield,
  HelpCircle,
  Info,
  Star,
  Smartphone,
  X,
  ChevronRight,
  Zap,
  Heart,
  Globe,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if app is installed
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isIOSStandalone = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isIOSStandalone)
    }

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }

    checkInstallStatus()
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode.toString())

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const toggleNotifications = () => {
    setNotifications(!notifications)
    localStorage.setItem("notifications", (!notifications).toString())
  }

  const menuItems = [
    {
      icon: darkMode ? Sun : Moon,
      label: "Dark Mode",
      description: "Toggle dark/light theme",
      action: toggleDarkMode,
      hasSwitch: true,
      switchValue: darkMode,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Push notifications",
      action: toggleNotifications,
      hasSwitch: true,
      switchValue: notifications,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Shield,
      label: "Privacy & Security",
      description: "Manage your privacy settings",
      action: () => router.push("/privacy"),
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Star,
      label: "Rate App",
      description: "Love FundiLink? Rate us!",
      action: () => window.open("https://play.google.com/store", "_blank"),
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help and contact support",
      action: () => router.push("/help"),
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      icon: Info,
      label: "About",
      description: "App version and info",
      action: () => router.push("/about"),
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ]

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="sm"
        className="group relative overflow-hidden w-12 h-12 rounded-2xl p-0 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        {/* Icon with rotation animation */}
        <div className="relative z-10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-foreground/80 group-hover:text-foreground transition-all duration-300 group-hover:rotate-90" />
        </div>

        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-100 bg-white/30 animate-ping" />
      </Button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Settings Panel */}
      <Card className="fixed top-4 right-4 w-80 max-w-[calc(100vw-2rem)] z-50 card-premium animate-slide-up shadow-2xl">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Settings</h3>
                  <p className="text-sm text-muted-foreground">Customize your experience</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted/50 rounded-xl"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* App Status */}
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Zap className="w-3 h-3 mr-1" />
                FundiLink v1.0.0
              </Badge>
              {isInstalled && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Smartphone className="w-3 h-3 mr-1" />
                  Installed
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Menu Items */}
          <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="group flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                  onClick={!item.hasSwitch ? item.action : undefined}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.bgColor)}>
                      <Icon className={cn("w-5 h-5", item.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {item.label}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                    </div>
                  </div>

                  {item.hasSwitch ? (
                    <Switch
                      checked={item.switchValue}
                      onCheckedChange={item.action}
                      className="data-[state=checked]:bg-primary"
                    />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  )}
                </div>
              )
            })}
          </div>

          <Separator />

          {/* Footer */}
          <div className="p-4">
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Made in Kenya</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>fundilink.co.ke</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
