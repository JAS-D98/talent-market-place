"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CreditCard, Smartphone, CheckCircle, AlertCircle, ArrowLeft, Loader2, Shield } from "lucide-react"
import { useApp } from "@/components/providers"

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("mpesa")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed" | null>(null)
  const [transactionId, setTransactionId] = useState("")

  const router = useRouter()
  const { state } = useApp()

  // Mock booking data - in real app this would come from state
  const booking = {
    service: "Pipe Repair",
    fundi: "John Mwangi",
    date: "2024-01-15",
    time: "10:00 AM",
    location: "Westlands, Nairobi",
    basePrice: 1500,
    serviceFee: 150,
    total: 1650,
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStatus("pending")

    // Simulate M-Pesa STK push
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Simulate payment success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1

    if (isSuccess) {
      setPaymentStatus("success")
      setTransactionId("MP" + Math.random().toString(36).substr(2, 9).toUpperCase())

      // Redirect to confirmation after 2 seconds
      setTimeout(() => {
        router.push("/booking/confirmation")
      }, 2000)
    } else {
      setPaymentStatus("failed")
    }

    setIsProcessing(false)
  }

  const handleRetry = () => {
    setPaymentStatus(null)
    setTransactionId("")
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="card-premium max-w-sm w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-4">Your booking has been confirmed</p>
            <Badge variant="secondary" className="mb-4">
              Transaction ID: {transactionId}
            </Badge>
            <p className="text-sm text-muted-foreground">Redirecting to confirmation...</p>
          </CardContent>
        </Card>
      </div>
    )
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
            <h1 className="text-xl font-semibold">Payment</h1>
          </div>
        </div>
      </div>

      <div className="container-mobile py-6 space-y-6">
        {/* Booking Summary */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-lg">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium">{booking.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fundi</span>
              <span className="font-medium">{booking.fundi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date & Time</span>
              <span className="font-medium">
                {booking.date} at {booking.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location</span>
              <span className="font-medium">{booking.location}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Breakdown */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-lg">Payment Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service Fee</span>
              <span>KSh {booking.basePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform Fee</span>
              <span>KSh {booking.serviceFee.toLocaleString()}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-primary">KSh {booking.total.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-lg">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* M-Pesa Option */}
            <div
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === "mpesa" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"
              }`}
              onClick={() => setPaymentMethod("mpesa")}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">M-Pesa</h3>
                  <p className="text-sm text-muted-foreground">Pay with M-Pesa STK Push</p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    paymentMethod === "mpesa" ? "border-primary bg-primary" : "border-muted"
                  }`}
                >
                  {paymentMethod === "mpesa" && <div className="w-full h-full rounded-full bg-white scale-50" />}
                </div>
              </div>
            </div>

            {/* Phone Number Input for M-Pesa */}
            {paymentMethod === "mpesa" && (
              <div>
                <label className="block text-sm font-medium mb-2">M-Pesa Phone Number</label>
                <Input
                  placeholder="0700 000 000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="rounded-xl"
                />
                <p className="text-xs text-muted-foreground mt-1">You'll receive an STK push notification</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Status */}
        {paymentStatus && (
          <Card
            className={`card-premium ${
              paymentStatus === "pending"
                ? "bg-blue-50 border-blue-200"
                : paymentStatus === "failed"
                  ? "bg-red-50 border-red-200"
                  : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                {paymentStatus === "pending" && (
                  <>
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <div>
                      <p className="font-medium text-blue-900">Processing Payment</p>
                      <p className="text-sm text-blue-700">Please check your phone for M-Pesa prompt</p>
                    </div>
                  </>
                )}
                {paymentStatus === "failed" && (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900">Payment Failed</p>
                      <p className="text-sm text-red-700">Please try again or use a different number</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        <Card className="card-premium bg-muted/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">
                  Your payment is protected by M-Pesa's secure payment system
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {paymentStatus === "failed" ? (
            <Button onClick={handleRetry} className="w-full h-12 btn-primary">
              Try Again
            </Button>
          ) : (
            <Button
              onClick={handlePayment}
              disabled={!phoneNumber || isProcessing || paymentStatus === "pending"}
              className="w-full h-12 btn-primary"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay KSh {booking.total.toLocaleString()}
                </>
              )}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full h-12 rounded-xl border-2"
            disabled={isProcessing || paymentStatus === "pending"}
          >
            Back to Booking
          </Button>
        </div>
      </div>
    </div>
  )
}
