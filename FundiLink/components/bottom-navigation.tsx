"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Search, Calendar, MessageCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Calendar, label: "Book", href: "/book" },
  { icon: MessageCircle, label: "Chat", href: "/chat" },
  { icon: User, label: "Profile", href: "/profile" },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  // Hide on splash screen and dashboard pages
  if (
    pathname === "/splash" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/fundi") ||
    pathname.startsWith("/dashboard")
  )
    return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bottom-nav-blur">
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))

            return (
              <button
                key={href}
                onClick={() => router.push(href)}
                className={cn(
                  "flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all duration-300 min-w-[64px] group relative overflow-hidden",
                  isActive
                    ? "text-primary bg-primary/10 scale-105 shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105",
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
                )}

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                {/* Icon and label */}
                <div className="relative z-10 flex flex-col items-center">
                  <Icon
                    className={cn(
                      "w-5 h-5 mb-1 transition-all duration-300",
                      isActive ? "text-primary scale-110" : "group-hover:scale-110",
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium transition-all duration-300",
                      isActive ? "text-primary font-semibold" : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {label}
                  </span>
                </div>

                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-100 bg-white/20 animate-ping" />
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
