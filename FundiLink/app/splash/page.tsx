"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"

export default function SplashPage() {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col items-center justify-center p-6">
      <div
        className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-primary rounded-3xl flex items-center justify-center mb-4 shadow-lg">
            <Sparkles className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">FundiLink</h1>
          <p className="text-lg text-muted-foreground">Find & Book Local Services</p>
        </div>

        {/* Tagline */}
        <div className="mb-12 max-w-sm mx-auto">
          <p className="text-muted-foreground leading-relaxed">
            Connect with trusted local service providers. Book instantly, pay securely, and get the job done right.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 w-full max-w-sm mx-auto">
          <Button onClick={() => router.push("/")} className="w-full btn-primary group">
            Explore as Guest
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            onClick={() => router.push("/auth")}
            variant="outline"
            className="w-full py-3 rounded-xl border-2 hover:bg-muted/50"
          >
            Get Started
          </Button>
        </div>

        {/* Features Preview */}
        <div className="mt-12 grid grid-cols-2 gap-4 max-w-sm mx-auto text-sm">
          <div className="text-center">
            <div className="w-8 h-8 bg-accent/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-accent font-bold">✓</span>
            </div>
            <p className="text-muted-foreground">No Sign-up Required</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-primary/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-primary font-bold">₹</span>
            </div>
            <p className="text-muted-foreground">M-Pesa Payments</p>
          </div>
        </div>
      </div>
    </div>
  )
}
