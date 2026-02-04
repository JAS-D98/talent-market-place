"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import {
  Calendar,
  Star,
  MessageSquare,
  Download,
  RefreshCw,
  Phone,
  HelpCircle,
  FileText,
  CreditCard,
  Heart,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  Activity,
  Zap,
  Users,
  Bell,
  Shield,
  Smartphone,
  Mail,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Enhanced mock data
const userStats = {
  totalBookings: 12,
  completedBookings: 10,
  ongoingBookings: 1,
  cancelledBookings: 1,
  totalSpent: 28500,
  favoriteFundis: 3,
  avgRating: 4.6,
  savedAmount: 3200,
}

const recentBookings = [
  {
    id: "B001",
    fundi: "Peter Mwangi",
    service: "Kitchen Plumbing",
    status: "completed",
    amount: 2500,
    date: "2024-01-15",
    location: "Westlands, Nairobi",
    rating: 5,
    fundiAvatar: "/placeholder-user.jpg",
    urgent: false,
  },
  {
    id: "B002",
    fundi: "Grace Wanjiku",
    service: "House Cleaning",
    status: "ongoing",
    amount: 1800,
    date: "2024-01-16",
    location: "Karen, Nairobi",
    rating: null,
    fundiAvatar: "/placeholder-user.jpg",
    urgent: true,
  },
  {
    id: "B003",
    fundi: "James Kiprotich",
    service: "Electrical Repair",
    status: "completed",
    amount: 3200,
    date: "2024-01-10",
    location: "Kilimani, Nairobi",
    rating: 4,
    fundiAvatar: "/placeholder-user.jpg",
    urgent: false,
  },
]

const transactions = [
  {
    id: "T001",
    type: "payment",
    description: "Kitchen Plumbing - Peter Mwangi",
    amount: -2500,
    date: "2024-01-15",
    status: "completed",
    method: "M-Pesa",
  },
  {
    id: "T002",
    type: "refund",
    description: "Cancelled Booking Refund",
    amount: 1200,
    date: "2024-01-12",
    status: "completed",
    method: "M-Pesa",
  },
  {
    id: "T003",
    type: "payment",
    description: "Electrical Repair - James Kiprotich",
    amount: -3200,
    date: "2024-01-10",
    status: "completed",
    method: "M-Pesa",
  },
]

const favoriteFundis = [
  {
    id: "F001",
    name: "Peter Mwangi",
    category: "Plumbing",
    rating: 4.8,
    completedJobs: 156,
    avatar: "/placeholder-user.jpg",
    responseTime: "8 min",
    lastBooked: "2 weeks ago",
  },
  {
    id: "F002",
    name: "Grace Wanjiku",
    category: "Cleaning",
    rating: 4.9,
    completedJobs: 203,
    avatar: "/placeholder-user.jpg",
    responseTime: "5 min",
    lastBooked: "1 month ago",
  },
  {
    id: "F003",
    name: "James Kiprotich",
    category: "Electrical",
    rating: 4.6,
    completedJobs: 98,
    avatar: "/placeholder-user.jpg",
    responseTime: "12 min",
    lastBooked: "3 weeks ago",
  },
]

const quickServices = [
  { name: "Plumbing", icon: "🔧", bookings: 4 },
  { name: "Cleaning", icon: "🧹", bookings: 3 },
  { name: "Electrical", icon: "⚡", bookings: 2 },
  { name: "Carpentry", icon: "🔨", bookings: 1 },
]

export default function UserDashboard() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(true)
  const [whatsappEnabled, setWhatsappEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(Math.abs(amount))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "ongoing":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "ongoing":
        return <Activity className="w-4 h-4" />
      case "cancelled":
        return <Clock className="w-4 h-4" />
      default:
        return null
    }
  }

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20 xl:pb-8">
      <div className="container-mobile space-y-6 lg:space-y-8 pt-4 lg:pt-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-bold gradient-text">Welcome back, John!</h1>
              <Badge className="bg-blue-100 text-blue-800">
                <Users className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>
            <p className="text-muted-foreground">
              You have {userStats.ongoingBookings} ongoing booking and saved {formatCurrency(userStats.savedAmount)}{" "}
              this year
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm">
              <Search className="w-4 h-4 mr-2" />
              Browse Services
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Book Service
            </Button>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="card-premium hover-lift group cursor-pointer">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">{userStats.totalBookings}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                    <span className="text-green-600 font-medium">+2 this month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
              <Progress value={(userStats.completedBookings / userStats.totalBookings) * 100} className="mt-3 h-1" />
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift group cursor-pointer">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Ongoing</p>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">{userStats.ongoingBookings}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <Activity className="w-3 h-3 text-blue-600" />
                    <span className="text-blue-600 font-medium">Active now</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <Progress value={userStats.ongoingBookings > 0 ? 100 : 0} className="mt-3 h-1" />
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift group cursor-pointer">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">
                    {formatCurrency(userStats.totalSpent)}
                  </p>
                  <div className="flex items-center gap-1 text-xs">
                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                    <span className="text-green-600 font-medium">This year</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <Progress value={65} className="mt-3 h-1" />
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift group cursor-pointer">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Favorite Fundis</p>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">{userStats.favoriteFundis}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <Heart className="w-3 h-3 text-red-600" />
                    <span className="text-red-600 font-medium">Saved</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <Progress value={75} className="mt-3 h-1" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Services */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Quick Book Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickServices.map((service, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-3 bg-gradient-to-br from-muted/20 to-muted/5 hover:from-muted/40 hover:to-muted/20 transition-all duration-300 group"
                >
                  <div className="text-2xl group-hover:scale-110 transition-transform">{service.icon}</div>
                  <div className="text-center">
                    <span className="font-medium text-sm">{service.name}</span>
                    <p className="text-xs text-muted-foreground mt-1">{service.bookings} bookings</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            {/* Booking Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-premium hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Completed</h3>
                    <Badge className="bg-green-100 text-green-800">{userStats.completedBookings}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Successfully completed services</p>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">Avg rating: {userStats.avgRating}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-premium hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Ongoing</h3>
                    <Badge className="bg-blue-100 text-blue-800">{userStats.ongoingBookings}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Currently active bookings</p>
                  <Button size="sm" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Fundi
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-premium hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Cancelled</h3>
                    <Badge className="bg-red-100 text-red-800">{userStats.cancelledBookings}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Cancelled bookings</p>
                  <p className="text-xs text-muted-foreground">Saved: {formatCurrency(userStats.savedAmount)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card className="card-premium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Bookings</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                          <AvatarImage src={booking.fundiAvatar || "/placeholder.svg"} alt={booking.fundi} />
                          <AvatarFallback>
                            {booking.fundi
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{booking.service}</h4>
                            <Badge className={cn("text-xs", getStatusColor(booking.status))}>
                              {getStatusIcon(booking.status)}
                              <span className="ml-1 capitalize">{booking.status}</span>
                            </Badge>
                            {booking.urgent && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{booking.fundi}</span>
                            <span>{booking.location}</span>
                            <span>{booking.date}</span>
                            <span className="font-medium">{formatCurrency(booking.amount)}</span>
                          </div>
                          {booking.rating && (
                            <div className="flex items-center gap-1 mt-2">
                              {[...Array(booking.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="bg-background/50">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                        <Button variant="outline" size="sm" className="bg-background/50">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Rebook
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                      <span className="text-muted-foreground">Total Spent</span>
                      <span className="font-bold text-lg">{formatCurrency(userStats.totalSpent)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                      <span className="text-muted-foreground">This Month</span>
                      <span className="font-medium">{formatCurrency(4300)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                      <span className="text-muted-foreground">Average per Booking</span>
                      <span className="font-medium">
                        {formatCurrency(userStats.totalSpent / userStats.totalBookings)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-100 rounded-xl">
                      <span className="text-green-800 font-medium">Money Saved</span>
                      <span className="font-bold text-green-800">{formatCurrency(userStats.savedAmount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-premium">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <span className="font-medium">M-Pesa</span>
                          <p className="text-sm text-muted-foreground">+254712345678</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Primary</Badge>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transaction History */}
            <Card className="card-premium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Transaction History</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            transaction.type === "payment" ? "bg-red-100" : "bg-green-100",
                          )}
                        >
                          {transaction.type === "payment" ? (
                            <ArrowDownRight className="w-5 h-5 text-red-600" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{transaction.description}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{transaction.date}</span>
                            <span>{transaction.method}</span>
                            <Badge variant="outline" className="text-xs">
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "font-bold text-lg",
                            transaction.amount > 0 ? "text-green-600" : "text-foreground",
                          )}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Button variant="ghost" size="sm" className="mt-1">
                          <FileText className="w-4 h-4 mr-2" />
                          Receipt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle>Favorite Fundis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteFundis.map((fundi) => (
                    <Card key={fundi.id} className="card-premium hover-lift group">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="w-14 h-14 ring-2 ring-primary/20">
                            <AvatarImage src={fundi.avatar || "/placeholder.svg"} alt={fundi.name} />
                            <AvatarFallback>
                              {fundi.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold">{fundi.name}</h3>
                            <p className="text-sm text-muted-foreground">{fundi.category}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              {fundi.responseTime}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                            <Heart className="w-4 h-4 fill-current" />
                          </Button>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Rating</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{fundi.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Jobs Completed</span>
                            <span className="font-medium">{fundi.completedJobs}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Last Booked</span>
                            <span className="font-medium">{fundi.lastBooked}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                            Book Now
                          </Button>
                          <Button variant="outline" size="sm" className="bg-background/50">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Profile Settings */}
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="John Doe" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+254712345678" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="location">Preferred Location</Label>
                    <Input id="location" defaultValue="Nairobi, Kenya" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="mt-1" />
                  </div>
                </div>
                <Button className="w-full md:w-auto bg-primary hover:bg-primary/90">
                  <Users className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive booking updates and reminders</p>
                    </div>
                  </div>
                  <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-muted-foreground">Get SMS updates for important events</p>
                    </div>
                  </div>
                  <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">WhatsApp Updates</h4>
                      <p className="text-sm text-muted-foreground">Receive updates via WhatsApp</p>
                    </div>
                  </div>
                  <Switch checked={whatsappEnabled} onCheckedChange={setWhatsappEnabled} />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Shield className="w-4 h-4 mr-3" />
                  Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="w-4 h-4 mr-3" />
                  Download My Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Help & Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <HelpCircle className="w-4 h-4 mr-3" />
                  Frequently Asked Questions
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageSquare className="w-4 h-4 mr-3" />
                  Live Chat Support
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Phone className="w-4 h-4 mr-3" />
                  Call Support
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Mail className="w-4 h-4 mr-3" />
                  Email Support
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <DashboardBottomNav />
    </div>
  )
}
