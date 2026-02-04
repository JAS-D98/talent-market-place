"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  UserCheck,
  MessageSquare,
  Eye,
  MoreHorizontal,
  Star,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Download,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth-store"
import { toast } from "react-toastify"

export default function FundisManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [fundis, setFundis] = useState<any[]>([])
  const [onboardingRequests, setOnboardingRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingAllFundis, setLoadingAllFundis]=useState(false)
  const [approvingIds, setApprovingIds] = useState<Set<string>>(new Set())
  const [rejectingIds, setRejectingIds] = useState<Set<string>>(new Set())

  const { userData, token } = useAuthStore()

  const getFundiProfiles = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/fundi", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch fundi profiles")
      }
      
      const data = await response.json()
      console.log('fundi data', data.data)
      setOnboardingRequests(data.data || [])
    } catch (error) {
      console.error("Error fetching pending fundi profiles:", error)
      toast.error("Failed to load fundi profiles")
    } finally {
      setLoading(false)
    }
  }

  const getAllProfiles=async()=>{
    try{
      setLoadingAllFundis(true)
      const response = await fetch("/api/admin/fundi/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch all fundi profiles")
      }
      
      const data = await response.json()
      console.log('fundi data', data.data)
      // Normalize the data so the UI can consume it directly
      const normalized = (data.data || []).map((f: any) => ({
        id: f.id,
        name: f.user?.name || "Unknown",
        phone: f.user?.phone || "-",
        category: f.service?.name || "-",
        location: f.location?.name || "-",
        rating: f.rating ?? 0,
        completedJobs: f.completedJobs ?? 0,
        earnings: f.earnings ?? 0,
        avatar: f.image ?? null,
        status: (f.status || "pending").toLowerCase(),
      }))
      setFundis(normalized)
    } catch (error) {
      console.error("Error fetching all fundi profiles:", error)
      toast.error("Failed to load fundi profiles")
    } finally {
      setLoadingAllFundis(false)
    }
  }

  useEffect(() => {
    getFundiProfiles()
    getAllProfiles()
  }, [])

  const handleFundiVerification = async (
    fundiId: string,
    status: "VERIFIED" | "REJECTED"
  ) => {
    if (!fundiId) {
      toast.error("Invalid fundi ID")
      return
    }

    try {
      // Set the appropriate loading state
      if (status === "VERIFIED") {
        setApprovingIds(prev => new Set(prev).add(fundiId))
      } else {
        setRejectingIds(prev => new Set(prev).add(fundiId))
      }

      const response = await fetch(`/api/admin/fundi/verify/${fundiId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          verificationStatus: status,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update fundi status")
      }

      await getFundiProfiles()
      toast.success(`Fundi application ${status.toLowerCase()} successfully`)
    } catch (error: any) {
      console.error("Error updating fundi status:", error)
      toast.error(error.message || "Failed to update fundi status")
    } finally {
      // Clear the loading state
      if (status === "VERIFIED") {
        setApprovingIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(fundiId)
          return newSet
        })
      } else {
        setRejectingIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(fundiId)
          return newSet
        })
      }
    }
  }

  const handleDocumentDownload = async (documentUrl: string, fileName: string) => {
    try {
      const response = await fetch(documentUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading document:", error)
      toast.error("Failed to download document")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "suspended":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const filteredFundis = fundis.filter((fundi) => {
    const matchesSearch =
      fundi.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fundi.phone?.includes(searchQuery) ||
      fundi.category?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || fundi.status === statusFilter
    const matchesCategory = categoryFilter === "all" || fundi.category === categoryFilter
    const matchesLocation = locationFilter === "all" || fundi.location === locationFilter
    return matchesSearch && matchesStatus && matchesCategory && matchesLocation
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Fundis Management</h1>
            <p className="text-muted-foreground mt-1">Manage service providers on your platform</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <UserCheck className="w-4 h-4 mr-2" />
            Add New Fundi
          </Button>
        </div>

        <Tabs defaultValue="onboarding" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="all-fundis">All Fundis</TabsTrigger>
            <TabsTrigger value="onboarding">
              Onboarding Requests
              {onboardingRequests.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {onboardingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-fundis" className="space-y-6">
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search fundis..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Plumbing">Plumbing</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Carpentry">Carpentry</SelectItem>
                      <SelectItem value="Cleaning">Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Nairobi">Nairobi</SelectItem>
                      <SelectItem value="Kiambu">Kiambu</SelectItem>
                      <SelectItem value="Nakuru">Nakuru</SelectItem>
                      <SelectItem value="Kisumu">Kisumu</SelectItem>
                      <SelectItem value="Mombasa">Mombasa</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredFundis.map((fundi) => (
                <Card key={fundi.id} className="card-premium hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={fundi.avatar || "/placeholder.svg"} alt={fundi.name} />
                          <AvatarFallback>
                            {fundi.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{fundi.name}</h3>
                          <p className="text-sm text-muted-foreground">{fundi.category}</p>
                        </div>
                      </div>
                      <Badge className={cn("text-xs", getStatusColor(fundi.status))}>
                        {getStatusIcon(fundi.status)}
                        <span className="ml-1 capitalize">{fundi.status}</span>
                      </Badge>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{fundi.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{fundi.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>
                          {fundi.rating} ({fundi.completedJobs} jobs)
                        </span>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Earnings</span>
                        <span className="font-medium">{formatCurrency(fundi.earnings)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="onboarding" className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Pending Onboarding Requests
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-muted-foreground">Loading pending requests...</p>
                    </div>
                  ) : onboardingRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <UserCheck className="w-12 h-12 text-muted-foreground" />
                      <p className="text-muted-foreground">No pending onboarding requests</p>
                    </div>
                  ) : (
                    onboardingRequests.map((req) => {
                      const fullName = req.user?.name || req.name || "Unknown"
                      const phone = req.user?.phone || req.phone || "-"
                      const category = req.service?.name || req.category || "-"
                      const location = req.location?.name || req.location || "-"
                      const applied = req.appliedDate
                        ? new Date(req.appliedDate).toLocaleDateString()
                        : "-"
                      const docs: any[] = req.documents || []
                      const isApproving = approvingIds.has(req.id)
                      const isRejecting = rejectingIds.has(req.id)

                      return (
                        <div
                          key={req.id}
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium">{fullName}</h4>
                              <Badge variant="outline">{category}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Applied: {applied}
                              </span>
                            </div>
                            {docs.length > 0 && (
                              <div className="flex items-center gap-2 mt-3">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  Documents:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {docs.map((doc, idx) => (
                                    <Button
                                      key={idx}
                                      variant="secondary"
                                      size="sm"
                                      className="text-xs h-6 px-2"
                                      onClick={() => handleDocumentDownload(doc.url || doc, doc.name || `document-${idx + 1}`)}
                                    >
                                      <Download className="w-3 h-3 mr-1" />
                                      {doc.name || `Document ${idx + 1}`}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleFundiVerification(req.id, "VERIFIED")}
                              disabled={isApproving || isRejecting}
                            >
                              {isApproving ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Approving...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </>
                              )}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleFundiVerification(req.id, "REJECTED")}
                              disabled={isApproving || isRejecting}
                            >
                              {isRejecting ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Rejecting...
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
