"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Search,
  Sparkles,
  Users,
  Star,
  ArrowRight,
  MessageCircle,
  CalendarIcon,
  MapPin,
  Clock,
  Shield,
  Zap,
  Heart,
  ChevronRight,
  Play,
  CheckCircle,
} from "lucide-react"
import { useApp } from "@/components/providers"
import { useGuestRestriction } from "@/hooks/use-guest-restriction"

const categories = [
  {
    id: "plumber",
    name: "Plumber",
    icon: "🔧",
    color: "bg-blue-100 text-blue-700",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    id: "cleaner",
    name: "Cleaner",
    icon: "🧹",
    color: "bg-green-100 text-green-700",
    gradient: "from-green-400 to-green-600",
  },
  {
    id: "electrician",
    name: "Electrician",
    icon: "⚡",
    color: "bg-yellow-100 text-yellow-700",
    gradient: "from-yellow-400 to-yellow-600",
  },
  {
    id: "tutor",
    name: "Tutor",
    icon: "📚",
    color: "bg-purple-100 text-purple-700",
    gradient: "from-purple-400 to-purple-600",
  },
  {
    id: "mechanic",
    name: "Mechanic",
    icon: "🔩",
    color: "bg-red-100 text-red-700",
    gradient: "from-red-400 to-red-600",
  },
  {
    id: "gardener",
    name: "Gardener",
    icon: "🌱",
    color: "bg-emerald-100 text-emerald-700",
    gradient: "from-emerald-400 to-emerald-600",
  },
]

const featuredFundis = [
  {
    id: 1,
    name: "John Mwangi",
    service: "Plumber",
    rating: 4.9,
    reviews: 127,
    price: "KSh 1,500/hr",
    image: "/placeholder.svg?height=80&width=80",
    verified: true,
    available: true,
    location: "Westlands",
    responseTime: "< 30 min",
    badge: "Top Rated",
  },
  {
    id: 2,
    name: "Grace Wanjiku",
    service: "House Cleaner",
    rating: 4.8,
    reviews: 89,
    price: "KSh 2,000/day",
    image: "/placeholder.svg?height=80&width=80",
    verified: true,
    available: true,
    location: "Karen",
    responseTime: "< 1 hour",
    badge: "Most Booked",
  },
  {
    id: 3,
    name: "Peter Ochieng",
    service: "Electrician",
    rating: 4.7,
    reviews: 156,
    price: "KSh 2,500/hr",
    image: "/placeholder.svg?height=80&width=80",
    verified: true,
    available: false,
    location: "CBD",
    responseTime: "< 2 hours",
    badge: "Expert",
  },
]

const stats = [
  { label: "Active Fundis", value: "500+", icon: Users },
  { label: "Services Completed", value: "10K+", icon: CheckCircle },
  { label: "Average Rating", value: "4.8★", icon: Star },
  { label: "Response Time", value: "< 30min", icon: Clock },
]

const testimonials = [
  {
    name: "Sarah M.",
    service: "Plumbing",
    rating: 5,
    comment: "Amazing service! Fixed my pipes in no time. Highly recommend!",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "David K.",
    service: "Cleaning",
    rating: 5,
    comment: "Professional and thorough. My house has never been cleaner!",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const router = useRouter()
  const { state, setSearch } = useApp()
  const { checkGuestRestriction, GuestRestrictionModal } = useGuestRestriction()

  const handleSearch = () => {
    setSearch(searchQuery)
    router.push("/search")
  }

  const handleCategorySelect = (categoryId: string) => {
    setSearch("", categoryId)
    router.push("/search")
  }

  const handleQuickBook = () => {
    if (
      checkGuestRestriction("book services", "To book services and track your appointments, please create an account.")
    ) {
      router.push("/book")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

        <div className="relative pt-16 pb-12">
          <div className="container-mobile">
            {/* Welcome Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                {state.isGuest ? "Welcome to FundiLink" : `Welcome back, ${state.user?.name}!`}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                Find Local
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Service Experts
                </span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                Connect with trusted professionals in your area. Book instantly, pay securely, and get quality work
                done.
              </p>

              {/* Status Badge */}
              {state.isGuest && (
                <Badge variant="secondary" className="mb-6 px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  Browsing as Guest
                </Badge>
              )}
            </div>

            {/* Enhanced Search Bar */}
            <div className="relative mb-8">
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search for a service"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-12 pr-32 py-4 text-md rounded-2xl border-0 bg-transparent focus:ring-2 focus:ring-primary/20"
                />
                <Button
                  onClick={handleSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 px-2 py-2 rounded-xl bg-primary hover:bg-primary/90"
                >
                  Search
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Quick Suggestions */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {["Plumber", "Cleaner", "Electrician", "Tutor"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setSearchQuery(suggestion)
                      handleSearch()
                    }}
                    className="px-3 py-1 text-sm bg-white/60 hover:bg-white/80 rounded-full text-muted-foreground hover:text-foreground transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Button
                onClick={handleQuickBook}
                className="h-16 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex flex-col items-center space-y-1">
                  <CalendarIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Quick Book</span>
                </div>
              </Button>

              <Button
                onClick={() => setShowCalendar(!showCalendar)}
                variant="outline"
                className="h-16 border-2 border-white/30 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex flex-col items-center space-y-1">
                  <CalendarIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Schedule</span>
                </div>
              </Button>
            </div>

            {/* Calendar Widget */}
            {showCalendar && (
              <Card className="card-premium mb-8 animate-slide-up">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Select a Date</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCalendar(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </Button>
                  </div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-xl border-0"
                  />
                  {selectedDate && (
                    <div className="mt-4 p-3 bg-primary/5 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-2">Selected Date:</p>
                      <p className="font-medium">
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <Button
                        onClick={() => {
                          if (
                            checkGuestRestriction(
                              "book services",
                              "To book services for this date, please create an account.",
                            )
                          ) {
                            router.push(`/book?date=${selectedDate.toISOString().split("T")[0]}`)
                          }
                        }}
                        className="w-full mt-3 btn-primary"
                      >
                        Book for This Date
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-8 bg-white/50 backdrop-blur-sm border-y border-white/20">
        <div className="container-mobile">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="container-mobile py-8 space-y-12">
        {/* Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Popular Services</h2>
              <p className="text-muted-foreground">Find the right professional for your needs</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.push("/search")}
              className="text-primary hover:text-primary/80 group"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="card-premium cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group overflow-hidden"
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardContent className="p-6 relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />
                  <div className="relative text-center">
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">Professional services</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Fundis */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Top Rated Professionals</h2>
              <p className="text-muted-foreground">Trusted experts with proven track records</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.push("/search")}
              className="text-primary hover:text-primary/80 group"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="space-y-4">
            {featuredFundis.map((fundi, index) => (
              <Card
                key={fundi.id}
                className="card-premium cursor-pointer hover:scale-[1.01] transition-all duration-300 group"
                onClick={() => router.push(`/fundi/${fundi.id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={fundi.image || "/placeholder.svg"}
                        alt={fundi.name}
                        className="w-16 h-16 rounded-2xl object-cover group-hover:scale-105 transition-transform"
                      />
                      {fundi.verified && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                          <Shield className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -left-1 px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full font-medium">
                        #{index + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {fundi.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{fundi.service}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge
                            variant={fundi.available ? "default" : "secondary"}
                            className={`text-xs ${fundi.available ? "bg-green-100 text-green-700" : ""}`}
                          >
                            {fundi.available ? "Available" : "Busy"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {fundi.badge}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mb-3 text-sm">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-accent fill-current mr-1" />
                          <span className="font-semibold">{fundi.rating}</span>
                          <span className="text-muted-foreground ml-1">({fundi.reviews})</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{fundi.location}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{fundi.responseTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{fundi.price}</span>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(
                                `https://wa.me/254792099302?text=Hi ${fundi.name}, I found you on FundiLink!`,
                                "_blank",
                              )
                            }}
                            className="text-xs px-3 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Chat
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (
                                checkGuestRestriction(
                                  "book services",
                                  "To book this professional, please create an account.",
                                )
                              ) {
                                router.push(`/book?fundi=${fundi.id}`)
                              }
                            }}
                            className="text-xs px-3"
                            disabled={!fundi.available}
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">What Our Customers Say</h2>
            <p className="text-muted-foreground">Real experiences from real people</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-premium">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.service} Service</p>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-accent fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Highlight */}
        <section className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Why Choose FundiLink?</h2>
            <p className="text-muted-foreground">The smart way to find and book local services</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Verified Professionals</h3>
              <p className="text-sm text-muted-foreground">All fundis are background-checked and verified</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Instant Booking</h3>
              <p className="text-sm text-muted-foreground">Book services in seconds with our streamlined process</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Satisfaction Guaranteed</h3>
              <p className="text-sm text-muted-foreground">100% satisfaction guarantee or your money back</p>
            </div>
          </div>
        </section>

        {/* Guest Mode CTA */}
        {state.isGuest && (
          <Card className="card-premium bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Join thousands of satisfied customers who trust FundiLink for their service needs. Create your account
                today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => router.push("/auth")} className="btn-primary px-8 py-3">
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => router.push("/features")} className="border-2 px-8 py-3">
                  <Play className="w-4 h-4 mr-2" />
                  See How It Works
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Guest Restriction Modal */}
        <GuestRestrictionModal />
      </div>
    </div>
  )
}
