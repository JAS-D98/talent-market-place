"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, User, Phone, ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { useApp } from "@/components/providers"
import { useGuestRestriction } from "@/hooks/use-guest-restriction"

const steps = [
  { id: 1, title: "Service & Fundi", icon: User },
  { id: 2, title: "Location & Time", icon: MapPin },
  { id: 3, title: "Contact Info", icon: Phone },
  { id: 4, title: "Confirm & Pay", icon: CheckCircle },
]

const timeSlots = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
]

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    fundiId: null,
    service: "",
    date: "",
    time: "",
    location: "",
    description: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { state, setBooking } = useApp()
  const { checkGuestRestriction, GuestRestrictionModal } = useGuestRestriction()

  useEffect(() => {
    const fundiId = searchParams.get("fundi")
    if (fundiId) {
      setBookingData((prev) => ({ ...prev, fundiId: Number.parseInt(fundiId) }))
    }
  }, [searchParams])

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      handleBookingSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }

  const handleBookingSubmit = async () => {
    // Check if guest user is trying to book
    if (
      !checkGuestRestriction(
        "book services",
        "To complete your booking and receive confirmation, please create an account or sign in.",
      )
    ) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Save booking data
    setBooking(bookingData)

    // Redirect to payment
    router.push("/payment")
    setIsLoading(false)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return bookingData.service
      case 2:
        return bookingData.date && bookingData.time && bookingData.location
      case 3:
        return bookingData.contactName && bookingData.contactPhone
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 pt-12 pb-6">
        <div className="container-mobile">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={handleBack} className="mr-2 p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Book Service</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${
                      isActive
                        ? "bg-primary text-white"
                        : isCompleted
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                    }
                  `}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`
                      w-8 h-0.5 mx-2 transition-all
                      ${isCompleted ? "bg-primary" : "bg-muted"}
                    `}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="container-mobile py-6">
        {/* Step 1: Service & Fundi */}
        {currentStep === 1 && (
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Select Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Service Type</label>
                <select
                  value={bookingData.service}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, service: e.target.value }))}
                  className="w-full p-3 rounded-xl border bg-white"
                >
                  <option value="">Select a service</option>
                  <option value="pipe-repair">Pipe Repair - KSh 1,500</option>
                  <option value="toilet-installation">Toilet Installation - KSh 3,000</option>
                  <option value="water-heater">Water Heater Service - KSh 2,500</option>
                  <option value="emergency">Emergency Call - KSh 2,000/hr</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <Textarea
                  placeholder="Describe your specific needs..."
                  value={bookingData.description}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, description: e.target.value }))}
                  className="rounded-xl"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Location & Time */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle>When & Where</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    placeholder="Enter your address"
                    value={bookingData.location}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, location: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, date: e.target.value }))}
                    className="rounded-xl"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setBookingData((prev) => ({ ...prev, time }))}
                        className={`
                          p-2 rounded-lg text-sm border transition-all
                          ${
                            bookingData.time === time
                              ? "bg-primary text-white border-primary"
                              : "bg-white border-muted hover:border-primary/50"
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Contact Info */}
        {currentStep === 3 && (
          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              {state.isGuest && (
                <p className="text-sm text-muted-foreground">We need your contact details to coordinate the service</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <Input
                  placeholder="Enter your full name"
                  value={bookingData.contactName}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, contactName: e.target.value }))}
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  placeholder="0700 000 000"
                  value={bookingData.contactPhone}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email (Optional)</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={bookingData.contactEmail}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">{bookingData.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium">
                      {bookingData.date} at {bookingData.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{bookingData.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact</span>
                    <span className="font-medium">{bookingData.contactName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium bg-accent/5 border-accent/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-accent" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payment Required</p>
                    <p className="text-xs text-muted-foreground">
                      You'll be redirected to M-Pesa payment after confirmation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex space-x-4 mt-8">
          <Button variant="outline" onClick={handleBack} className="flex-1 h-12 rounded-xl border-2 bg-transparent">
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>

          <Button onClick={handleNext} disabled={!isStepValid() || isLoading} className="flex-1 h-12 btn-primary">
            {isLoading ? (
              "Processing..."
            ) : currentStep === 4 ? (
              "Confirm & Pay"
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Guest Restriction Modal */}
        <GuestRestrictionModal />
      </div>
    </div>
  )
}
