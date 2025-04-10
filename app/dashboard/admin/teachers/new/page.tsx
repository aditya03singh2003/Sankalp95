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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  address: z.string().optional(),
  specialization: z.string().min(2, "Specialization is required"),
  qualification: z.string().min(2, "Qualification is required").optional(),
  experience: z.string().min(1, "Experience is required"),
  gender: z.string().optional(),
  joiningDate: z.string().optional(),
  salary: z.string().optional(),
  classes: z.array(z.string()).optional(),
  subjects: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

export default function NewTeacherPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableClasses, setAvailableClasses] = useState([
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
  const [availableSubjects, setAvailableSubjects] = useState([
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Hindi",
    "Social Studies",
    "Computer Science",
    "Physical Education",
  ])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      specialization: "",
      qualification: "",
      experience: "",
      gender: "",
      joiningDate: new Date().toISOString().split("T")[0],
      salary: "",
      classes: [],
      subjects: [],
      notes: "",
    },
  })

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/classes")
        if (response.ok) {
          const data = await response.json()
          setAvailableClasses(data.map((cls) => cls.name))
        } else {
          console.error("Failed to fetch classes")
          // Default classes already set in state
        }
      } catch (error) {
        console.error("Error fetching classes:", error)
        // Default classes already set in state
      }
    }

    fetchClasses()
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
      console.log("Submitting new teacher:", values)

      const response = await fetch("/api/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        const teacher = await response.json()
        console.log("Teacher created successfully:", teacher)

        toast({
          title: "Success",
          description: "Teacher added successfully",
        })

        // Redirect to the teacher list page
        router.push("/dashboard/admin/teachers")
      } else {
        const error = await response.json()
        console.error("Failed to add teacher:", error)
        throw new Error(error.error || "Failed to add teacher")
      }
    } catch (error) {
      console.error("Error adding teacher:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add teacher",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Add New Teacher</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher Information</CardTitle>
          <CardDescription>Enter the details of the new teacher</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
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
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
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
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                  name="joiningDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Joining Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization</FormLabel>
                        <FormControl>
                          <Input placeholder="Mathematics" {...field} />
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
                          <Input placeholder="M.Sc., B.Ed." {...field} />
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
                          <Input type="number" min="0" {...field} />
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
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Teaching Information</h3>
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="classes"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Classes</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {availableClasses.map((cls) => (
                            <FormField
                              key={cls}
                              control={form.control}
                              name="classes"
                              render={({ field }) => {
                                return (
                                  <FormItem key={cls} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(cls)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), cls])
                                            : field.onChange(field.value?.filter((value) => value !== cls))
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">{cls}</FormLabel>
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
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Information</h3>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="123 Main St, City, State, ZIP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any additional information about the teacher" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Teacher
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
