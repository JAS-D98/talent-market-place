"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star, Clock, SlidersHorizontal } from "lucide-react"
import { useApp } from "@/components/providers"
import { useGuestRestriction } from "@/hooks/use-guest-restriction"

const mockFundis = [
  {
    id: 1,
    name: "John Mwangi",
    service: "Plumber",
    category: "plumber",
    rating: 4.9,
    reviews: 127,
    price: 1500,
    priceUnit: "hr",
    location: "Westlands, Nairobi",
    distance: "2.3 km",
    image: "/placeholder.svg?height=80&width=80",
    verified: true,
    available: true,
    responseTime: "< 30 min",
    completedJobs: 89,
  },
  {
    id: 2,
    name: "Grace Wanjiku",
    service: "House Cleaner",
    category: "cleaner",
    rating: 4.8,
    reviews: 89,
    price: 2000,
    priceUnit: "day",
    location: "Karen, Nairobi",
    distance: "4.1 km",
    image: "/placeholder.svg?height=80&width=80",
    verified: true,
    available: true,
    responseTime: "< 1 hour",
    completedJobs: 156,
  },
  {
    id: 3,
    name: "Peter Ochieng",
    service: "Electrician",
    category: "electrician",
    rating: 4.7,
    reviews: 156,
    price: 2500,
    priceUnit: "hr",
    location: "CBD, Nairobi",
    distance: "1.8 km",
    image: "/placeholder.svg?height=80&width=80",
    verified: true,
    available: false,
    responseTime: "< 2 hours",
    completedJobs: 203,
  },
  {
    id: 4,
    name: "Mary Njeri",
    service: "Math Tutor",
    category: "tutor",
    rating: 4.9,
    reviews: 67,
    price: 1000,
    priceUnit: "session",
    location: "Kilimani, Nairobi",
    distance: "3.2 km",
    image: "/placeholder.svg?height=80&width=80",
    verified: true,
    available: true,
    responseTime: "< 15 min",
    completedJobs: 124,
  },
]

const sortOptions = [
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "distance", label: "Nearest First" },
  { value: "availability", label: "Available Now" },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFundis, setFilteredFundis] = useState(mockFundis)
  const [sortBy, setSortBy] = useState("rating")
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()
  const { state, setSearch } = useApp()
  const searchParams = useSearchParams()
  const { checkGuestRestriction, GuestRestrictionModal } = useGuestRestriction()

  useEffect(() => {
    // Initialize search from app state or URL params
    const query = state.searchQuery || searchParams.get("q") || ""
    const category = state.selectedCategory || searchParams.get("category")

    setSearchQuery(query)
    filterAndSortFundis(query, category, sortBy)
  }, [state.searchQuery, state.selectedCategory, sortBy])

  const filterAndSortFundis = (query: string, category: string | null, sort: string) => {
    let filtered = mockFundis

    // Filter by search query
    if (query) {
      filtered = filtered.filter(
        (fundi) =>
          fundi.name.toLowerCase().includes(query.toLowerCase()) ||
          fundi.service.toLowerCase().includes(query.toLowerCase()),
      )
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter((fundi) => fundi.category === category)
    }

    // Sort results
    switch (sort) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "distance":
        filtered.sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance))
        break
      case "availability":
        filtered.sort((a, b) => (b.available ? 1 : 0) - (a.available ? 1 : 0))
        break
    }

    setFilteredFundis(filtered)
  }

  const handleSearch = () => {
    setSearch(searchQuery, state.selectedCategory)
    filterAndSortFundis(searchQuery, state.selectedCategory, sortBy)
  }

  const handleBooking = (fundiId: number) => {
    if (
      !checkGuestRestriction("book services", "To book services and receive confirmations, please create an account.")
    ) {
      return
    }
    router.push(`/book?fundi=${fundiId}`)
  }

  const handleChat = (fundiId: number) => {
    // In a real app, this would open WhatsApp or in-app chat
    window.open(
      `https://wa.me/254792099302?text=Hi, I found you on FundiLink and would like to discuss a service.`,
      "_blank",
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 pt-12 pb-6">
        <div className="container-mobile">
          <h1 className="text-2xl font-bold text-foreground mb-4">Find Fundis</h1>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search for services or fundis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 py-3 rounded-xl border-2 bg-white/80 backdrop-blur-sm"
            />
            <Button
              onClick={handleSearch}
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg"
            >
              Search
            </Button>
          </div>

          {/* Filters and Sort */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </Button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border bg-white text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="container-mobile py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">{filteredFundis.length} Fundis Found</h2>
            {state.selectedCategory && (
              <Badge variant="secondary" className="mt-1">
                {state.selectedCategory}
              </Badge>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredFundis.map((fundi) => (
            <Card
              key={fundi.id}
              className="card-premium cursor-pointer hover:scale-[1.01] transition-transform"
              onClick={() => router.push(`/fundi/${fundi.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  {/* Profile Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={fundi.image || "/placeholder.svg"}
                      alt={fundi.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    {fundi.verified && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{fundi.name}</h3>
                        <p className="text-sm text-muted-foreground">{fundi.service}</p>
                      </div>
                      <Badge variant={fundi.available ? "default" : "secondary"} className="text-xs">
                        {fundi.available ? "Available" : "Busy"}
                      </Badge>
                    </div>

                    {/* Rating and Location */}
                    <div className="flex items-center space-x-4 mb-3 text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-accent fill-current mr-1" />
                        <span className="font-medium">{fundi.rating}</span>
                        <span className="text-muted-foreground ml-1">({fundi.reviews})</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{fundi.distance}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{fundi.responseTime}</span>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-semibold text-primary">KSh {fundi.price.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">/{fundi.priceUnit}</span>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleChat(fundi.id)
                          }}
                          className="text-xs px-3"
                        >
                          Chat
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBooking(fundi.id)
                          }}
                          className="text-xs px-3"
                          disabled={!fundi.available}
                        >
                          Book
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredFundis.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No fundis found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSearch("", null)
                filterAndSortFundis("", null, sortBy)
              }}
            >
              Clear Search
            </Button>
          </div>
        )}

        {/* Guest Restriction Modal */}
        <GuestRestrictionModal />
      </div>
    </div>
  )
}
