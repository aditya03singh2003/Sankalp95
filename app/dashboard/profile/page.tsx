"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [isNewUser, setIsNewUser] = useState(false)

  // Profile data
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    dateOfBirth: "",
    gender: "",
    grade: "",
    section: "",
    rollNumber: "",
    bio: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated" && session) {
      fetchProfileData()
    }
  }, [status, session, router])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/profile/${session?.user.id}`)

      if (response.ok) {
        const data = await response.json()

        // Set profile data
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split("T")[0] : "",
          gender: data.gender || "",
          grade: data.grade || "",
          section: data.section || "",
          rollNumber: data.rollNumber || "",
          bio: data.bio || "",
          parentName: data.parentName || "",
          parentPhone: data.parentPhone || "",
          parentEmail: data.parentEmail || "",
        })

        // Calculate profile completion
        calculateProfileCompletion(data)

        // Check if new user (profile less than 30% complete)
        if (calculateCompletionPercentage(data) < 30) {
          setIsNewUser(true)
        }
      } else {
        console.error("Failed to fetch profile data")
        setError("Failed to load profile data. Please try again.")
      }
    } catch (err) {
      console.error("Error fetching profile:", err)
      setError("An error occurred while loading your profile.")
    } finally {
      setLoading(false)
    }
  }

  const calculateCompletionPercentage = (data) => {
    const fields = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
      "dateOfBirth",
      "gender",
      "grade",
      "section",
      "rollNumber",
      "bio",
    ]

    const filledFields = fields.filter((field) => data[field] && data[field].toString().trim() !== "").length
    return Math.round((filledFields / fields.length) * 100)
  }

  const calculateProfileCompletion = (data) => {
    const percentage = calculateCompletionPercentage(data)
    setProfileCompletion(percentage)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Recalculate profile completion in real-time
    calculateProfileCompletion({
      ...profileData,
      [name]: value,
    })
  }

  const handleSelectChange = (name, value) => {
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Recalculate profile completion in real-time
    calculateProfileCompletion({
      ...profileData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/profile/${session?.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        setSuccess("Profile updated successfully!")
        setIsNewUser(false)
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to update profile")
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(err.message || "An error occurred while updating your profile.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>
      </div>

      {isNewUser && (
        <Alert className="bg-blue-50 border-blue-500 text-blue-700">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription>
            Welcome! Please complete your profile to get the most out of your account.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-500 text-green-700">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
          <CardDescription>Complete your profile to get the most out of your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm font-medium">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" alt={profileData.name} />
                  <AvatarFallback>
                    {profileData.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{profileData.name || "Your Name"}</h3>
                  <p className="text-sm text-muted-foreground">{profileData.email || "your.email@example.com"}</p>
                  <Button type="button" variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={profileData.name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={profileData.phone} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={profileData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us a little about yourself"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>Update your address details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" value={profileData.address} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={profileData.city} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" value={profileData.state} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input id="pincode" name="pincode" value={profileData.pincode} onChange={handleInputChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
              <CardDescription>Update your academic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/Class</Label>
                  <Select value={profileData.grade} onValueChange={(value) => handleSelectChange("grade", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Class 6">Class 6</SelectItem>
                      <SelectItem value="Class 7">Class 7</SelectItem>
                      <SelectItem value="Class 8">Class 8</SelectItem>
                      <SelectItem value="Class 9">Class 9</SelectItem>
                      <SelectItem value="Class 10">Class 10</SelectItem>
                      <SelectItem value="Class 11">Class 11</SelectItem>
                      <SelectItem value="Class 12">Class 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Select value={profileData.section} onValueChange={(value) => handleSelectChange("section", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    name="rollNumber"
                    value={profileData.rollNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parent/Guardian Information</CardTitle>
              <CardDescription>Update your parent or guardian details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentName">Parent/Guardian Name</Label>
                  <Input
                    id="parentName"
                    name="parentName"
                    value={profileData.parentName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Parent/Guardian Phone</Label>
                  <Input
                    id="parentPhone"
                    name="parentPhone"
                    value={profileData.parentPhone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Parent/Guardian Email</Label>
                  <Input
                    id="parentEmail"
                    name="parentEmail"
                    type="email"
                    value={profileData.parentEmail}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
