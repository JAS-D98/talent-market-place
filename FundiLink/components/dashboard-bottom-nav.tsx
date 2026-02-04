"use client"

import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, Calendar, DollarSign, Settings, Star, MessageSquare, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Different nav items for different user types
const adminNavItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin", badge: null },
  { icon: Users, label: "Fundis", href: "/admin/fundis", badge: "3" },
  { icon: Calendar, label: "Bookings", href: "/admin/bookings", badge: null },
  { icon: DollarSign, label: "Payments", href: "/admin/payments", badge: null },
  { icon: Settings, label: "Settings", href: "/admin/settings", badge: null },
]

const fundiNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/fundi", badge: null },
  { icon: Calendar, label: "Jobs", href: "/fundi/jobs", badge: "2" },
  { icon: DollarSign, label: "Earnings", href: "/fundi/earnings", badge: null },
  { icon: Star, label: "Reviews", href: "/fundi/reviews", badge: null },
  { icon: Settings, label: "Profile", href: "/fundi/profile", badge: null },
]

const userNavItems = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard", badge: null },
  { icon: Calendar, label: "Bookings", href: "/dashboard/bookings", badge: "1" },
  { icon: Heart, label: "Favorites", href: "/dashboard/favorites", badge: null },
  { icon: MessageSquare, label: "Support", href: "/dashboard/support", badge: null },
  { icon: Settings, label: "Settings", href: "/dashboard/settings", badge: null },
]

export function DashboardBottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  // Determine which nav items to show based on current path
  let navItems = userNavItems
  if (pathname.startsWith("/admin")) {
    navItems = adminNavItems
  } else if (pathname.startsWith("/fundi")) {
    navItems = fundiNavItems
  }

  // Don't show if not on a dashboard page
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/fundi") && !pathname.startsWith("/dashboard")) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 xl:hidden">
      <div className="bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-2xl">
        <div className="flex items-center justify-around py-2 px-2 max-w-md mx-auto">
          {navItems.map(({ icon: Icon, label, href, badge }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))

            return (
              <button
                key={href}
                onClick={() => router.push(href)}
                className={cn(
                  "relative flex flex-col items-center justify-center py-2 sm:py-3 px-2 sm:px-3 rounded-2xl transition-all duration-300 min-w-[50px] sm:min-w-[60px] group overflow-hidden",
                  isActive
                    ? "text-primary bg-primary/10 scale-105 shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105 active:scale-95",
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 sm:w-6 h-1 bg-primary rounded-full animate-scale-in" />
                )}

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                {/* Icon and label */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative">
                    <Icon
                      className={cn(
                        "w-4 h-4 sm:w-5 sm:h-5 mb-1 transition-all duration-300",
                        isActive ? "text-primary scale-110" : "group-hover:scale-110",
                      )}
                    />
                    {badge && (
                      <Badge className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 p-0 text-[10px] sm:text-xs bg-destructive text-destructive-foreground flex items-center justify-center">
                        {badge}
                      </Badge>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] sm:text-xs font-medium transition-all duration-300 text-center leading-tight",
                      isActive ? "text-primary font-semibold" : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {label}
                  </span>
                </div>

                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-100 bg-primary/10 animate-ping" />
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
