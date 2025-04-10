"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"

// Define the form schema with proper validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  specialization: z.string().min(2, "Specialization is required"),
  experience: z.string().min(1, "Experience is required"),
  qualification: z.string().optional(),
  address: z.string().optional(),
  classes: z
    .array(
      z.object({
        name: z.string(),
      }),
    )
    .optional(),
  teacherId: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  notes: z.string().optional(),
  salary: z.string().optional(),
})

export default function EditTeacherPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [availableClasses, setAvailableClasses] = useState<string[]>([])
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      qualification: "",
      address: "",
      classes: [],
      teacherId: "",
      subjects: [],
      notes: "",
      salary: "",
    },
  })

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/classes")
        if (response.ok) {
          const data = await response.json()
          setAvailableClasses(data.map((cls: any) => cls.name))
        } else {
          console.error("Failed to fetch classes")
          // Use default classes if API fails
          setAvailableClasses([
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
          ])
        }
      } catch (error) {
        console.error("Error fetching classes:", error)
        // Use default classes if API fails
        setAvailableClasses([
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
        ])
      }
    }

    const fetchTeacher = async () => {
      if (!params?.id) {
        toast({
          title: "Error",
          description: "Teacher ID is missing",
          variant: "destructive",
        })
        router.push("/dashboard/admin/teachers")
        return
      }

      try {
        setLoading(true)
        console.log(`Fetching teacher with ID: ${params.id}`)
        const response = await fetch(`/api/teachers/${params.id}`)

        if (response.ok) {
          const teacher = await response.json()
          console.log("Teacher data received:", teacher)

          // Format classes array to match the schema
          let formattedClasses = []
          if (teacher.classes && Array.isArray(teacher.classes)) {
            formattedClasses = teacher.classes
              .map((cls: any) => {
                if (typeof cls === "string") {
                  return { name: cls }
                } else if (cls && typeof cls === "object" && cls.name) {
                  return { name: cls.name }
                }
                return null
              })
              .filter(Boolean)
          }

          // Set form values
          form.reset({
            name: teacher.name || "",
            email: teacher.email || "",
            phone: teacher.phone || "",
            specialization: teacher.specialization || "",
            experience: teacher.experience?.toString() || "",
            qualification: teacher.qualification || "",
            address: teacher.address || "",
            classes: formattedClasses,
            teacherId: teacher.teacherId || "",
            subjects: teacher.subjects || [],
            notes: teacher.notes || "",
            salary: teacher.salary?.toString() || "",
          })
        } else {
          const error = await response.json()
          console.error("Failed to fetch teacher details:", error)
          toast({
            title: "Error",
            description: error.error || "Failed to fetch teacher details",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching teacher:", error)
        toast({
          title: "Error",
          description: "Failed to fetch teacher details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
    fetchTeacher()
  }, [params?.id, form, router, toast])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!params?.id) {
      toast({
        title: "Error",
        description: "Teacher ID is missing",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      console.log("Submitting teacher update:", values)

      // Format classes array to match the expected format in the model
      const selectedClasses = availableClasses
        .filter((cls) => {
          // Check if this class is in the form values
          return values.classes?.some((c) => c.name === cls)
        })
        .map((cls) => ({ name: cls }))

      // Prepare the data for submission
      const formData = {
        ...values,
        classes: selectedClasses.length > 0 ? selectedClasses : values.classes,
        salary: values.salary ? Number.parseFloat(values.salary) : undefined,
      }

      console.log("Formatted data for submission:", formData)

      const response = await fetch(`/api/teachers/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedTeacher = await response.json()
        console.log("Teacher updated successfully:", updatedTeacher)

        toast({
          title: "Success",
          description: "Teacher updated successfully",
        })
        router.push("/dashboard/admin/teachers")
        router.refresh()
      } else {
        const errorData = await response.json()
        console.error("Failed to update teacher:", errorData)

        toast({
          title: "Error",
          description: errorData.error || "Failed to update teacher",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating teacher:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update teacher",
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
        <h1 className="text-3xl font-bold">Edit Teacher</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher Information</CardTitle>
          <CardDescription>Update the teacher's information</CardDescription>
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
                        <Input placeholder="Enter teacher's full name" {...field} />
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
                        <Input placeholder="Enter teacher's email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter teacher's phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="teacherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Teacher ID (auto-generated if empty)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter teacher's specialization" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience (years)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter years of experience" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualification</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter teacher's qualification" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter teacher's salary" {...field} />
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
                      <Textarea placeholder="Enter teacher's address" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Classes</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableClasses.map((cls) => (
                    <div key={cls} className="flex items-center space-x-2">
                      <Checkbox
                        id={`class-${cls}`}
                        checked={form.getValues().classes?.some((c) => c.name === cls)}
                        onCheckedChange={(checked) => {
                          const currentClasses = form.getValues().classes || []
                          if (checked) {
                            form.setValue("classes", [...currentClasses, { name: cls }])
                          } else {
                            form.setValue(
                              "classes",
                              currentClasses.filter((c) => c.name !== cls),
                            )
                          }
                        }}
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
                      <Textarea placeholder="Additional notes about the teacher" className="min-h-[100px]" {...field} />
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
