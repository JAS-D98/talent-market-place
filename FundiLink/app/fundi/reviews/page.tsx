"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Star, ThumbsUp, Search, TrendingUp, Award, Users, Calendar, Eye, Reply } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for reviews
const reviewsData = [
  {
    id: "R001",
    client: {
      name: "John Doe",
      avatar: "/placeholder-user.jpg",
      verified: true,
    },
    job: {
      id: "J001",
      service: "Kitchen Plumbing",
      date: "2024-01-15",
      amount: 2500,
    },
    rating: 5,
    review:
      "Excellent work! Peter was very professional and completed the job quickly. The kitchen sink is working perfectly now. Highly recommend his services.",
    date: "2024-01-16",
    helpful: 12,
    response: null,
    categories: {
      quality: 5,
      punctuality: 5,
      communication: 5,
      professionalism: 5,
    },
  },
  {
    id: "R002",
    client: {
      name: "Mary Smith",
      avatar: "/placeholder-user.jpg",
      verified: true,
    },
    job: {
      id: "J002",
      service: "Bathroom Repair",
      date: "2024-01-13",
      amount: 1800,
    },
    rating: 4,
    review:
      "Good service overall. Peter arrived on time and fixed the pipe issue. The only minor issue was that he didn't clean up completely after the work, but the repair quality is solid.",
    date: "2024-01-14",
    helpful: 8,
    response:
      "Thank you for the feedback, Mary! I apologize for not cleaning up properly. I'll make sure to be more thorough in the future. Glad the repair is working well!",
    categories: {
      quality: 5,
      punctuality: 5,
      communication: 4,
      professionalism: 3,
    },
  },
  {
    id: "R003",
    client: {
      name: "David Wilson",
      avatar: "/placeholder-user.jpg",
      verified: false,
    },
    job: {
      id: "J003",
      service: "Pipe Installation",
      date: "2024-01-10",
      amount: 3200,
    },
    rating: 5,
    review:
      "Outstanding work! Peter installed new pipes for our kitchen renovation. He was knowledgeable, efficient, and the quality of work exceeded our expectations. Will definitely hire again.",
    date: "2024-01-11",
    helpful: 15,
    response:
      "Thank you so much, David! It was a pleasure working on your kitchen renovation. I'm glad you're happy with the results!",
    categories: {
      quality: 5,
      punctuality: 5,
      communication: 5,
      professionalism: 5,
    },
  },
  {
    id: "R004",
    client: {
      name: "Sarah Johnson",
      avatar: "/placeholder-user.jpg",
      verified: true,
    },
    job: {
      id: "J004",
      service: "Drain Cleaning",
      date: "2024-01-08",
      amount: 1200,
    },
    rating: 3,
    review:
      "The job was completed but took longer than expected. Peter was polite but communication could have been better regarding the delay.",
    date: "2024-01-09",
    helpful: 5,
    response: null,
    categories: {
      quality: 4,
      punctuality: 2,
      communication: 3,
      professionalism: 4,
    },
  },
  {
    id: "R005",
    client: {
      name: "Michael Brown",
      avatar: "/placeholder-user.jpg",
      verified: true,
    },
    job: {
      id: "J005",
      service: "Emergency Plumbing",
      date: "2024-01-05",
      amount: 2800,
    },
    rating: 5,
    review:
      "Peter saved the day! Emergency call on a Sunday and he responded quickly. Fixed our burst pipe professionally and at a fair price. Truly grateful for his service.",
    date: "2024-01-06",
    helpful: 20,
    response:
      "I'm so glad I could help during your emergency, Michael! That's exactly why I offer 24/7 service. Thank you for the kind words!",
    categories: {
      quality: 5,
      punctuality: 5,
      communication: 5,
      professionalism: 5,
    },
  },
]

export default function FundiReviewsPage() {
  const [reviews, setReviews] = useState(reviewsData)
  const [selectedReview, setSelectedReview] = useState(null)
  const [filterRating, setFilterRating] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [replyText, setReplyText] = useState("")
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const stats = {
    totalReviews: reviews.length,
    averageRating: (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1),
    fiveStars: reviews.filter((r) => r.rating === 5).length,
    fourStars: reviews.filter((r) => r.rating === 4).length,
    threeStars: reviews.filter((r) => r.rating === 3).length,
    twoStars: reviews.filter((r) => r.rating === 2).length,
    oneStar: reviews.filter((r) => r.rating === 1).length,
    responseRate: Math.round((reviews.filter((r) => r.response).length / reviews.length) * 100),
  }

  const categoryAverages = {
    quality: (reviews.reduce((sum, review) => sum + review.categories.quality, 0) / reviews.length).toFixed(1),
    punctuality: (reviews.reduce((sum, review) => sum + review.categories.punctuality, 0) / reviews.length).toFixed(1),
    communication: (reviews.reduce((sum, review) => sum + review.categories.communication, 0) / reviews.length).toFixed(
      1,
    ),
    professionalism: (
      reviews.reduce((sum, review) => sum + review.categories.professionalism, 0) / reviews.length
    ).toFixed(1),
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleReply = (reviewId) => {
    if (!replyText.trim()) {
      toast({
        title: "Reply Required",
        description: "Please enter a reply message.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setReviews((prevReviews) =>
        prevReviews.map((review) => (review.id === reviewId ? { ...review, response: replyText } : review)),
      )

      toast({
        title: "Reply Sent",
        description: "Your reply has been posted successfully.",
      })

      setReplyDialogOpen(false)
      setReplyText("")
      setSelectedReview(null)
      setIsLoading(false)
    }, 1500)
  }

  const filteredReviews = reviews.filter((review) => {
    const matchesRating = filterRating === "all" || review.rating.toString() === filterRating
    const matchesSearch =
      review.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.job.service.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRating && matchesSearch
  })

  const getRatingDistribution = (stars) => {
    return (
      (stats[
        `${stars === 1 ? "oneStar" : stars === 2 ? "twoStars" : stars === 3 ? "threeStars" : stars === 4 ? "fourStars" : "fiveStars"}`
      ] /
        stats.totalReviews) *
      100
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20 xl:pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8 pt-4 lg:pt-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Reviews & Ratings</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your client feedback and build your reputation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/10 text-primary">
              <Award className="w-3 h-3 mr-1" />
              {stats.responseRate}% Response Rate
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Rating */}
          <Card className="card-premium lg:col-span-1">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                  <span className="text-4xl font-bold text-foreground">{stats.averageRating}</span>
                </div>
                <p className="text-muted-foreground mb-4">Overall Rating</p>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-5 h-5",
                        i < Math.floor(stats.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Based on {stats.totalReviews} reviews</p>
              </div>
            </CardContent>
          </Card>

          {/* Rating Distribution */}
          <Card className="card-premium lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{stars}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <Progress value={getRatingDistribution(stars)} className="h-2" />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {
                        stats[
                          `${stars === 1 ? "oneStar" : stars === 2 ? "twoStars" : stars === 3 ? "threeStars" : stars === 4 ? "fourStars" : "fiveStars"}`
                        ]
                      }
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Ratings */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Performance by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(categoryAverages).map(([category, rating]) => (
                <div key={category} className="text-center p-4 bg-muted/30 rounded-xl">
                  <h3 className="font-medium mb-2 capitalize">{category}</h3>
                  <p className="text-3xl font-bold text-primary mb-1">{rating}</p>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-3 h-3",
                          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                        )}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-green-600">+0.2</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card className="card-premium">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search reviews, clients, or services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterRating === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRating("all")}
                >
                  All
                </Button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    variant={filterRating === rating.toString() ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterRating(rating.toString())}
                  >
                    {rating}★
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <Card className="card-premium">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No reviews found</h3>
                <p className="text-muted-foreground text-sm">
                  {searchQuery || filterRating !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "You don't have any reviews yet. Complete jobs to start receiving reviews."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map((review) => (
              <Card key={review.id} className="card-premium hover-lift">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Review Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12 flex-shrink-0">
                          <AvatarImage src={review.client.avatar || "/placeholder.svg"} alt={review.client.name} />
                          <AvatarFallback>
                            {review.client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{review.client.name}</h3>
                            {review.client.verified && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                <Users className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <span>{review.job.service}</span>
                            <span>•</span>
                            <span>{review.date}</span>
                            <span>•</span>
                            <span>{formatCurrency(review.job.amount)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-4 h-4",
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                                )}
                              />
                            ))}
                            <span className="ml-2 font-medium">{review.rating}/5</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedReview(review)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Review Details</DialogTitle>
                            </DialogHeader>
                            {selectedReview && (
                              <div className="space-y-6">
                                {/* Client and Job Info */}
                                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                                  <Avatar className="w-16 h-16">
                                    <AvatarImage
                                      src={selectedReview.client.avatar || "/placeholder.svg"}
                                      alt={selectedReview.client.name}
                                    />
                                    <AvatarFallback>
                                      {selectedReview.client.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{selectedReview.client.name}</h3>
                                    <p className="text-muted-foreground">{selectedReview.job.service}</p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                      <span>{selectedReview.job.date}</span>
                                      <span>{formatCurrency(selectedReview.job.amount)}</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center gap-1 mb-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={cn(
                                            "w-4 h-4",
                                            i < selectedReview.rating
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-gray-300",
                                          )}
                                        />
                                      ))}
                                    </div>
                                    <p className="text-sm font-medium">{selectedReview.rating}/5</p>
                                  </div>
                                </div>

                                {/* Category Ratings */}
                                <div>
                                  <h4 className="font-semibold mb-3">Category Ratings</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(selectedReview.categories).map(([category, rating]) => (
                                      <div
                                        key={category}
                                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                      >
                                        <span className="capitalize font-medium">{category}</span>
                                        <div className="flex items-center gap-1">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              className={cn(
                                                "w-3 h-3",
                                                i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                                              )}
                                            />
                                          ))}
                                          <span className="ml-1 text-sm font-medium">{rating}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Review Text */}
                                <div>
                                  <h4 className="font-semibold mb-2">Review</h4>
                                  <p className="text-muted-foreground bg-muted/30 p-4 rounded-xl leading-relaxed">
                                    {selectedReview.review}
                                  </p>
                                </div>

                                {/* Response */}
                                {selectedReview.response && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Your Response</h4>
                                    <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-xl">
                                      <p className="text-sm">{selectedReview.response}</p>
                                    </div>
                                  </div>
                                )}

                                {/* Helpful Count */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>{selectedReview.helpful} people found this review helpful</span>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {!review.response && (
                          <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                onClick={() => setSelectedReview(review)}
                                className="bg-primary hover:bg-primary/90"
                              >
                                <Reply className="w-4 h-4 mr-2" />
                                Reply
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Reply to Review</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="p-3 bg-muted/30 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium">{selectedReview?.client.name}</span>
                                    <div className="flex items-center gap-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={cn(
                                            "w-3 h-3",
                                            i < (selectedReview?.rating || 0)
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-gray-300",
                                          )}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-3">{selectedReview?.review}</p>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Your Reply</label>
                                  <Textarea
                                    placeholder="Thank you for your feedback..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    rows={4}
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    Be professional and address any concerns mentioned in the review.
                                  </p>
                                </div>

                                <div className="flex gap-3">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setReplyDialogOpen(false)
                                      setReplyText("")
                                      setSelectedReview(null)
                                    }}
                                    className="flex-1"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => handleReply(selectedReview?.id)}
                                    disabled={isLoading}
                                    className="flex-1"
                                  >
                                    {isLoading ? "Sending..." : "Send Reply"}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="space-y-3">
                      <p className="text-muted-foreground leading-relaxed">{review.review}</p>

                      {/* Category Ratings */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {Object.entries(review.categories).map(([category, rating]) => (
                          <div key={category} className="text-center p-2 bg-muted/20 rounded-lg">
                            <p className="text-xs text-muted-foreground capitalize">{category}</p>
                            <div className="flex justify-center gap-0.5 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-2.5 h-2.5",
                                    i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Response */}
                      {review.response && (
                        <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src="/placeholder-user.jpg" alt="Peter Mwangi" />
                              <AvatarFallback>PM</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">Your Response</span>
                          </div>
                          <p className="text-sm">{review.response}</p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{review.helpful}</span>
                          </div>
                          <span>Job #{review.job.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      <DashboardBottomNav />
    </div>
  )
}
