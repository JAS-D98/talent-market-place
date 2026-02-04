"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select,  SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuthStore } from "@/store/auth-store"
import { cloudName, uploadPreset } from "@/config/config"

interface Category { id: string; name: string }
interface Location { id: string; name: string }

export default function FundiApplyPage() {
  const router = useRouter()
  const { token } = useAuthStore()

  const [category, setCategory] = useState<string>("")
  const [hourlyRate, setHourlyRate] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [documents, setDocuments] = useState<FileList | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [locations, setLocations] = useState<Location[]>([])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/categories")
      const data = await response.json()
      console.log("data from the backend for categories",data)
      setCategories(data.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      return []
    }finally{
      setIsLoading(false)
    }
  }

  const fetchLocations=async()=>{
    try {
      setIsLoading(true)
      const response = await fetch("/api/locations")
      const data = await response.json()
      console.log("data from the backend for locations",data)
      setLocations(data.data)
    } catch (error) {
      console.error("Error fetching locations:", error)
      return []
    } finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchLocations()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category) {
      toast.error("Please select a service category")
      return
    }
    if (!documents || documents.length === 0) {
      toast.error("Please upload required documents")
      return
    }
    if (!hourlyRate || isNaN(Number(hourlyRate))) {
      toast.error("Please enter a valid hourly rate")
      return
    }
    if (!location) {
      toast.error("Please enter your location")
      return
    }

    setIsLoading(true)
    try {
      // 1. Upload each document to Cloudinary and collect URLs
      const uploadedUrls: string[] = []
      if (documents) {
        for (const file of Array.from(documents)) {
          const data = new FormData()
          data.append("file", file)
          data.append("upload_preset",uploadPreset as string)
          const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
            method: "POST",
            body: data,
          })
          if (!uploadRes.ok) throw new Error("Failed to upload document")
          const uploadJson = await uploadRes.json()
          uploadedUrls.push(uploadJson.secure_url as string)
        }
      }

      // 2. Send application payload to our backend
      const selectedCategory = categories.find((c) => c.name === category)
      const serviceId = selectedCategory?.id
      if (!serviceId) throw new Error("Selected category not found")

      const selectedLocation = locations.find((l) => l.name === location)
      const locationId = selectedLocation?.id
      if (!locationId) throw new Error("Selected location not found")

      const res = await fetch("/api/fundi/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          serviceId,
          hourlyRate: Number(hourlyRate),
          locationId,
          documents: uploadedUrls,
        }),
      })
      if (!res.ok) throw new Error("Failed to submit application")
      toast.success("Application submitted! We'll review and notify you.")
      router.push("/profile")
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container-mobile">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          ← Back
        </Button>
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Apply to Become a Fundi</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Service Category</label>
                <Select value={category} onValueChange={(val) => setCategory(val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      isLoading ? (
                        <div className="px-3 py-2 text-muted-foreground text-sm">Loading categories...</div>
                      ) : (
                        <div className="px-3 py-2 text-muted-foreground text-sm">No categories available</div>
                      )
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              <p className="text-xs text-muted-foreground mb-4">
                Can't find your category? Email <a href="mailto:support@fundilink.com" className="underline">support@fundilink.com</a>
                &nbsp;and we'll assist.
              </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Hourly Rate (Ksh)</label>
                  <Input
                    type="number"
                    min="100"
                    step="0.01"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="e.g. 1000"
                  />
                </div>
                <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Select value={location} onValueChange={(val) => setLocation(val)}>
                  <SelectTrigger className="w-full"> 
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.length === 0 ? (
                      isLoading ? (
                        <div className="px-3 py-2 text-muted-foreground text-sm">Loading locations...</div>
                      ) : (
                        <div className="px-3 py-2 text-muted-foreground text-sm">No locations available</div>
                      )
                    ) : (
                      locations.map((location) => (
                        <SelectItem key={location.id} value={location.name}>
                          {location.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Required Documents</label>
                <p className="text-xs text-muted-foreground mb-2">
                  Please scan and combine all required documents into a single file before uploading.
                </p>
                <Input
                  type="file"
                  multiple
                  accept="application/pdf,image/*"
                  onChange={(e) => setDocuments(e.target.files)}
                />
                {documents && (
                  <ul className="list-disc ml-5 mt-2 text-sm">
                    {Array.from(documents).map((file) => (
                      <li key={file.name}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
