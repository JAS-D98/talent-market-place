"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav"
import { toast } from "@/hooks/use-toast"
import {
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  Award,
  Camera,
  Edit,
  Save,
  X,
  Shield,
  DollarSign,
  Bell,
  Eye,
  EyeOff,
  Upload,
  Calendar,
  Briefcase,
  Target,
} from "lucide-react"

// Mock profile data
const profileData = {
  personal: {
    name: "Peter Mwangi",
    email: "peter.mwangi@email.com",
    phone: "+254712345678",
    avatar: "/placeholder-user.jpg",
    bio: "Professional plumber with over 5 years of experience in residential and commercial plumbing. Specialized in emergency repairs, installations, and maintenance.",
    location: "Nairobi, Kenya",
    dateJoined: "2023-03-15",
  },
  professional: {
    category: "Plumbing",
    hourlyRate: 1200,
    experience: "5+ years",
    serviceRadius: 15,
    availability: "24/7",
    languages: ["English", "Swahili"],
    certifications: ["Licensed Plumber", "Emergency Response Certified"],
    skills: ["Pipe Installation", "Leak Repair", "Drain Cleaning", "Emergency Plumbing", "Bathroom Renovation"],
  },
  stats: {
    totalJobs: 156,
    completedJobs: 142,
    rating: 4.8,
    totalReviews: 156,
    responseTime: "12 min",
    completionRate: 91,
    repeatCustomers: 68,
  },
  settings: {
    notifications: {
      jobRequests: true,
      messages: true,
      reviews: true,
      promotions: false,
    },
    privacy: {
      showPhone: true,
      showEmail: false,
      showLocation: true,
    },
    availability: {
      monday: { available: true, start: "08:00", end: "18:00" },
      tuesday: { available: true, start: "08:00", end: "18:00" },
      wednesday: { available: true, start: "08:00", end: "18:00" },
      thursday: { available: true, start: "08:00", end: "18:00" },
      friday: { available: true, start: "08:00", end: "18:00" },
      saturday: { available: true, start: "09:00", end: "17:00" },
      sunday: { available: false, start: "09:00", end: "17:00" },
    },
  },
}

export default function FundiProfilePage() {
  const [profile, setProfile] = useState(profileData)
  const [isEditing, setIsEditing] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tempData, setTempData] = useState({})

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleEdit = (section) => {
    setEditingSection(section)
    setTempData(profile[section] || {})
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setProfile((prev) => ({
        ...prev,
        [editingSection]: tempData,
      }))

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })

      setIsEditing(false)
      setEditingSection(null)
      setTempData({})
      setIsLoading(false)
    }, 1500)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingSection(null)
    setTempData({})
  }

  const handleInputChange = (field, value) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNestedInputChange = (section, field, value) => {
    setTempData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleArrayInputChange = (field, index, value) => {
    setTempData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addArrayItem = (field, newItem) => {
    setTempData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), newItem],
    }))
  }

  const removeArrayItem = (field, index) => {
    setTempData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20 xl:pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 lg:space-y-8 pt-4 lg:pt-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">My Profile</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your professional profile and settings</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-800">
              <Shield className="w-3 h-3 mr-1" />
              Verified Professional
            </Badge>
          </div>
        </div>

        {/* Profile Overview */}
        <Card className="card-premium">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                    <AvatarImage src={profile.personal.avatar || "/placeholder.svg"} alt={profile.personal.name} />
                    <AvatarFallback>
                      {profile.personal.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0">
                        <Camera className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Update Profile Photo</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <Avatar className="w-32 h-32">
                            <AvatarImage
                              src={profile.personal.avatar || "/placeholder.svg"}
                              alt={profile.personal.name}
                            />
                            <AvatarFallback>
                              {profile.personal.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="space-y-2">
                          <Label>Upload New Photo</Label>
                          <Input type="file" accept="image/*" />
                          <p className="text-xs text-muted-foreground">Recommended: Square image, at least 400x400px</p>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1 bg-transparent">
                            Cancel
                          </Button>
                          <Button className="flex-1">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold">{profile.personal.name}</h2>
                  <p className="text-muted-foreground">{profile.professional.category} Professional</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>
                        {profile.stats.rating} ({profile.stats.totalReviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(profile.personal.dateJoined).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
                <div className="text-center p-3 bg-muted/30 rounded-xl">
                  <p className="text-2xl font-bold text-primary">{profile.stats.totalJobs}</p>
                  <p className="text-xs text-muted-foreground">Total Jobs</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">{profile.stats.completionRate}%</p>
                  <p className="text-xs text-muted-foreground">Completion</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">{profile.stats.responseTime}</p>
                  <p className="text-xs text-muted-foreground">Response</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-xl">
                  <p className="text-2xl font-bold text-purple-600">{profile.stats.repeatCustomers}%</p>
                  <p className="text-xs text-muted-foreground">Repeat</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg sm:text-xl">Personal Information</CardTitle>
            <Button variant="outline" size="sm" onClick={() => handleEdit("personal")} disabled={isEditing}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            {editingSection === "personal" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={tempData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={tempData.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={tempData.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={tempData.location || ""}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={tempData.bio || ""}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell clients about your experience and expertise..."
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{profile.personal.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{profile.personal.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{profile.personal.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{profile.personal.location}</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Bio</p>
                  <p className="text-sm leading-relaxed">{profile.personal.bio}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg sm:text-xl">Professional Information</CardTitle>
            <Button variant="outline" size="sm" onClick={() => handleEdit("professional")} disabled={isEditing}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            {editingSection === "professional" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Service Category</Label>
                    <Select
                      value={tempData.category || ""}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Plumbing">Plumbing</SelectItem>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="Carpentry">Carpentry</SelectItem>
                        <SelectItem value="Painting">Painting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate (KES)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={tempData.hourlyRate || ""}
                      onChange={(e) => handleInputChange("hourlyRate", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience</Label>
                    <Select
                      value={tempData.experience || ""}
                      onValueChange={(value) => handleInputChange("experience", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2 years">1-2 years</SelectItem>
                        <SelectItem value="3-5 years">3-5 years</SelectItem>
                        <SelectItem value="5+ years">5+ years</SelectItem>
                        <SelectItem value="10+ years">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceRadius">Service Radius (km)</Label>
                    <Input
                      id="serviceRadius"
                      type="number"
                      value={tempData.serviceRadius || ""}
                      onChange={(e) => handleInputChange("serviceRadius", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(tempData.skills || []).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-4 h-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeArrayItem("skills", index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          addArrayItem("skills", e.target.value.trim())
                          e.target.value = ""
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = e.target.parentElement.querySelector("input")
                        if (input.value.trim()) {
                          addArrayItem("skills", input.value.trim())
                          input.value = ""
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{profile.professional.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Hourly Rate</p>
                      <p className="font-medium">{formatCurrency(profile.professional.hourlyRate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Experience</p>
                      <p className="font-medium">{profile.professional.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Service Radius</p>
                      <p className="font-medium">{profile.professional.serviceRadius} km</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.professional.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.professional.certifications.map((cert, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800">
                          <Award className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.professional.languages.map((lang, index) => (
                        <Badge key={index} variant="outline">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notifications */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </h3>
              <div className="space-y-3">
                {Object.entries(profile.settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                    <div>
                      <p className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                      <p className="text-sm text-muted-foreground">
                        {key === "jobRequests" && "Get notified when you receive new job requests"}
                        {key === "messages" && "Get notified when clients send you messages"}
                        {key === "reviews" && "Get notified when clients leave reviews"}
                        {key === "promotions" && "Receive promotional offers and updates"}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => {
                        setProfile((prev) => ({
                          ...prev,
                          settings: {
                            ...prev.settings,
                            notifications: {
                              ...prev.settings.notifications,
                              [key]: checked,
                            },
                          },
                        }))
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy
              </h3>
              <div className="space-y-3">
                {Object.entries(profile.settings.privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                    <div>
                      <p className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                      <p className="text-sm text-muted-foreground">
                        {key === "showPhone" && "Display your phone number on your profile"}
                        {key === "showEmail" && "Display your email address on your profile"}
                        {key === "showLocation" && "Display your location on your profile"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {value ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-red-600" />}
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => {
                          setProfile((prev) => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              privacy: {
                                ...prev.settings.privacy,
                                [key]: checked,
                              },
                            },
                          }))
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <DashboardBottomNav />
    </div>
  )
}
