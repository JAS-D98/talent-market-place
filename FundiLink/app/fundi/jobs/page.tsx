"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav"
import { toast } from "@/hooks/use-toast"
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Star,
  MessageSquare,
  Phone,
  CheckCircle,
  X,
  Check,
  AlertCircle,
  Users,
  Search,
  Eye,
  Timer,
  Navigation,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for jobs
const jobsData = [
  {
    id: "J001",
    client: {
      name: "John Doe",
      avatar: "/placeholder-user.jpg",
      phone: "+254712345678",
      rating: 4.8,
    },
    service: "Kitchen Plumbing",
    description:
      "Fix leaking kitchen sink and replace faucet. The sink has been leaking for 3 days and needs urgent attention.",
    status: "pending",
    amount: 2500,
    date: "2024-01-16",
    time: "10:30 AM",
    location: "Westlands, Nairobi",
    coordinates: { lat: -1.2634, lng: 36.8155 },
    urgent: false,
    estimatedDuration: "2-3 hours",
    category: "Plumbing",
    createdAt: "2024-01-15T08:30:00Z",
    requirements: ["Basic plumbing tools", "Replacement faucet", "Pipe sealant"],
  },
  {
    id: "J002",
    client: {
      name: "Mary Smith",
      avatar: "/placeholder-user.jpg",
      phone: "+254723456789",
      rating: 4.9,
    },
    service: "Bathroom Repair",
    description: "Emergency bathroom pipe burst repair. Water is flooding the bathroom floor.",
    status: "confirmed",
    amount: 1800,
    date: "2024-01-16",
    time: "2:00 PM",
    location: "Karen, Nairobi",
    coordinates: { lat: -1.3197, lng: 36.6859 },
    urgent: true,
    estimatedDuration: "1-2 hours",
    category: "Plumbing",
    createdAt: "2024-01-16T06:15:00Z",
    requirements: ["Emergency plumbing kit", "Pipe replacement parts"],
  },
  {
    id: "J003",
    client: {
      name: "David Wilson",
      avatar: "/placeholder-user.jpg",
      phone: "+254734567890",
      rating: 4.7,
    },
    service: "Pipe Installation",
    description: "Install new water pipes for kitchen renovation project. Complete kitchen plumbing setup needed.",
    status: "in-progress",
    amount: 3200,
    date: "2024-01-17",
    time: "9:00 AM",
    location: "Kilimani, Nairobi",
    coordinates: { lat: -1.2921, lng: 36.7872 },
    urgent: false,
    estimatedDuration: "4-5 hours",
    category: "Plumbing",
    createdAt: "2024-01-14T14:20:00Z",
    requirements: ["Complete plumbing toolkit", "New pipes and fittings", "Installation materials"],
  },
  {
    id: "J004",
    client: {
      name: "Sarah Johnson",
      avatar: "/placeholder-user.jpg",
      phone: "+254745678901",
      rating: 5.0,
    },
    service: "Drain Cleaning",
    description: "Kitchen drain is completely blocked and needs professional cleaning.",
    status: "completed",
    amount: 1200,
    date: "2024-01-14",
    time: "11:00 AM",
    location: "Parklands, Nairobi",
    coordinates: { lat: -1.263, lng: 36.8583 },
    urgent: false,
    estimatedDuration: "1 hour",
    category: "Plumbing",
    createdAt: "2024-01-13T09:45:00Z",
    requirements: ["Drain cleaning equipment", "Chemical cleaners"],
    completedAt: "2024-01-14T12:30:00Z",
    rating: 5,
    review: "Excellent work! Very professional and quick service.",
  },
]

export default function FundiJobsPage() {
  const [jobs, setJobs] = useState(jobsData)
  const [selectedJob, setSelectedJob] = useState(null)
  const [jobDialogOpen, setJobDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
      case "in-progress":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
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
      case "in-progress":
        return <Timer className="w-3 h-3" />
      default:
        return null
    }
  }

  const handleJobAction = (jobId, action) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id === jobId) {
          let newStatus = job.status
          if (action === "accept") {
            newStatus = "confirmed"
          } else if (action === "decline") {
            newStatus = "cancelled"
          } else if (action === "start") {
            newStatus = "in-progress"
          } else if (action === "complete") {
            newStatus = "completed"
          }
          return { ...job, status: newStatus }
        }
        return job
      }),
    )

    const actionMessages = {
      accept: "Job accepted successfully!",
      decline: "Job declined.",
      start: "Job started. Good luck!",
      complete: "Job marked as completed!",
    }

    toast({
      title: actionMessages[action] || "Action completed",
      description: action === "decline" ? "The job has been declined." : "Status updated successfully.",
      variant: action === "decline" ? "destructive" : "default",
    })
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = filterStatus === "all" || job.status === filterStatus
    const matchesSearch =
      job.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const jobStats = {
    total: jobs.length,
    pending: jobs.filter((j) => j.status === "pending").length,
    confirmed: jobs.filter((j) => j.status === "confirmed").length,
    inProgress: jobs.filter((j) => j.status === "in-progress").length,
    completed: jobs.filter((j) => j.status === "completed").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20 xl:pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8 pt-4 lg:pt-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">My Jobs</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your job requests and track progress</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Calendar View</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{jobStats.total}</p>
                <p className="text-xs text-muted-foreground">Total Jobs</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{jobStats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{jobStats.confirmed}</p>
                <p className="text-xs text-muted-foreground">Confirmed</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{jobStats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{jobStats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="card-premium">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs, clients, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={filterStatus === "confirmed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("confirmed")}
                >
                  Confirmed
                </Button>
                <Button
                  variant={filterStatus === "in-progress" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("in-progress")}
                >
                  Active
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <Card className="card-premium">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground text-sm">
                  {searchQuery || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "You don't have any jobs yet. New job requests will appear here."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="card-premium hover-lift">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 className="font-semibold text-lg truncate">{job.service}</h3>
                        <Badge className={cn("text-xs", getStatusColor(job.status))}>
                          {getStatusIcon(job.status)}
                          <span className="ml-1 capitalize">{job.status.replace("-", " ")}</span>
                        </Badge>
                        {job.urgent && (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{job.client.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            {job.date} at {job.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium text-primary">{formatCurrency(job.amount)}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{job.description}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Duration: {job.estimatedDuration}</span>
                        <span>Category: {job.category}</span>
                        {job.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{job.rating}/5</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedJob(job)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Job Details</DialogTitle>
                          </DialogHeader>
                          {selectedJob && (
                            <div className="space-y-6">
                              {/* Client Info */}
                              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                                <Avatar className="w-16 h-16">
                                  <AvatarImage
                                    src={selectedJob.client.avatar || "/placeholder.svg"}
                                    alt={selectedJob.client.name}
                                  />
                                  <AvatarFallback>
                                    {selectedJob.client.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{selectedJob.client.name}</h3>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="w-4 h-4" />
                                    <span>{selectedJob.client.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">{selectedJob.client.rating}</span>
                                    <span className="text-sm text-muted-foreground">client rating</span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Chat
                                  </Button>
                                </div>
                              </div>

                              {/* Job Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Service Details</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Service:</span>
                                        <span className="font-medium">{selectedJob.service}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Category:</span>
                                        <span>{selectedJob.category}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Duration:</span>
                                        <span>{selectedJob.estimatedDuration}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Amount:</span>
                                        <span className="font-semibold text-primary">
                                          {formatCurrency(selectedJob.amount)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-2">Schedule</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Date:</span>
                                        <span>{selectedJob.date}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Time:</span>
                                        <span>{selectedJob.time}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Location:</span>
                                        <span>{selectedJob.location}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Status</h4>
                                    <Badge className={cn("text-sm", getStatusColor(selectedJob.status))}>
                                      {getStatusIcon(selectedJob.status)}
                                      <span className="ml-2 capitalize">{selectedJob.status.replace("-", " ")}</span>
                                    </Badge>
                                  </div>

                                  {selectedJob.requirements && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Requirements</h4>
                                      <ul className="text-sm space-y-1">
                                        {selectedJob.requirements.map((req, index) => (
                                          <li key={index} className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                            {req}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {selectedJob.review && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Client Review</h4>
                                      <div className="p-3 bg-muted/30 rounded-lg">
                                        <div className="flex items-center gap-1 mb-2">
                                          {[...Array(selectedJob.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                          ))}
                                        </div>
                                        <p className="text-sm">{selectedJob.review}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Description */}
                              <div>
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl">
                                  {selectedJob.description}
                                </p>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-3 pt-4 border-t">
                                <Button variant="outline" className="flex-1 bg-transparent">
                                  <Navigation className="w-4 h-4 mr-2" />
                                  Get Directions
                                </Button>
                                <Button variant="outline" className="flex-1 bg-transparent">
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Message Client
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {job.status === "pending" && (
                        <div className="flex gap-2">
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
                            <Check className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                        </div>
                      )}

                      {job.status === "confirmed" && (
                        <Button
                          size="sm"
                          onClick={() => handleJobAction(job.id, "start")}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Timer className="w-4 h-4 mr-2" />
                          Start Job
                        </Button>
                      )}

                      {job.status === "in-progress" && (
                        <Button
                          size="sm"
                          onClick={() => handleJobAction(job.id, "complete")}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete
                        </Button>
                      )}

                      {job.status === "completed" && (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </div>
                      )}
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
