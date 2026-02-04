"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface AestheticBackButtonProps {
  className?: string
  variant?: "default" | "glass" | "minimal"
  showHomeIcon?: boolean
}

export function AestheticBackButton({ className, variant = "glass", showHomeIcon = true }: AestheticBackButtonProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Don't show on home page or splash
  if (pathname === "/" || pathname === "/splash") {
    return null
  }

  const handleBack = () => {
    // If there's history, go back, otherwise go home
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  const handleHome = () => {
    router.push("/")
  }

  const baseClasses = "group relative overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"

  const variantClasses = {
    default: "bg-white/90 hover:bg-white border border-white/20 shadow-lg hover:shadow-xl",
    glass: "bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 shadow-lg hover:shadow-xl",
    minimal: "bg-transparent hover:bg-white/10 border border-transparent hover:border-white/20",
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Back Button */}
      <Button
        onClick={handleBack}
        size="sm"
        className={cn(baseClasses, variantClasses[variant], "w-12 h-12 rounded-2xl p-0", className)}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        {/* Icon container */}
        <div className="relative z-10 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground/80 group-hover:text-foreground transition-all duration-300 group-hover:-translate-x-0.5" />
        </div>

        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-100 bg-white/30 animate-ping" />
      </Button>

      {/* Home Button (optional) */}
      {showHomeIcon && (
        <Button
          onClick={handleHome}
          size="sm"
          className={cn(baseClasses, variantClasses[variant], "w-10 h-10 rounded-xl p-0", className)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          <div className="relative z-10 flex items-center justify-center">
            <Home className="w-4 h-4 text-foreground/70 group-hover:text-foreground transition-all duration-300 group-hover:scale-110" />
          </div>
        </Button>
      )}
    </div>
  )
}
