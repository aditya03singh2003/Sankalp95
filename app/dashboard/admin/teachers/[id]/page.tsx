"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft, Pencil, User, Mail, BookOpen, Briefcase, Calendar, Phone } from "lucide-react"

export default function TeacherDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const teacherId = params?.id

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!teacherId) return

      try {
        setLoading(true)
        setError(null)
        console.log(`Fetching teacher with ID: ${teacherId}`)

        const response = await fetch(`/api/teachers/${teacherId}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch teacher details")
        }

        const data = await response.json()
        console.log("Teacher data received:", data)
        setTeacher(data)
      } catch (error) {
        console.error("Error fetching teacher details:", error)
        setError(error.message || "Failed to fetch teacher details")
        toast({
          title: "Error",
          description: error.message || "Failed to fetch teacher details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTeacher()
  }, [teacherId, toast])

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Error</h1>
        </div>
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">{error}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Teacher Not Found</h1>
        </div>
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">The requested teacher could not be found.</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Teacher Details</h1>
        </div>
        <Button onClick={() => router.push(`/dashboard/admin/teachers/${teacherId}/edit`)}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Teacher
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>View detailed information about this teacher</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center">
                <User className="h-4 w-4 mr-2" />
                Name
              </div>
              <div className="font-medium">{teacher.name}</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </div>
              <div>{teacher.email}</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Specialization
              </div>
              <div>{teacher.specialization || "Not specified"}</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Experience
              </div>
              <div>{teacher.experience ? `${teacher.experience} years` : "Not specified"}</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Phone
              </div>
              <div>{teacher.phone || "Not provided"}</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center">
                <User className="h-4 w-4 mr-2" />
                Teacher ID
              </div>
              <div>{teacher.teacherId || "Not assigned"}</div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Classes
            </div>
            <div className="flex flex-wrap gap-2">
              {teacher.classes && teacher.classes.length > 0 ? (
                teacher.classes.map((cls, index) => (
                  <Badge key={index} variant="outline">
                    {typeof cls === "object" ? cls.name : cls}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">No classes assigned</span>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Joined Date
            </div>
            <div>{teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : "Unknown"}</div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => router.push(`/dashboard/admin/teachers/${teacherId}/attendance`)}
          >
            View Attendance History
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
