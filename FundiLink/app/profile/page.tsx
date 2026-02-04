"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { User, Phone, Mail, MapPin, Calendar, Star, Settings, LogOut, Edit, Shield, CheckCircle } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import useLoggedInUserStore from "@/store/logged-in-user-store"
import { toast } from "react-toastify"

const mockBookings = [
  {
    id: 1,
    service: "Pipe Repair",
    fundi: "John Mwangi",
    date: "2024-01-10",
    status: "completed",
    rating: 5,
    amount: 1650,
  },
  {
    id: 2,
    service: "House Cleaning",
    fundi: "Grace Wanjiku",
    date: "2024-01-08",
    status: "completed",
    rating: 4,
    amount: 2150,
  },
  {
    id: 3,
    service: "Electrical Work",
    fundi: "Peter Ochieng",
    date: "2024-01-15",
    status: "upcoming",
    rating: null,
    amount: 2500,
  },
]

export default function ProfilePage() {
  const { userData } = useAuthStore()
  const {loggedInUser,setLoggedInUser}=useLoggedInUserStore();
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: userData?.name || "Guest User",
    phone: userData?.phone || "",
    email: userData?.email || "",
    location: "",
  })

  // keep profile data in sync when auth store updates
  useEffect(() => {
    if (userData) {
      setProfileData({
        name: userData.name || "Guest User",
        phone: userData.phone || "",
        email: userData.email || "",
        location: "",
      })
    }
  }, [userData])

  const router = useRouter()
  const isFundiApplicant = !!userData && (userData.fundiStatus === "PENDING" || userData.fundiStatus === "VERIFIED")
  const [isHydrated, setIsHydrated] = useState(false)
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const handleSaveProfile = () => {
    setIsEditing(false)
  }

  const handleSignUp = () => {
    router.push("/auth")
  }

  const handleSignOut= async()=>{
    try {
      setIsLoading(true)
      const response = await fetch("/api/signout", {
        method: "POST",
      })
      const data = await response.json()
      console.log(data)
      if (data.success) {
        useAuthStore.setState({ userData: null })
        useLoggedInUserStore.setState({ loggedInUser: false })
        toast.success("You have been signed out successfully")
        setIsLoading(false)
        router.push("/")
      }
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700"
      case "upcoming":
        return "bg-blue-100 text-blue-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 pt-12 pb-8">
        <div className="container-mobile">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{userData?.name || "Guest User"}</h1>
            <div className="flex items-center justify-center space-x-2">
              <Badge variant={isHydrated && !loggedInUser ? "secondary" : "default"}>
                {isHydrated && !loggedInUser ? "Guest Mode" : "Registered User"}
              </Badge>
              {isHydrated && userData?.verificationStatus === "verified" && (
                <Badge variant="default" className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
              {/* {!isFundiApplicant && userData && ( */}
                <Button size="sm" className="mt-3" onClick={() => router.push("/fundi/apply")}>Apply to become a Fundi</Button>
              {/* )} */}
          </div>
        </div>
      </div>

      <div className="container-mobile py-6 space-y-6">
        {/* Guest Mode CTA */}
        {isHydrated && !loggedInUser && (
          <Card className="card-premium bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Create Your Account</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Save your bookings, get personalized recommendations, and enjoy faster checkout.
              </p>
              <Button onClick={handleSignUp} className="btn-primary w-full">
                Sign Up Now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Profile Information */}
        <Card className="card-premium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Profile Information</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    value={profileData.location}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <Button onClick={handleSaveProfile} className="flex-1 btn-primary">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span>{profileData.name || "Not provided"}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span>{profileData.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span>{profileData.email || "Not provided"}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span>{profileData.location || "Not provided"}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking History */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-lg">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {isHydrated && !userData ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No Booking History</h3>
                <p className="text-sm text-muted-foreground mb-4">Sign up to track your bookings and service history</p>
                <Button onClick={handleSignUp} size="sm" className="btn-secondary">
                  Create Account
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {mockBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/20">
                    <div className="flex-1">
                      <h4 className="font-medium">{booking.service}</h4>
                      <p className="text-sm text-muted-foreground">{booking.fundi}</p>
                      <p className="text-xs text-muted-foreground">{booking.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      <p className="text-sm font-medium mt-1">KSh {booking.amount.toLocaleString()}</p>
                      {booking.rating && (
                        <div className="flex items-center mt-1">
                          <Star className="w-3 h-3 text-accent fill-current mr-1" />
                          <span className="text-xs">{booking.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => router.push("/help")} className="h-16 flex-col space-y-1 border-2">
            <Settings className="w-6 h-6" />
            <span className="text-sm">Help & Support</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/features")}
            className="h-16 flex-col space-y-1 border-2"
          >
            <Star className="w-6 h-6" />
            <span className="text-sm">App Features</span>
          </Button>

          {!isFundiApplicant && userData && (
            <Button
              variant="outline"
              onClick={() => router.push("/fundi/apply")}
              className="h-16 flex-col space-y-1 border-2 col-span-2"
            >
              <Settings className="w-6 h-6" />
              <span className="text-sm">Offer a Service (Become Fundi)</span>
            </Button>
          )}
        </div>

        {/* Sign Out */}
        {isHydrated && userData && (
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full h-12 border-2 text-red-600 border-red-200 hover:bg-red-50"
            disabled={isLoading}
         >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        )}
      </div>
    </div>
  )
}
