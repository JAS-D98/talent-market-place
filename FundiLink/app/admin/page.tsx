"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  UserPlus,
  MessageSquare,
  Send,
  Eye,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle,
  AlertTriangle,
  Bell,
  Zap,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Enhanced mock data with more realistic values
const dashboardStats = {
  totalFundis: 1247,
  activeJobs: 89,
  revenue: 2450000,
  dailyBookings: 156,
  growthRate: 12.5,
  completionRate: 94.2,
  avgRating: 4.7,
  responseTime: "8 min",
}

const bookingTrends = [
  { month: "Jan", bookings: 120, revenue: 180000, users: 1200 },
  { month: "Feb", bookings: 150, revenue: 225000, users: 1450 },
  { month: "Mar", bookings: 180, revenue: 270000, users: 1680 },
  { month: "Apr", bookings: 220, revenue: 330000, users: 1920 },
  { month: "May", bookings: 280, revenue: 420000, users: 2180 },
  { month: "Jun", bookings: 320, revenue: 480000, users: 2450 },
]

const categoryData = [
  { name: "Plumbing", value: 35, color: "#005B4F", bookings: 280 },
  { name: "Electrical", value: 28, color: "#FFB100", bookings: 224 },
  { name: "Carpentry", value: 20, color: "#E63946", bookings: 160 },
  { name: "Cleaning", value: 12, color: "#457B9D", bookings: 96 },
  { name: "Others", value: 5, color: "#A8DADC", bookings: 40 },
]

const recentActivities = [
  {
    id: 1,
    type: "booking",
    message: "New booking from John Doe",
    time: "2 min ago",
    icon: Calendar,
    color: "text-blue-600",
  },
  {
    id: 2,
    type: "fundi",
    message: "Peter Mwangi completed a job",
    time: "5 min ago",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 3,
    type: "payment",
    message: "Payment of KES 2,500 received",
    time: "10 min ago",
    icon: DollarSign,
    color: "text-emerald-600",
  },
  {
    id: 4,
    type: "alert",
    message: "System maintenance scheduled",
    time: "1 hour ago",
    icon: AlertTriangle,
    color: "text-amber-600",
  },
]

const topFundis = [
  {
    id: "F001",
    name: "Peter Mwangi",
    category: "Plumbing",
    rating: 4.9,
    jobs: 156,
    earnings: 125000,
    avatar: "/placeholder-user.jpg",
    trend: "up",
  },
  {
    id: "F002",
    name: "Grace Wanjiku",
    category: "Cleaning",
    rating: 4.8,
    jobs: 203,
    earnings: 89000,
    avatar: "/placeholder-user.jpg",
    trend: "up",
  },
  {
    id: "F003",
    name: "James Kiprotich",
    category: "Electrical",
    rating: 4.7,
    jobs: 98,
    earnings: 67000,
    avatar: "/placeholder-user.jpg",
    trend: "down",
  },
]

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState("bookings")

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
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
              <h1 className="text-2xl lg:text-3xl font-bold gradient-text">Admin Dashboard</h1>
              <Badge className="bg-green-100 text-green-800 animate-pulse">
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your platform today.</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
              <Badge className="ml-2 bg-destructive text-destructive-foreground">3</Badge>
            </Button>
            <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <Button
              asChild
              size="sm"
              className="bg-primary hover:bg-primary/90 shadow-lg"
            >
              <Link href="/admin/fundis">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Fundi
              </Link>
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="card-premium hover-lift group cursor-pointer transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Fundis</p>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">
                    {formatNumber(dashboardStats.totalFundis)}
                  </p>
                  <div className="flex items-center gap-1 text-xs">
                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                    <span className="text-green-600 font-medium">+{dashboardStats.growthRate}%</span>
                    <span className="text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <Progress value={75} className="mt-3 h-1" />
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift group cursor-pointer transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">{dashboardStats.activeJobs}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                    <span className="text-green-600 font-medium">+8%</span>
                    <span className="text-muted-foreground">vs yesterday</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
              </div>
              <Progress value={dashboardStats.completionRate} className="mt-3 h-1" />
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift group cursor-pointer transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">
                    {formatCurrency(dashboardStats.revenue)}
                  </p>
                  <div className="flex items-center gap-1 text-xs">
                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                    <span className="text-green-600 font-medium">+15%</span>
                    <span className="text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <Progress value={85} className="mt-3 h-1" />
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift group cursor-pointer transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Daily Bookings</p>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">{dashboardStats.dailyBookings}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                    <span className="text-green-600 font-medium">+5%</span>
                    <span className="text-muted-foreground">vs yesterday</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <Progress value={60} className="mt-3 h-1" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions with Enhanced Design */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-3 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:from-primary/10 hover:to-primary/20 transition-all duration-300 group"
                asChild
              >
                <Link href="/admin/fundis">
                  <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserPlus className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <span className="font-medium">Add New Fundi</span>
                    <p className="text-xs text-muted-foreground mt-1">Onboard service providers</p>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-3 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:from-accent/10 hover:to-accent/20 transition-all duration-300 group"
                asChild
              >
                <Link href="/admin/issues">
                  <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-center">
                    <span className="font-medium">Resolve Issues</span>
                    <p className="text-xs text-muted-foreground mt-1">Handle complaints</p>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-3 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-300 group sm:col-span-2 lg:col-span-1"
                asChild
              >
                <Link href="/admin/broadcast">
                  <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Send className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-center">
                    <span className="font-medium">Send Broadcast</span>
                    <p className="text-xs text-muted-foreground mt-1">Notify all users</p>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Charts Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced Booking Trends */}
              <Card className="card-premium">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>Booking Trends</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedPeriod === "week" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPeriod("week")}
                      >
                        Week
                      </Button>
                      <Button
                        variant={selectedPeriod === "month" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPeriod("month")}
                      >
                        Month
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={bookingTrends}>
                      <defs>
                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#005B4F" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#005B4F" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="bookings"
                        stroke="#005B4F"
                        fill="url(#colorBookings)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Service Categories with Enhanced Design */}
              <Card className="card-premium">
                <CardHeader className="pb-4">
                  <CardTitle>Service Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3 mt-4">
                    {categoryData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold">{item.value}%</span>
                          <p className="text-xs text-muted-foreground">{item.bookings} bookings</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bookingTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Bar dataKey="revenue" fill="#005B4F" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="card-premium">
                <CardHeader>
                  <CardTitle>Top Performing Fundis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topFundis.map((fundi, index) => (
                      <div
                        key={fundi.id}
                        className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={fundi.avatar || "/placeholder.svg"} alt={fundi.name} />
                              <AvatarFallback>
                                {fundi.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-primary text-primary-foreground flex items-center justify-center">
                              {index + 1}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{fundi.name}</h4>
                            <p className="text-xs text-muted-foreground">{fundi.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold">{formatCurrency(fundi.earnings)}</span>
                            {fundi.trend === "up" ? (
                              <ArrowUpRight className="w-3 h-3 text-green-600" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3 text-red-600" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{fundi.jobs} jobs</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/30 transition-colors"
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center",
                          activity.type === "booking" && "bg-blue-100",
                          activity.type === "fundi" && "bg-green-100",
                          activity.type === "payment" && "bg-emerald-100",
                          activity.type === "alert" && "bg-amber-100",
                        )}
                      >
                        <activity.icon className={cn("w-5 h-5", activity.color)} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <DashboardBottomNav />
    </div>
  )
}
