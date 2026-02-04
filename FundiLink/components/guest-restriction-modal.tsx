"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, User, ArrowRight, X, Sparkles, CheckCircle } from "lucide-react"

interface GuestRestrictionModalProps {
  isOpen: boolean
  onClose: () => void
  feature: string
  description?: string
}

export function GuestRestrictionModal({ isOpen, onClose, feature, description }: GuestRestrictionModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleSignUp = () => {
    const currentUrl = window.location.pathname + window.location.search
    router.push(`/auth?returnUrl=${encodeURIComponent(currentUrl)}`)
  }

  const benefits = [
    "Track all your bookings",
    "Save favorite fundis",
    "Faster checkout process",
    "Personalized recommendations",
    "Priority customer support",
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="card-premium max-w-sm w-full animate-scale-in">
        <CardContent className="p-6">
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2 hover:bg-muted/50 rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Icon and Title */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Account Required</h2>
            <Badge variant="secondary" className="mb-3">
              <User className="w-3 h-3 mr-1" />
              Guest Mode
            </Badge>
            <p className="text-sm text-muted-foreground">
              {description || `To ${feature.toLowerCase()}, you need to create an account or sign in.`}
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-accent" />
              Account Benefits
            </h3>
            <div className="space-y-2">
              {benefits.slice(0, 3).map((benefit, index) => (
                <div key={index} className="flex items-center text-sm">
                  <CheckCircle className="w-3 h-3 text-primary mr-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={handleSignUp} className="w-full btn-primary h-12">
              Create Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push(`/auth?returnUrl=${encodeURIComponent(window.location.pathname)}`)}
              className="w-full h-12 border-2 bg-transparent"
            >
              Sign In Instead
            </Button>
          </div>

          {/* Continue as Guest */}
          <div className="text-center mt-4">
            <Button variant="ghost" onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">
              Continue Browsing as Guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
