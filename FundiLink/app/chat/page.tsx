"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Bot, Phone, ArrowLeft, ExternalLink, HelpCircle } from "lucide-react"

export default function ChatPage() {
  const router = useRouter()

  const handleWhatsAppSupport = () => {
    const message = "Hi! I need help with FundiLink services."
    window.open(`https://wa.me/254792099302?text=${encodeURIComponent(message)}`, "_blank")
  }

  const handleAIAssistant = () => {
    // In a real app, this would open an AI chat interface
    alert("AI Assistant feature coming soon!")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 pt-12 pb-6">
        <div className="container-mobile">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-2 p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Chat & Support</h1>
          </div>
        </div>
      </div>

      <div className="container-mobile py-6 space-y-6">
        {/* WhatsApp Support */}
        <Card className="card-premium cursor-pointer hover:scale-[1.02] transition-transform">
          <CardContent className="p-6" onClick={handleWhatsAppSupport}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">WhatsApp Support</h3>
                <p className="text-sm text-muted-foreground">Get instant help from our support team</p>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant */}
        <Card className="card-premium cursor-pointer hover:scale-[1.02] transition-transform">
          <CardContent className="p-6" onClick={handleAIAssistant}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">AI Assistant</h3>
                <p className="text-sm text-muted-foreground">Get smart recommendations and instant answers</p>
              </div>
              <div className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">Coming Soon</div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Help */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              Quick Help
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/20">
              <h4 className="font-medium text-sm mb-1">How to book a service?</h4>
              <p className="text-xs text-muted-foreground">
                Search for a service, select a fundi, choose date/time, and pay securely.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20">
              <h4 className="font-medium text-sm mb-1">Payment methods</h4>
              <p className="text-xs text-muted-foreground">
                We accept M-Pesa payments with secure STK push integration.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20">
              <h4 className="font-medium text-sm mb-1">Guest mode</h4>
              <p className="text-xs text-muted-foreground">
                You can explore and book services without creating an account.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Options */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Need more help? Contact us directly</p>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={handleWhatsAppSupport} className="flex-1 h-12 border-2 bg-transparent">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button variant="outline" onClick={() => window.open("tel:+254700000000")} className="flex-1 h-12 border-2">
              <Phone className="w-4 h-4 mr-2" />
              Call Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
