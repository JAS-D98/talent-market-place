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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import {
  Calendar,
  DollarSign,
  Star,
  MessageSquare,
  CheckCircle,
  Clock,
  Phone,
  MapPin,
  Award,
  Target,
  Lightbulb,
  Download,
  ArrowUpRight,
  Activity,
  Zap,
  Users,
  Timer,
  ThumbsUp,
  Edit,
  Eye,
  X,
  Check,
  AlertCircle,
  TrendingUp,
  Wallet,
  Settings,
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
} from "recharts"
import { cn } from "@/lib/utils"

// Enhanced mock data with more realistic structure
const fundiStats = {
  totalJobs: 156,
  completedJobs: 142,
  pendingJobs: 8,
  cancelledJobs: 6,
  totalEarnings: 125000,
  thisMonthEarnings: 18500,
  availableBalance: 12300,
  rating: 4.8,
  responseTime: "12 min",
  completionRate: 91.0,
  repeatCustomers: 68,
  totalReviews: 156,
  activeJobs: 3,
}

const recentJobs = [
  {
    id: "J001",
    client: "John Doe",
    clientAvatar: "/placeholder-user.jpg",
    service: "Kitchen Plumbing",
    status: "completed",
    amount: 2500,
    date: "2024-01-15",
    time: "10:30 AM",
    location: "Westlands, Nairobi",
    rating: 5,
    urgent: false,
    description: "Fix leaking kitchen sink and replace faucet",
    estimatedDuration: "2-3 hours",
  },
  {
    id: "J002",
    client: "Mary Smith",
    clientAvatar: "/placeholder-user.jpg",
    service: "Bathroom Repair",
    status: "pending",
    amount: 1800,
    date: "2024-01-16",
    time: "2:00 PM",
    location: "Karen, Nairobi",
    rating: null,
    urgent: true,
    description: "Emergency bathroom pipe burst repair",
    estimatedDuration: "1-2 hours",
  },
  {
    id: "J003",
    client: "David Wilson",
    clientAvatar: "/placeholder-user.jpg",
    service: "Pipe Installation",
    status: "confirmed",
    amount: 3200,
    date: "2024-01-17",
    time: "9:00 AM",
    location: "Kilimani, Nairobi",
    rating: null,
    urgent: false,
    description: "Install new water pipes for kitchen renovation",
    estimatedDuration: "4-5 hours",
  },
]

const earningsData = [
  { month: "Jul", earnings: 12000, jobs: 18 },
  { month: "Aug", earnings: 15000, jobs: 22 },
  { month: "Sep", earnings: 18000, jobs: 26 },
  { month: "Oct", earnings: 16000, jobs: 24 },
  { month: "Nov", earnings: 20000, jobs: 28 },
  { month: "Dec", earnings: 22000, jobs: 32 },
  { month: "Jan", earnings: 18500, jobs: 26 },
]

const jobStatusData = [
  { name: "Completed", value: 142, color: "#10B981" },
  { name: "Pending", value: 8, color: "#F59E0B" },
  { name: "Cancelled", value: 6, color: "#EF4444" },
]

const ratingsData = [
  { category: "Speed", rating: 4.9, reviews: 142, improvement: "+0.2" },
  { category: "Quality", rating: 4.8, reviews: 138, improvement: "+0.1" },
  { category: "Communication", rating: 4.7, reviews: 145, improvement: "+0.3" },
  { category: "Professionalism", rating: 4.8, reviews: 140, improvement: "+0.1" },
]

const tips = [
  {
    title: "Optimize Your Response Time",
    description: "Respond to job requests within 10 minutes to increase your booking rate by 40%",
    type: "performance",
    priority: "high",
    actionable: true,
    impact: "High",
  },
  {
    title: "Update Your Profile Photo",
    description: "Profiles with professional photos get 60% more bookings",
    type: "profile",
    priority: "medium",
    actionable: true,
    impact: "Medium",
  },
  {
    title: "Expand Your Service Area",
    description: "Consider adding nearby areas to increase your job opportunities",
    type: "growth",
    priority: "low",
    actionable: false,
    impact: "High",
  },
]

export default function FundiDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [jobDialogOpen, setJobDialogOpen] = useState(false)
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false)
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-3 h-3" />
      case "pending":
        return <Clock className="w-3 h-3" />
      case "confirmed":
        return <Calendar className="w-3 h-3" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const handleJobAction = (jobId, action) => {
    if (action === "accept") {
      toast({
        title: "Job Accepted",
        description: "You have successfully accepted the job request.",
      })
    } else if (action === "decline") {
      toast({
        title: "Job Declined",
        description: "The job request has been declined.",
        variant: "destructive",
      })
    }
  }

  const handleWithdrawal = () => {
    if (!withdrawalAmount || Number.parseFloat(withdrawalAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(withdrawalAmount) > fundiStats.availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "Withdrawal amount exceeds available balance.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Withdrawal Requested",
      description: `Your withdrawal request of ${formatCurrency(Number.parseFloat(withdrawalAmount))} has been submitted.`,
    })
    setWithdrawalDialogOpen(false)
    setWithdrawalAmount("")
  }

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20 xl:pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8 pt-4 lg:pt-8">
        {/* Enhanced Header */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Welcome back, Peter!</h1>
              <Badge className="bg-green-100 text-green-800 w-fit">
                <Award className="w-3 h-3 mr-1" />
                Verified Pro
              </Badge>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              You have {fundiStats.pendingJobs} pending jobs and {fundiStats.repeatCustomers}% repeat customers
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm">
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Export Report</span>
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-lg">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">View Calendar</span>
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="card-premium hover-lift group cursor-pointer overflow-hidden">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Jobs</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{fundiStats.totalJobs}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <ArrowUpRight className="w-3 h-3 text-green-600 flex-shrink-0" />
                    <span className="text-green-600 font-medium truncate">+12 this month</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
              </div>
              <Progress value={(fundiStats.completedJobs / fundiStats.totalJobs) * 100} className="mt-3 h-1" />
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift group cursor-pointer overflow-hidden">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">This Month</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                    {formatCurrency(fundiStats.thisMonthEarnings)}
                  </p>
                  <div className="flex items-center gap-1 text-xs">
                    <ArrowUpRight className="w-3 h-3 text-green-600 flex-shrink-0" />
                    <span className="text-green-600 font-medium truncate">+15% vs last</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
              <Progress value={75} className="mt-3 h-1" />
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift group cursor-pointer overflow-hidden">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Rating</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{fundiStats.rating}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
              </div>
              <Progress value={96} className="mt-3 h-1" />
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift group cursor-pointer overflow-hidden">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Response Time</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{fundiStats.responseTime}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <ThumbsUp className="w-3 h-3 text-green-600 flex-shrink-0" />
                    <span className="text-green-600 font-medium truncate">Excellent</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
              <Progress value={88} className="mt-3 h-1" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Responsive */}
        <Card className="card-premium overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Zap className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Button
                variant="outline"
                className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 sm:gap-3 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:from-primary/10 hover:to-primary/20 transition-all duration-300 group"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <span className="font-medium text-xs sm:text-sm">View Jobs</span>
              </Button>

              <Dialog open={withdrawalDialogOpen} onOpenChange={setWithdrawalDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 sm:gap-3 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <span className="font-medium text-xs sm:text-sm">Withdraw</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Request Withdrawal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-xl">
                      <p className="text-sm text-muted-foreground">Available Balance</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(fundiStats.availableBalance)}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Withdrawal Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setWithdrawalDialogOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleWithdrawal} className="flex-1">
                        Request Withdrawal
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 sm:gap-3 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-xs sm:text-sm">Edit Profile</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="Peter Mwangi" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="+254712345678" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" defaultValue="Professional plumber with 5+ years experience" />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setProfileDialogOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          toast({
                            title: "Profile Updated",
                            description: "Your profile has been updated successfully.",
                          })
                          setProfileDialogOpen(false)
                        }}
                        className="flex-1"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 sm:gap-3 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:from-amber-100 hover:to-amber-200 transition-all duration-300 group"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                </div>
                <span className="font-medium text-xs sm:text-sm">Get Tips</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="jobs" className="text-xs sm:text-sm">
              My Jobs
            </TabsTrigger>
            <TabsTrigger value="earnings" className="text-xs sm:text-sm">
              Earnings
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm">
              Profile
            </TabsTrigger>
            <TabsTrigger value="tips" className="text-xs sm:text-sm">
              Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            {/* Job Status Overview - Responsive */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              <Card className="card-premium hover-lift overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm sm:text-base">Completed</h3>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">{fundiStats.completedJobs}</p>
                  <Progress value={(fundiStats.completedJobs / fundiStats.totalJobs) * 100} className="mb-2" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {fundiStats.completionRate}% completion rate
                  </p>
                </CardContent>
              </Card>

              <Card className="card-premium hover-lift overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm sm:text-base">Pending</h3>
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-2">{fundiStats.pendingJobs}</p>
                  <Progress value={(fundiStats.pendingJobs / fundiStats.totalJobs) * 100} className="mb-2" />
                  <p className="text-xs sm:text-sm text-muted-foreground">Awaiting response</p>
                </CardContent>
              </Card>

              <Card className="card-premium hover-lift overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm sm:text-base">Cancelled</h3>
                    <Activity className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">{fundiStats.cancelledJobs}</p>
                  <Progress value={(fundiStats.cancelledJobs / fundiStats.totalJobs) * 100} className="mb-2" />
                  <p className="text-xs sm:text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Jobs - Responsive */}
            <Card className="card-premium overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Recent Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="font-medium text-sm sm:text-base truncate">{job.service}</h4>
                          <Badge className={cn("text-xs", getStatusColor(job.status))}>
                            {getStatusIcon(job.status)}
                            <span className="ml-1 capitalize">{job.status}</span>
                          </Badge>
                          {job.urgent && (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{job.client}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{job.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 flex-shrink-0" />
                            <span className="font-medium">{formatCurrency(job.amount)}</span>
                          </div>
                        </div>
                        {job.rating && (
                          <div className="flex items-center gap-1 mt-2">
                            {[...Array(job.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-background/50">
                              <Eye className="w-4 h-4 mr-2" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Job Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage src={job.clientAvatar || "/placeholder.svg"} alt={job.client} />
                                  <AvatarFallback>
                                    {job.client
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{job.client}</p>
                                  <p className="text-sm text-muted-foreground">{job.location}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="font-medium">{job.service}</p>
                                <p className="text-sm text-muted-foreground">{job.description}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Date & Time</p>
                                  <p className="font-medium">
                                    {job.date} at {job.time}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Duration</p>
                                  <p className="font-medium">{job.estimatedDuration}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Amount</p>
                                  <p className="font-medium text-primary">{formatCurrency(job.amount)}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Status</p>
                                  <Badge className={cn("text-xs", getStatusColor(job.status))}>{job.status}</Badge>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" className="bg-background/50">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Chat</span>
                        </Button>
                        {job.status === "pending" && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleJobAction(job.id, "decline")}
                              className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleJobAction(job.id, "accept")}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            {/* Earnings Overview - Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-premium overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Total Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                    {formatCurrency(fundiStats.totalEarnings)}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">All time earnings</p>
                  <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-muted-foreground">Available Balance</span>
                      <span className="font-bold text-lg">{formatCurrency(fundiStats.availableBalance)}</span>
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 shadow-lg"
                      onClick={() => setWithdrawalDialogOpen(true)}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Request Withdrawal
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-premium overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Earnings Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={earningsData}>
                        <defs>
                          <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
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
                          dataKey="earnings"
                          stroke="#005B4F"
                          fill="url(#colorEarnings)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job Status Pie Chart */}
            <Card className="card-premium overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Job Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={jobStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {jobStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {jobStatusData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Overview - Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="card-premium overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mb-4 ring-4 ring-primary/20">
                      <AvatarImage src="/placeholder-user.jpg" alt="Peter Mwangi" />
                      <AvatarFallback>PM</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg sm:text-xl">Peter Mwangi</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">Professional Plumber</p>
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      <Award className="w-3 h-3 mr-1" />
                      Verified Pro
                    </Badge>
                    <Button className="mt-4 w-full" size="sm" onClick={() => setProfileDialogOpen(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-premium lg:col-span-2 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                      <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm sm:text-base truncate">+254712345678</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm sm:text-base truncate">Nairobi, Kenya</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                      <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base truncate">4.8 Rating (156 reviews)</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                      <Target className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm sm:text-base truncate">5km Service Radius</span>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4 bg-primary hover:bg-primary/90"
                    onClick={() => setProfileDialogOpen(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Ratings Breakdown - Responsive */}
            <Card className="card-premium overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Client Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {ratingsData.map((item, index) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <h4 className="font-medium mb-2 text-sm sm:text-base">{item.category}</h4>
                      <p className="text-2xl sm:text-3xl font-bold text-primary mb-1">{item.rating}</p>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3 h-3",
                              i < Math.floor(item.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.reviews} reviews</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600">{item.improvement}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <Card className="card-premium overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Personalized Tips & Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tips.map((tip, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl hover:from-muted/50 hover:to-muted/30 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
                        <h4 className="font-medium text-base sm:text-lg">{tip.title}</h4>
                        <div className="flex gap-2 flex-shrink-0">
                          <Badge className={cn("text-xs", getPriorityColor(tip.priority))}>{tip.priority}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {tip.impact} Impact
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{tip.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <Badge variant="outline" className="text-xs w-fit">
                          {tip.type}
                        </Badge>
                        {tip.actionable && (
                          <Button size="sm" variant="outline">
                            Take Action
                          </Button>
                        )}
                      </div>
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
