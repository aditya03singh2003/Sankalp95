"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

// Student registration form schema
const studentFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
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
})

// Teacher registration form schema
const teacherFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  classes: z.array(z.string()).min(1, {
    message: "Please select at least one class.",
  }),
  subjects: z.array(z.string()).min(1, {
    message: "Please select at least one subject.",
  }),
  specialization: z.string({
    required_error: "Please select a specialization.",
  }),
  qualification: z.string({
    required_error: "Please select your highest qualification.",
  }),
  experience: z.string().min(1, {
    message: "Please enter years of experience.",
  }),
  phone: z
    .string()
    .min(10, {
      message: "Please enter a valid phone number.",
    })
    .optional(),
})

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("student")

  // Available subjects
  const subjects = [
    { id: "mathematics", label: "Mathematics" },
    { id: "science", label: "Science" },
    { id: "english", label: "English" },
    { id: "history", label: "History" },
    { id: "geography", label: "Geography" },
    { id: "physics", label: "Physics" },
    { id: "chemistry", label: "Chemistry" },
    { id: "biology", label: "Biology" },
    { id: "computer_science", label: "Computer Science" },
  ]

  // Available classes
  const classes = Array.from({ length: 12 }, (_, i) => ({
    id: `${i + 1}`,
    label: `Class ${i + 1}`,
  }))

  // Available specializations
  const specializations = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
  ]

  // Available qualifications
  const qualifications = [
    "Bachelor's Degree",
    "Master's Degree",
    "Ph.D.",
    "B.Ed.",
    "M.Ed.",
    "Diploma",
    "Certificate",
    "Other",
  ]

  // Student form
  const studentForm = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      class: "",
      rollNumber: "",
      subjects: [],
      parentName: "",
      parentContact: "",
    },
  })

  // Teacher form
  const teacherForm = useForm<z.infer<typeof teacherFormSchema>>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      classes: [],
      subjects: [],
      specialization: "",
      qualification: "",
      experience: "",
      phone: "",
    },
  })

  // Handle student registration
  async function onStudentSubmit(values: z.infer<typeof studentFormSchema>) {
    try {
      setIsLoading(true)
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          role: "student",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Registration successful",
          description: "You are now being logged in automatically",
        })

        // Auto-login the user
        const result = await signIn("credentials", {
          identifier: values.email,
          password: values.password,
          redirect: false,
        })

        if (result?.error) {
          console.error("Auto-login failed:", result.error)
          router.push("/login")
        } else {
          // Redirect to student dashboard
          router.push("/dashboard/student/dashboard")
        }
      } else {
        throw new Error(data.message || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle teacher registration
  async function onTeacherSubmit(values: z.infer<typeof teacherFormSchema>) {
    try {
      setIsLoading(true)

      // Format the classes array to match the expected format in the Teacher model
      const formattedClasses = values.classes.map((classId) => {
        return { name: `Class ${classId}` }
      })

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          classes: formattedClasses,
          role: "teacher",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Registration successful",
          description: "You are now being logged in automatically",
        })

        // Auto-login the user
        const result = await signIn("credentials", {
          identifier: values.email,
          password: values.password,
          redirect: false,
        })

        if (result?.error) {
          console.error("Auto-login failed:", result.error)
          router.push("/login")
        } else {
          // Redirect to teacher dashboard
          router.push("/dashboard/teacher")
        }
      } else {
        throw new Error(data.message || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">Choose your role and register to get started</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="teacher">Teacher</TabsTrigger>
          </TabsList>

          <TabsContent value="student" className="mt-6">
            <Form {...studentForm}>
              <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-6">
                <FormField
                  control={studentForm.control}
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
                  control={studentForm.control}
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
                  control={studentForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={studentForm.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your class" />
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
                  control={studentForm.control}
                  name="rollNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Roll Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter your roll number" {...field} />
                      </FormControl>
                      <FormDescription>This will be used to generate your Student ID</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={studentForm.control}
                  name="subjects"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Subjects</FormLabel>
                        <FormDescription>Select the subjects you are interested in</FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {subjects.map((subject) => (
                          <FormField
                            key={subject.id}
                            control={studentForm.control}
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

                <FormField
                  control={studentForm.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent/Guardian Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={studentForm.control}
                  name="parentContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent/Guardian Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Register as Student
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="teacher" className="mt-6">
            <Form {...teacherForm}>
              <form onSubmit={teacherForm.handleSubmit(onTeacherSubmit)} className="space-y-6">
                <FormField
                  control={teacherForm.control}
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
                  control={teacherForm.control}
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
                  control={teacherForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={teacherForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormDescription>Your teacher ID will be generated using your phone number</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={teacherForm.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highest Qualification</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your qualification" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {qualifications.map((qualification) => (
                            <SelectItem key={qualification} value={qualification}>
                              {qualification}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={teacherForm.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your specialization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {specializations.map((specialization) => (
                            <SelectItem key={specialization} value={specialization}>
                              {specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={teacherForm.control}
                  name="subjects"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Subjects You Can Teach</FormLabel>
                        <FormDescription>Select all subjects you can teach</FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {subjects.map((subject) => (
                          <FormField
                            key={subject.id}
                            control={teacherForm.control}
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

                <FormField
                  control={teacherForm.control}
                  name="classes"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Classes</FormLabel>
                        <FormDescription>Select the classes you can teach</FormDescription>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {classes.map((cls) => (
                          <FormField
                            key={cls.id}
                            control={teacherForm.control}
                            name="classes"
                            render={({ field }) => {
                              return (
                                <FormItem key={cls.id} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(cls.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, cls.id])
                                          : field.onChange(field.value?.filter((value) => value !== cls.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{cls.label}</FormLabel>
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
                  control={teacherForm.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Register as Teacher
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
