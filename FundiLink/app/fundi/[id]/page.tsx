"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  MapPin,
  Clock,
  MessageCircle,
  Calendar,
  Shield,
  Award,
  CheckCircle,
  ArrowLeft,
  Camera,
} from "lucide-react"
import { useApp } from "@/components/providers"
import { useGuestRestriction } from "@/hooks/use-guest-restriction"

// Mock data - in real app this would come from API
const mockFundiData = {
  1: {
    id: 1,
    name: "John Mwangi",
    service: "Professional Plumber",
    category: "plumber",
    rating: 4.9,
    reviews: 127,
    completedJobs: 89,
    responseTime: "< 30 min",
    location: "Westlands, Nairobi",
    distance: "2.3 km",
    image: "/placeholder.svg?height=120&width=120",
    verified: true,
    available: true,
    joinedDate: "March 2022",
    bio: "Experienced plumber with over 8 years in residential and commercial plumbing. Specializing in pipe repairs, installations, and emergency services. Available 24/7 for urgent repairs.",
    services: [
      { name: "Pipe Repair", price: 1500, unit: "job" },
      { name: "Toilet Installation", price: 3000, unit: "job" },
      { name: "Water Heater Service", price: 2500, unit: "job" },
      { name: "Emergency Call", price: 2000, unit: "hour" },
    ],
    gallery: [
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
    reviews: [
      {
        id: 1,
        name: "Sarah K.",
        rating: 5,
        date: "2 days ago",
        comment: "Excellent work! Fixed my kitchen sink quickly and professionally. Highly recommended.",
        images: ["/placeholder.svg?height=60&width=60"],
      },
      {
        id: 2,
        name: "Michael O.",
        rating: 5,
        date: "1 week ago",
        comment: "Very reliable and punctual. Great communication throughout the job.",
        images: [],
      },
      {
        id: 3,
        name: "Grace M.",
        rating: 4,
        date: "2 weeks ago",
        comment: "Good service, fair pricing. Will definitely call again for future plumbing needs.",
        images: [],
      },
    ],
  },
}

export default function FundiProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { state } = useApp()
  const [activeTab, setActiveTab] = useState("about")
  const { checkGuestRestriction, GuestRestrictionModal } = useGuestRestriction()

  const fundiId = Number.parseInt(params.id as string)
  const fundi = mockFundiData[fundiId as keyof typeof mockFundiData]

  if (!fundi) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Fundi not found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const handleBooking = () => {
    if (
      !checkGuestRestriction(
        "book this service",
        "To book services and receive confirmations, please create an account or sign in.",
      )
    ) {
      return
    }

    router.push(`/book?fundi=${fundiId}`)
  }

  const handleChat = () => {
    const message = `Hi ${fundi.name}, I found you on FundiLink and would like to discuss a ${fundi.service.toLowerCase()} service.`
    window.open(`https://wa.me/254792099302?text=${encodeURIComponent(message)}`, "_blank")
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
            <h1 className="text-xl font-semibold">Fundi Profile</h1>
          </div>

          {/* Profile Header */}
          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <img
                    src={fundi.image || "/placeholder.svg"}
                    alt={fundi.name}
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                  {fundi.verified && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{fundi.name}</h2>
                      <p className="text-muted-foreground">{fundi.service}</p>
                    </div>
                    <Badge variant={fundi.available ? "default" : "secondary"} className="ml-2">
                      {fundi.available ? "Available" : "Busy"}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-4 text-sm mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-accent fill-current mr-1" />
                      <span className="font-medium">{fundi.rating}</span>
                      <span className="text-muted-foreground ml-1">({fundi.reviews.length} reviews)</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{fundi.distance}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Responds in {fundi.responseTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      <span>{fundi.completedJobs} jobs completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container-mobile py-6">
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button onClick={handleBooking} className="btn-primary h-12" disabled={!fundi.available}>
            <Calendar className="w-5 h-5 mr-2" />
            Book Now
          </Button>
          <Button onClick={handleChat} variant="outline" className="h-12 border-2 bg-transparent">
            <MessageCircle className="w-5 h-5 mr-2" />
            WhatsApp
          </Button>
        </div>

        {/* Guest Mode Notice */}
        {state.isGuest && (
          <Card className="card-premium bg-accent/5 border-accent/20 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-accent" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Guest Mode</p>
                  <p className="text-xs text-muted-foreground">Create an account to book services</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-muted/30 p-1 rounded-xl">
          {[
            { id: "about", label: "About" },
            { id: "services", label: "Services" },
            { id: "reviews", label: "Reviews" },
            { id: "gallery", label: "Gallery" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "about" && (
          <div className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-lg">About {fundi.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">{fundi.bio}</p>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Joined</span>
                    <p className="font-medium">{fundi.joinedDate}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location</span>
                    <p className="font-medium">{fundi.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "services" && (
          <div className="space-y-4">
            {fundi.services.map((service, index) => (
              <Card key={index} className="card-premium">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">Professional {service.name.toLowerCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary">KSh {service.price.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">per {service.unit}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            {fundi.reviews.map((review) => (
              <Card key={review.id} className="card-premium">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{review.name}</h4>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "text-accent fill-current" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-muted-foreground mb-3">{review.comment}</p>
                  {review.images.length > 0 && (
                    <div className="flex space-x-2">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt="Review"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="grid grid-cols-2 gap-4">
            {fundi.gallery.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Work sample ${index + 1}`}
                  className="w-full h-full rounded-xl object-cover"
                />
                <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Guest Restriction Modal */}
        <GuestRestrictionModal />
      </div>
    </div>
  )
}
