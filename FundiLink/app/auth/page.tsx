"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useLoggedInUserStore from "@/store/logged-in-user-store"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string>("")
  const {loggedInUser,setLoggedInUser}=useLoggedInUserStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    agreeToTerms: false,
  })

  const router = useRouter()
  const { setToken, setUserData } = useAuthStore()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!isLogin && !formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!isLogin && !/^(\+254|0)[17]\d{8}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid Kenyan phone number"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!isLogin && !formData.agreeToTerms) {
      newErrors.terms = "Please agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Create appropriate payload based on mode
    const payload = isLogin 
      ? {
          email: formData.email.trim(),
          password: formData.password,
        }
      : {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          agreeToTerms: formData.agreeToTerms,
        }

    // Log the payload for debugging
    console.log("Submitting form data:", payload)

    try {
      const endpoint = isLogin ? "/api/signin" : "/api/signup"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      console.log("API response:", result)

      if (!response.ok) {
        throw new Error(result?.data.message || "Authentication failed")
      }

      // Handle response message - check both possible structures
      const responseMessage = result.data?.message || result.message || "Success"
      setMessage(responseMessage)
      console.log("Response message:", responseMessage)
      console.log("Full response object:", result)

      setTimeout(() => {
        setMessage("")
      }, 8000)

      // Handle successful login
      if (isLogin) {
        // Check for user data in different possible locations
        const userData = result.data?.user
        const token = result.data?.accessToken

        if (userData) {
          console.log("User data found:", userData)
          
          
          // Set user data in Zustand store
          setUserData(userData)
          setLoggedInUser(true)
          
          toast.success(`Welcome back, ${userData?.name || 'User'}!`)
        }

        if (token) {
          console.log("Token found:", token)
          setToken(token) // token stored
        }

        setLoggedInUser(true)
        // Decide redirect based on role or explicit returnUrl query
        const roleBasedDefault =
          userData.role === "ADMIN" || userData.role === "SUPERADMIN" ? "/admin" : "/"

        const returnUrlParam = new URLSearchParams(window.location.search).get("returnUrl")
        const destination = returnUrlParam || roleBasedDefault

        router.push(destination)
      } else {
        toast.success("Account created successfully. Please sign in.")
        // Switch UI back to sign-in mode for the user
        setIsLogin(true);
      }

    } catch (err: any) {
      console.error("Authentication error:", err)
      setMessage(err.data.message)
    toast.error(err.data.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setMessage("")
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      agreeToTerms: false,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <div className="pt-12 pb-6">
        <div className="container-mobile">
          <div className="flex items-center mb-8">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-2 p-2 hover:bg-white/50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 text-center">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">FundiLink</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container-mobile pb-8">
        {/* Auth Card */}
        <Card className="card-premium max-w-md mx-auto">
          <CardContent className="p-6 sm:p-8">
            {/* Toggle Tabs */}
            <div className="flex bg-muted/30 p-1 rounded-xl mb-8">
              <button
                onClick={() => !isLoading && setIsLogin(true)}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  isLogin ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => !isLoading && setIsLogin(false)}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                  !isLogin ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Welcome Text */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {isLogin ? "Welcome Back!" : "Join FundiLink"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isLogin
                  ? "Sign in to access your bookings and preferences"
                  : "Create your account to book services and track your orders"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field (Sign Up Only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`pl-10 h-12 rounded-xl border-2 transition-all ${
                        errors.name
                          ? "border-destructive focus:border-destructive"
                          : "border-muted focus:border-primary"
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && (
                    <div className="flex items-center text-destructive text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.name}
                    </div>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 h-12 rounded-xl border-2 transition-all ${
                      errors.email ? "border-destructive focus:border-destructive" : "border-muted focus:border-primary"
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center text-destructive text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Phone Field (Sign Up Only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="tel"
                      placeholder="0700 000 000"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={`pl-10 h-12 rounded-xl border-2 transition-all ${
                        errors.phone
                          ? "border-destructive focus:border-destructive"
                          : "border-muted focus:border-primary"
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phone && (
                    <div className="flex items-center text-destructive text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.phone}
                    </div>
                  )}
                </div>
              )}

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 pr-10 h-12 rounded-xl border-2 transition-all ${
                      errors.password
                        ? "border-destructive focus:border-destructive"
                        : "border-muted focus:border-primary"
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center text-destructive text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Terms Checkbox (Sign Up Only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                      className="mt-1"
                      disabled={isLoading}
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                      I agree to the{" "}
                      <button type="button" className="text-primary hover:underline">
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button type="button" className="text-primary hover:underline">
                        Privacy Policy
                      </button>
                    </label>
                  </div>
                  {errors.terms && (
                    <div className="flex items-center text-destructive text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.terms}
                    </div>
                  )}
                </div>
              )}

              {/* Forgot Password (Login Only) */}
              {isLogin && (
                <div className="text-right">
                  <button type="button" className="text-sm text-primary hover:underline" disabled={isLoading}>
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Message Display */}
              {message && (
                <div className="flex items-center text-destructive text-xs bg-destructive/10 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" disabled={isLoading} className="w-full h-12 btn-primary text-base font-medium">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </>
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <Separator className="flex-1" />
              <span className="px-4 text-xs text-muted-foreground bg-background">OR</span>
              <Separator className="flex-1" />
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-2 bg-transparent hover:bg-muted/50"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-2 bg-transparent hover:bg-muted/50"
                disabled={isLoading}
              >
                <Phone className="w-5 h-5 mr-3" />
                Continue with Phone
              </Button>
            </div>

            {/* Switch Mode */}
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary font-medium hover:underline"
                  disabled={isLoading}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Guest Mode Option */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground mb-3">Want to explore first?</p>
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-primary hover:bg-primary/10"
            disabled={isLoading}
          >
            Continue as Guest
          </Button>
        </div>

        {/* Features Preview */}
        <div className="mt-12 max-w-sm mx-auto">
          <h3 className="text-center font-semibold mb-6 text-foreground">Why Join FundiLink?</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 backdrop-blur-sm">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Track Your Bookings</p>
                <p className="text-xs text-muted-foreground">Never lose track of your service appointments</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 backdrop-blur-sm">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">Personalized Recommendations</p>
                <p className="text-xs text-muted-foreground">Get suggestions based on your preferences</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 backdrop-blur-sm">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Faster Checkout</p>
                <p className="text-xs text-muted-foreground">Save payment methods and addresses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
