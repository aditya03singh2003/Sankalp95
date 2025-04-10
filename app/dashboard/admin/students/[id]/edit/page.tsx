"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  class: z.string().min(1, "Class is required"),
  parentName: z.string().min(2, "Parent name is required"),
  parentContact: z.string().min(10, "Valid contact number is required"),
  address: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  studentId: z.string().optional(),
  notes: z.string().optional(),
})

export default function EditStudentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [classes, setClasses] = useState<any[]>([])
  const [availableSubjects, setAvailableSubjects] = useState([
    "Mathematics",
    "Science",
    "English",
    "Social Studies",
    "Hindi",
    "Computer Science",
    "Physics",
    "Chemistry",
    "Biology",
  ])
  const studentId = params?.id

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      class: "",
      parentName: "",
      parentContact: "",
      address: "",
      subjects: [],
      studentId: "",
      notes: "",
    },
  })

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/classes")
        if (response.ok) {
          const data = await response.json()
          setClasses(data)
        } else {
          console.error("Failed to fetch classes")
          // Use default classes if API fails
          setClasses([
            { _id: "1", name: "Class 1" },
            { _id: "2", name: "Class 2" },
            { _id: "3", name: "Class 3" },
            { _id: "4", name: "Class 4" },
            { _id: "5", name: "Class 5" },
            { _id: "6", name: "Class 6" },
            { _id: "7", name: "Class 7" },
            { _id: "8", name: "Class 8" },
            { _id: "9", name: "Class 9" },
            { _id: "10", name: "Class 10" },
            { _id: "11", name: "Class 11" },
            { _id: "12", name: "Class 12" },
          ])
        }
      } catch (error) {
        console.error("Error fetching classes:", error)
        // Use default classes if API fails
        setClasses([
          { _id: "1", name: "Class 1" },
          { _id: "2", name: "Class 2" },
          { _id: "3", name: "Class 3" },
          { _id: "4", name: "Class 4" },
          { _id: "5", name: "Class 5" },
          { _id: "6", name: "Class 6" },
          { _id: "7", name: "Class 7" },
          { _id: "8", name: "Class 8" },
          { _id: "9", name: "Class 9" },
          { _id: "10", name: "Class 10" },
          { _id: "11", name: "Class 11" },
          { _id: "12", name: "Class 12" },
        ])
      }
    }

    const fetchStudent = async () => {
      if (!studentId) return

      try {
        setLoading(true)
        console.log(`Fetching student with ID: ${studentId}`)
        const response = await fetch(`/api/students/${studentId}`)

        if (response.ok) {
          const student = await response.json()
          console.log("Student data received:", student)

          // Set form values
          form.reset({
            name: student.name || "",
            email: student.email || "",
            class: student.class || "",
            parentName: student.parentName || "",
            parentContact: student.parentContact || "",
            address: student.address || "",
            subjects: student.subjects || [],
            studentId: student.studentId || "",
            notes: student.notes || "",
          })
        } else {
          const error = await response.json()
          console.error("Failed to fetch student details:", error)
          toast({
            title: "Error",
            description: error.error || "Failed to fetch student details",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching student:", error)
        toast({
          title: "Error",
          description: "Failed to fetch student details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
    fetchStudent()
  }, [studentId, form, toast])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!studentId) return

    try {
      setSubmitting(true)
      console.log("Submitting student update:", values)

      const response = await fetch(`/api/students/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        const updatedStudent = await response.json()
        console.log("Student updated successfully:", updatedStudent)

        toast({
          title: "Success",
          description: "Student updated successfully",
        })
        router.push("/dashboard/admin/students")
      } else {
        const error = await response.json()
        console.error("Failed to update student:", error)

        toast({
          title: "Error",
          description: error.error || "Failed to update student",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating student:", error)
      toast({
        title: "Error",
        description: "Failed to update student",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Student</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
          <CardDescription>Update the student's information</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter student's email" {...field} />
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
                      <FormLabel>Class</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls._id} value={cls.name}>
                              {cls.name}
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
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Student ID (auto-generated if empty)" {...field} />
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
                      <FormLabel>Parent/Guardian Name</FormLabel>
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
                      <FormLabel>Parent/Guardian Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter parent's contact number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter student's address" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subjects"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Subjects</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableSubjects.map((subject) => (
                        <FormField
                          key={subject}
                          control={form.control}
                          name="subjects"
                          render={({ field }) => {
                            return (
                              <FormItem key={subject} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(subject)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), subject])
                                        : field.onChange(field.value?.filter((value) => value !== subject))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{subject}</FormLabel>
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

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Additional notes about the student" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
