"use client"

import {
  ArrowLeft,
  Home,
  Search,
  Calendar,
  MessageCircle,
  User,
  BarChart3,
  Briefcase,
  DollarSign,
  Star,
  Shield,
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SettingsMenu } from "./settings-menu"
import { cn } from "@/lib/utils"

interface TopNavigationProps {
  title?: string
  showBack?: boolean
  showSettings?: boolean
}

export function TopNavigation({ title, showBack = false, showSettings = true }: TopNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleBack = () => {
    router.back()
  }

  // Define navigation items based on current route
  const getNavigationItems = () => {
    if (pathname.startsWith("/fundi")) {
      return [
        { href: "/fundi", label: "Dashboard", icon: BarChart3 },
        { href: "/fundi/jobs", label: "Jobs", icon: Briefcase },
        { href: "/fundi/earnings", label: "Earnings", icon: DollarSign },
        { href: "/fundi/reviews", label: "Reviews", icon: Star },
        { href: "/fundi/profile", label: "Profile", icon: User },
      ]
    }

    if (pathname.startsWith("/admin")) {
      return [
        { href: "/admin", label: "Dashboard", icon: BarChart3 },
        { href: "/admin/fundis", label: "Fundis", icon: Shield },
        { href: "/profile", label: "Profile", icon: User },
      ]
    }

    // Default navigation for regular users
    return [
      { href: "/", label: "Home", icon: Home },
      { href: "/search", label: "Search", icon: Search },
      { href: "/book", label: "Book", icon: Calendar },
      { href: "/chat", label: "Chat", icon: MessageCircle },
      { href: "/profile", label: "Profile", icon: User },
    ]
  }

  const navigationItems = getNavigationItems()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left side - Back button or Logo */}
        <div className="flex items-center space-x-4">
          {showBack ? (
            <Button variant="ghost" size="sm" onClick={handleBack} className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">FL</span>
              </div>
              <span className="font-semibold text-lg hidden sm:block">FundiLink</span>
            </div>
          )}

          {title && <h1 className="text-lg font-semibold text-foreground">{title}</h1>}
        </div>

        {/* Center - Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                onClick={() => router.push(item.href)}
                className={cn(
                  "h-9 px-3 text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  active && "bg-primary/10 text-primary hover:bg-primary/15",
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        {/* Right side - Settings */}
        <div className="flex items-center">{showSettings && <SettingsMenu />}</div>
      </div>
    </div>
  )
}
