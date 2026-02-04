"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav"
import { toast } from "@/hooks/use-toast"
import {
  DollarSign,
  TrendingUp,
  Download,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { cn } from "@/lib/utils"

// Mock data for earnings
const earningsData = [
  { month: "Jul", earnings: 12000, jobs: 18, hours: 72 },
  { month: "Aug", earnings: 15000, jobs: 22, hours: 88 },
  { month: "Sep", earnings: 18000, jobs: 26, hours: 104 },
  { month: "Oct", earnings: 16000, jobs: 24, hours: 96 },
  { month: "Nov", earnings: 20000, jobs: 28, hours: 112 },
  { month: "Dec", earnings: 22000, jobs: 32, hours: 128 },
  { month: "Jan", earnings: 18500, jobs: 26, hours: 104 },
]

const weeklyData = [
  { day: "Mon", earnings: 2800, jobs: 4 },
  { day: "Tue", earnings: 3200, jobs: 5 },
  { day: "Wed", earnings: 2400, jobs: 3 },
  { day: "Thu", earnings: 3600, jobs: 6 },
  { day: "Fri", earnings: 4200, jobs: 7 },
  { day: "Sat", earnings: 1800, jobs: 2 },
  { day: "Sun", earnings: 500, jobs: 1 },
]

const categoryData = [
  { name: "Plumbing", value: 45, earnings: 8100, color: "#005B4F" },
  { name: "Electrical", value: 30, earnings: 5400, color: "#10B981" },
  { name: "Carpentry", value: 15, earnings: 2700, color: "#F59E0B" },
  { name: "Painting", value: 10, earnings: 1800, color: "#EF4444" },
]

const transactionHistory = [
  {
    id: "T001",
    type: "earning",
    description: "Kitchen Plumbing - John Doe",
    amount: 2500,
    date: "2024-01-15",
    status: "completed",
    jobId: "J001",
  },
  {
    id: "T002",
    type: "withdrawal",
    description: "Bank Transfer to KCB Account",
    amount: -5000,
    date: "2024-01-14",
    status: "completed",
    reference: "WD001",
  },
  {
    id: "T003",
    type: "earning",
    description: "Bathroom Repair - Mary Smith",
    amount: 1800,
    date: "2024-01-13",
    status: "completed",
    jobId: "J002",
  },
  {
    id: "T004",
    type: "earning",
    description: "Pipe Installation - David Wilson",
    amount: 3200,
    date: "2024-01-12",
    status: "pending",
    jobId: "J003",
  },
  {
    id: "T005",
    type: "fee",
    description: "Platform Service Fee",
    amount: -150,
    date: "2024-01-12",
    status: "completed",
    reference: "FEE001",
  },
]

const withdrawalMethods = [
  { id: "mpesa", name: "M-Pesa", icon: "📱", fee: "Free", processingTime: "Instant" },
  { id: "bank", name: "Bank Transfer", icon: "🏦", fee: "KES 50", processingTime: "1-2 business days" },
  { id: "equity", name: "Equity Bank", icon: "🏛️", fee: "Free", processingTime: "Instant" },
]

export default function FundiEarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false)
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [withdrawalMethod, setWithdrawalMethod] = useState("")
  const [accountDetails, setAccountDetails] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const stats = {
    totalEarnings: 125000,
    thisMonth: 18500,
    availableBalance: 12300,
    pendingPayments: 3200,
    totalJobs: 156,
    averagePerJob: 801,
    thisWeekEarnings: 18500,
    lastWeekEarnings: 16200,
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(Math.abs(amount))
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case "earning":
        return <ArrowUpRight className="w-4 h-4 text-green-600" />
      case "withdrawal":
        return <ArrowDownRight className="w-4 h-4 text-blue-600" />
      case "fee":
        return <ArrowDownRight className="w-4 h-4 text-red-600" />
      default:
        return <DollarSign className="w-4 h-4" />
    }
  }

  const getTransactionColor = (type, amount) => {
    if (amount > 0) return "text-green-600"
    if (type === "withdrawal") return "text-blue-600"
    return "text-red-600"
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

    if (Number.parseFloat(withdrawalAmount) > stats.availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "Withdrawal amount exceeds available balance.",
        variant: "destructive",
      })
      return
    }

    if (!withdrawalMethod) {
      toast({
        title: "Select Payment Method",
        description: "Please select a withdrawal method.",
        variant: "destructive",
      })
      return
    }

    if (!accountDetails) {
      toast({
        title: "Account Details Required",
        description: "Please provide your account details.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Withdrawal Requested",
        description: `Your withdrawal request of ${formatCurrency(Number.parseFloat(withdrawalAmount))} has been submitted.`,
      })
      setWithdrawalDialogOpen(false)
      setWithdrawalAmount("")
      setWithdrawalMethod("")
      setAccountDetails("")
      setIsLoading(false)
    }, 2000)
  }

  const weeklyGrowth = (((stats.thisWeekEarnings - stats.lastWeekEarnings) / stats.lastWeekEarnings) * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20 xl:pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8 pt-4 lg:pt-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Earnings</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Track your income and manage withdrawals</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Dialog open={withdrawalDialogOpen} onOpenChange={setWithdrawalDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Wallet className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Withdraw</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Request Withdrawal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(stats.availableBalance)}</p>
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

                  <div className="space-y-2">
                    <Label>Withdrawal Method</Label>
                    <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {withdrawalMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{method.icon}</span>
                              <div>
                                <p className="font-medium">{method.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {method.fee} • {method.processingTime}
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account">Account Details</Label>
                    <Input
                      id="account"
                      placeholder={
                        withdrawalMethod === "mpesa"
                          ? "M-Pesa number (e.g., 254712345678)"
                          : withdrawalMethod === "bank"
                            ? "Account number"
                            : withdrawalMethod === "equity"
                              ? "Account number"
                              : "Account details"
                      }
                      value={accountDetails}
                      onChange={(e) => setAccountDetails(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setWithdrawalDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleWithdrawal} disabled={isLoading} className="flex-1">
                      {isLoading ? "Processing..." : "Request Withdrawal"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="card-premium hover-lift">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Earnings</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    {formatCurrency(stats.totalEarnings)}
                  </p>
                  <p className="text-xs text-muted-foreground">All time</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Available Balance</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                    {formatCurrency(stats.availableBalance)}
                  </p>
                  <p className="text-xs text-green-600">Ready to withdraw</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    {formatCurrency(stats.thisMonth)}
                  </p>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-green-600">+{weeklyGrowth}%</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium hover-lift">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pending Payments</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600">
                    {formatCurrency(stats.pendingPayments)}
                  </p>
                  <p className="text-xs text-yellow-600">3 jobs pending</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs sm:text-sm">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="withdrawals" className="text-xs sm:text-sm">
              Withdrawals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-premium">
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

              <Card className="card-premium">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Weekly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" stroke="#888" fontSize={12} />
                        <YAxis stroke="#888" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Bar dataKey="earnings" fill="#005B4F" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="card-premium">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{stats.totalJobs}</p>
                  <p className="text-sm text-muted-foreground">Total Jobs Completed</p>
                </CardContent>
              </Card>
              <Card className="card-premium">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{formatCurrency(stats.averagePerJob)}</p>
                  <p className="text-sm text-muted-foreground">Average per Job</p>
                </CardContent>
              </Card>
              <Card className="card-premium">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">4.8</p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-premium">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Earnings by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
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
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {categoryData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{entry.name}</p>
                          <p className="text-xs text-muted-foreground">{formatCurrency(entry.earnings)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-premium">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                    <span className="text-sm font-medium">Jobs This Month</span>
                    <span className="text-lg font-bold text-primary">26</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                    <span className="text-sm font-medium">Hours Worked</span>
                    <span className="text-lg font-bold text-primary">104</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                    <span className="text-sm font-medium">Hourly Rate</span>
                    <span className="text-lg font-bold text-primary">KES 178</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                    <span className="text-sm font-medium">Completion Rate</span>
                    <span className="text-lg font-bold text-green-600">91%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactionHistory.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{transaction.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{transaction.date}</span>
                            <Badge
                              className={cn(
                                "text-xs",
                                transaction.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800",
                              )}
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn("font-semibold", getTransactionColor(transaction.type, transaction.amount))}>
                          {transaction.amount > 0 ? "+" : ""}
                          {formatCurrency(transaction.amount)}
                        </p>
                        {transaction.jobId && <p className="text-xs text-muted-foreground">Job #{transaction.jobId}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Withdrawal Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {withdrawalMethods.map((method) => (
                    <div key={method.id} className="p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                      <div className="text-center">
                        <div className="text-3xl mb-2">{method.icon}</div>
                        <h3 className="font-semibold mb-1">{method.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">Fee: {method.fee}</p>
                        <p className="text-xs text-muted-foreground">{method.processingTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Recent Withdrawals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactionHistory
                    .filter((t) => t.type === "withdrawal")
                    .map((withdrawal) => (
                      <div key={withdrawal.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <ArrowDownRight className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{withdrawal.description}</p>
                            <p className="text-xs text-muted-foreground">{withdrawal.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600">{formatCurrency(withdrawal.amount)}</p>
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
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
