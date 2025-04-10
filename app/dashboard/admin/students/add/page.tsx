"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const subjects = [
  { id: "mathematics", label: "Mathematics" },
  { id: "science", label: "Science" },
  { id: "english", label: "English" },
  { id: "hindi", label: "Hindi" },
  { id: "socialStudies", label: "Social Studies" },
  { id: "physics", label: "Physics" },
  { id: "chemistry", label: "Chemistry" },
  { id: "biology", label: "Biology" },
  { id: "computerScience", label: "Computer Science" },
  { id: "physicalEducation", label: "Physical Education" },
]

const classes = Array.from({ length: 12 }, (_, i) => ({
  id: `${i + 1}`,
  label: `Class ${i + 1}`,
}))

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  class: z.string({
    required_error: "Please select a class.",
  }),
  rollNumber: z.string().min(1, {
    message: "Roll number is required.",
  }),
  subjects: z.array(z.string()).min(1, {
    message: "Please select at least one subject.",
  }),
  parentName: z.string().min(2, {
    message: "Parent name must be at least 2 characters.",
  }),
  parentContact: z.string().min(10, {
    message: "Please enter a valid contact number.",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
})

export default function AddStudentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      class: "",
      rollNumber: "",
      subjects: [],
      parentName: "",
      parentContact: "",
      password: "",
      gender: "",
      dateOfBirth: "",
      address: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      setErrorMessage("")

      // Generate a random password if not provided
      if (!values.password) {
        values.password = Math.random().toString(36).slice(-8)
      }

      const response = await fetch("/api/students/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          rollNumber: Number.parseInt(values.rollNumber),
          createdBy: "admin",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === "Roll number already exists") {
          setErrorMessage(data.message || "A student with this roll number already exists in this class.")
          setShowErrorDialog(true)
          throw new Error(data.message || data.error)
        } else if (data.error === "Email already registered") {
          setErrorMessage(data.message || "This email is already registered to another student.")
          setShowErrorDialog(true)
          throw new Error(data.message || data.error)
        } else {
          throw new Error(data.message || data.error || "Failed to add student")
        }
      }

      // Show success dialog
      setSuccessMessage(`Student added successfully. Student ID: ${data.student.studentId}`)
      setShowSuccessDialog(true)

      // Also show toast notification
      toast({
        title: "Success",
        description: `Student added successfully. Student ID: ${data.student.studentId}`,
      })

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/admin/students")
      }, 2000)
    } catch (error) {
      console.error("Error adding student:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add student",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Student</h1>
        <p className="text-muted-foreground">Create a new student account in the system</p>
      </div>

      {errorMessage && !showErrorDialog && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{errorMessage}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
          <CardDescription>Enter the details of the new student</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Full Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter student's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter student's email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Class <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rollNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Roll Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter roll number" {...field} />
                      </FormControl>
                      <FormDescription>This will be used to generate the student ID</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Parent/Guardian Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter parent's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Parent/Guardian Contact <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter parent's contact number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter password or leave for auto-generation" {...field} />
                      </FormControl>
                      <FormDescription>Leave blank to auto-generate a password</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter student's address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subjects"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>
                        Subjects <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormDescription>Select the subjects for this student</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {subjects.map((subject) => (
                        <FormField
                          key={subject.id}
                          control={form.control}
                          name="subjects"
                          render={({ field }) => {
                            return (
                              <FormItem key={subject.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(subject.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, subject.id])
                                        : field.onChange(field.value?.filter((value) => value !== subject.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{subject.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard/admin/students")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Student"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error Adding Student</DialogTitle>
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
                router.push("/dashboard/admin/students")
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
