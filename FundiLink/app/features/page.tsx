"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  CreditCard,
  MessageCircle,
  Bot,
  Star,
  ArrowRight,
  CheckCircle,
  Smartphone,
  Shield,
} from "lucide-react"

const features = [
  {
    id: "booking",
    title: "Easy Booking",
    description: "Book any service in just 3 taps. No complicated forms or lengthy processes.",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    benefits: ["3-step booking process", "Instant confirmation", "Flexible scheduling"],
    demo: "Try booking a plumber",
  },
  {
    id: "payment",
    title: "M-Pesa Payment",
    description: "Secure payments through M-Pesa STK push. Pay only when satisfied.",
    icon: CreditCard,
    color: "text-green-600",
    bgColor: "bg-green-50",
    benefits: ["STK push integration", "Secure transactions", "Payment protection"],
    demo: "See payment flow",
  },
  {
    id: "chat",
    title: "WhatsApp Chat",
    description: "Direct communication with fundis through WhatsApp for updates and coordination.",
    icon: MessageCircle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    benefits: ["Real-time messaging", "Photo sharing", "Voice messages"],
    demo: "Start a chat",
  },
  {
    id: "assistant",
    title: "AI Assistant",
    description: "Get personalized recommendations and instant help with our smart assistant.",
    icon: Bot,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    benefits: ["Smart recommendations", "24/7 availability", "Instant responses"],
    demo: "Ask the assistant",
  },
  {
    id: "rating",
    title: "Rating System",
    description: "Transparent reviews and ratings help you choose the best fundis for your needs.",
    icon: Star,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    benefits: ["Verified reviews", "Photo evidence", "Quality assurance"],
    demo: "View ratings",
  },
]

export default function FeaturesPage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const router = useRouter()

  const handleDemo = (featureId: string) => {
    switch (featureId) {
      case "booking":
        router.push("/book")
        break
      case "payment":
        router.push("/payment/demo")
        break
      case "chat":
        router.push("/chat")
        break
      case "assistant":
        router.push("/chat?assistant=true")
        break
      case "rating":
        router.push("/rating/demo")
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 pt-12 pb-8">
        <div className="container-mobile text-center">
          <h1 className="text-3xl font-bold text-foreground mb-3">Powerful Features</h1>
          <p className="text-muted-foreground mb-6">
            Discover what makes FundiLink the best platform for finding local services
          </p>
          <Badge variant="secondary" className="mb-4">
            <Smartphone className="w-3 h-3 mr-1" />
            Mobile-First Experience
          </Badge>
        </div>
      </div>

      <div className="container-mobile py-6">
        {/* Feature Cards */}
        <div className="space-y-6">
          {features.map((feature) => {
            const Icon = feature.icon
            const isSelected = selectedFeature === feature.id

            return (
              <Card
                key={feature.id}
                className={`card-premium cursor-pointer transition-all duration-300 ${
                  isSelected ? "ring-2 ring-primary shadow-lg scale-[1.02]" : "hover:shadow-md"
                }`}
                onClick={() => setSelectedFeature(isSelected ? null : feature.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-5 h-5 text-muted-foreground transition-transform ${isSelected ? "rotate-90" : ""}`}
                    />
                  </div>
                </CardHeader>

                {isSelected && (
                  <CardContent className="pt-0">
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 text-primary mr-2" />
                        Key Benefits
                      </h4>
                      <ul className="space-y-2 mb-4">
                        {feature.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDemo(feature.id)
                        }}
                        className="w-full btn-primary"
                      >
                        {feature.demo}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {/* Trust Indicators */}
        <Card className="card-premium mt-8 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Trusted Platform</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-xs text-muted-foreground">Verified Fundis</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">4.8★</div>
                <div className="text-xs text-muted-foreground">Average Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-xs text-muted-foreground">Support</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Button onClick={() => router.push("/")} className="btn-primary w-full">
            Start Exploring
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-xs text-muted-foreground mt-2">No account required • Start as guest</p>
        </div>
      </div>
    </div>
  )
}
