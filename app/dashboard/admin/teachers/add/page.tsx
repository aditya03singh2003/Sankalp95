"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AddTeacherPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
    qualification: "",
    specialization: "",
    experience: "",
    dateOfBirth: "",
    gender: "",
    joiningDate: new Date().toISOString().split("T")[0],
    employeeId: "",
    salary: "",
    classes: [] as string[],
    subjects: [] as string[],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleClassToggle = (className: string) => {
    setFormData((prev) => {
      const classes = [...prev.classes]
      if (classes.includes(className)) {
        return { ...prev, classes: classes.filter((c) => c !== className) }
      } else {
        return { ...prev, classes: [...classes, className] }
      }
    })
  }

  const handleSubjectToggle = (subject: string) => {
    setFormData((prev) => {
      const subjects = [...prev.subjects]
      if (subjects.includes(subject)) {
        return { ...prev, subjects: subjects.filter((s) => s !== subject) }
      } else {
        return { ...prev, subjects: [...subjects, subject] }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.contactNumber) {
        throw new Error("Please fill all required fields")
      }

      if (formData.classes.length === 0) {
        throw new Error("Please select at least one class")
      }

      if (formData.subjects.length === 0) {
        throw new Error("Please select at least one subject")
      }

      // Generate teacherID from phone number
      const phoneNumber = formData.contactNumber.replace(/\D/g, "")
      const last5Digits = phoneNumber.slice(-5)
      const generatedTeacherId = `TEACH${last5Digits}`

      // Use the teacherId as the employeeId
      const uniqueEmployeeId = generatedTeacherId

      console.log("Submitting teacher with data:", {
        ...formData,
        teacherId: generatedTeacherId,
        employeeId: uniqueEmployeeId,
        phone: formData.contactNumber,
      })

      const response = await fetch("/api/teachers/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          teacherId: generatedTeacherId,
          employeeId: uniqueEmployeeId,
          phone: formData.contactNumber, // Explicitly add phone field
          isActive: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("API error response:", data)
        if (data.error === "Employee ID already exists") {
          setErrorMessage(
            data.message ||
              "This Employee ID is already in use. Please use a different ID or leave blank to auto-generate.",
          )
          setShowErrorDialog(true)
          throw new Error(data.message || data.error)
        } else {
          throw new Error(data.message || data.error || "Failed to add teacher")
        }
      }

      // Show success dialog
      setSuccessMessage(`Teacher added successfully. Teacher ID: ${generatedTeacherId}`)
      setShowSuccessDialog(true)

      // Also show toast notification
      toast({
        title: "Success",
        description: `Teacher added successfully. Teacher ID: ${generatedTeacherId}`,
      })

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/admin/teachers")
      }, 2000)
    } catch (error) {
      console.error("Error adding teacher:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add teacher. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableClasses = [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
  ]

  const availableSubjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Hindi",
    "Social Studies",
    "Computer Science",
    "Science",
    "Physical Education",
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Add New Teacher</h2>
        <p className="text-muted-foreground">Enter teacher details to add them to the system</p>
      </div>

      {errorMessage && !showErrorDialog && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic details about the teacher</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter teacher's full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter teacher's email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">
                  Contact Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  placeholder="Enter teacher's contact number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">Last 5 digits will be used to generate Teacher ID</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)} required>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  name="employeeId"
                  placeholder="Leave blank to auto-generate"
                  value={formData.employeeId}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">Format: T-YYYY-XXXX. Leave blank to auto-generate.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Enter teacher's address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>Details about the teacher's qualifications and experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="qualification">
                  Qualification <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.qualification}
                  onValueChange={(value) => handleSelectChange("qualification", value)}
                  required
                >
                  <SelectTrigger id="qualification">
                    <SelectValue placeholder="Select highest qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bachelor's">Bachelor's Degree</SelectItem>
                    <SelectItem value="Master's">Master's Degree</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="B.Ed">B.Ed</SelectItem>
                    <SelectItem value="M.Ed">M.Ed</SelectItem>
                    <SelectItem value="B.Tech">B.Tech</SelectItem>
                    <SelectItem value="M.Tech">M.Tech</SelectItem>
                    <SelectItem value="BCA">BCA</SelectItem>
                    <SelectItem value="MCA">MCA</SelectItem>
                    <SelectItem value="B.Sc">B.Sc</SelectItem>
                    <SelectItem value="M.Sc">M.Sc</SelectItem>
                    <SelectItem value="B.Com">B.Com</SelectItem>
                    <SelectItem value="M.Com">M.Com</SelectItem>
                    <SelectItem value="BBA">BBA</SelectItem>
                    <SelectItem value="MBA">MBA</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">
                  Specialization <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.specialization}
                  onValueChange={(value) => handleSelectChange("specialization", value)}
                  required
                >
                  <SelectTrigger id="specialization">
                    <SelectValue placeholder="Select subject specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Social Studies">Social Studies</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Physical Education">Physical Education</SelectItem>
                    <SelectItem value="Economics">Economics</SelectItem>
                    <SelectItem value="Business Studies">Business Studies</SelectItem>
                    <SelectItem value="Accountancy">Accountancy</SelectItem>
                    <SelectItem value="Political Science">Political Science</SelectItem>
                    <SelectItem value="Geography">Geography</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Psychology">Psychology</SelectItem>
                    <SelectItem value="Sociology">Sociology</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">
                  Experience (Years) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  min="0"
                  placeholder="Enter years of teaching experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joiningDate">
                  Joining Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="joiningDate"
                  name="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">
                  Monthly Salary (₹) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  min="0"
                  placeholder="Enter monthly salary amount"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="block mb-2">
                  Classes <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableClasses.map((cls) => (
                    <div key={cls} className="flex items-center space-x-2">
                      <Checkbox
                        id={`class-${cls}`}
                        checked={formData.classes.includes(cls)}
                        onCheckedChange={() => handleClassToggle(cls)}
                      />
                      <label
                        htmlFor={`class-${cls}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {cls}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="block mb-2">
                  Subjects <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableSubjects.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={`subject-${subject}`}
                        checked={formData.subjects.includes(subject)}
                        onCheckedChange={() => handleSubjectToggle(subject)}
                      />
                      <label
                        htmlFor={`subject-${subject}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {subject}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/admin/teachers")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-sankalp-600 hover:bg-sankalp-700 text-black">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Teacher"
            )}
          </Button>
        </div>
      </form>

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee ID Already Exists</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowErrorDialog(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription>{successMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                router.push("/dashboard/admin/teachers")
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
