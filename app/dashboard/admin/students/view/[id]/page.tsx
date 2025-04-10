"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Pencil, Loader2, Calendar, Book, User, Phone, Mail, Home, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Student {
  _id: string
  name: string
  email: string
  class: string
  rollNumber: number
  studentId: string
  subjects: string[]
  parentName: string
  parentContact: string
  paymentStatus: string
  createdAt: string
  updatedAt: string
  address?: string
  phone?: string
  dateOfBirth?: string
  gender?: string
}

export default function StudentDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [attendanceSummary, setAttendanceSummary] = useState<any>(null)
  const [paymentHistory, setPaymentHistory] = useState<any[]>([])

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        if (!params?.id) {
          toast({
            title: "Error",
            description: "Student ID is missing",
            variant: "destructive",
          })
          router.push("/dashboard/admin/students")
          return
        }

        setIsLoading(true)
        const response = await fetch(`/api/students/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch student data")
        }

        const data = await response.json()
        setStudent(data)

        // Fetch attendance summary
        try {
          const attendanceResponse = await fetch(`/api/students/${params.id}/attendance/summary`)
          if (attendanceResponse.ok) {
            const attendanceData = await attendanceResponse.json()
            setAttendanceSummary(attendanceData)
          }
        } catch (error) {
          console.error("Error fetching attendance:", error)
        }

        // Fetch payment history
        try {
          const paymentResponse = await fetch(`/api/students/${params.id}/payment`)
          if (paymentResponse.ok) {
            const paymentData = await paymentResponse.json()
            setPaymentHistory(paymentData)
          }
        } catch (error) {
          console.error("Error fetching payment history:", error)
        }
      } catch (error) {
        console.error("Error fetching student:", error)
        toast({
          title: "Error",
          description: "Failed to load student data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudentDetails()
  }, [params?.id, router, toast])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!student) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Student Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>The requested student could not be found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Student Details</h1>
        </div>
        <Button onClick={() => router.push(`/dashboard/admin/students/${params.id}/edit`)} size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="text-lg">{getInitials(student.name)}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold">{student.name}</h2>
            <p className="text-muted-foreground mb-2">{student.studentId || "ID not assigned"}</p>
            <Badge className="mb-4">{student.class || "Class not assigned"}</Badge>
            <div className="w-full space-y-2 text-left">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{student.email}</span>
              </div>
              {student.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{student.phone}</span>
                </div>
              )}
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Roll Number: {student.rollNumber}</span>
              </div>
              {student.gender && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Gender: {student.gender}</span>
                </div>
              )}
              {student.dateOfBirth && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>DOB: {formatDate(student.dateOfBirth)}</span>
                </div>
              )}
              {student.address && (
                <div className="flex items-start">
                  <Home className="h-4 w-4 mr-2 text-muted-foreground mt-1" />
                  <span>{student.address}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                  <CardDescription>Detailed information about the student</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Parent/Guardian Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p>{student.parentName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Contact</p>
                          <p>{student.parentContact}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Registration Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Registered On</p>
                          <p>{formatDate(student.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Updated</p>
                          <p>{formatDate(student.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="academic">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                  <CardDescription>Academic details and subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Class Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Class</p>
                          <p>{student.class || "Not assigned"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Roll Number</p>
                          <p>{student.rollNumber}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Subjects</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {student.subjects && student.subjects.length > 0 ? (
                          student.subjects.map((subject, index) => (
                            <Badge key={index} variant="secondary">
                              <Book className="h-3 w-3 mr-1" />
                              {subject}
                            </Badge>
                          ))
                        ) : (
                          <p>No subjects assigned</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Summary</CardTitle>
                  <CardDescription>Student's attendance record</CardDescription>
                </CardHeader>
                <CardContent>
                  {attendanceSummary ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-primary/10 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Present</p>
                          <p className="text-2xl font-bold">{attendanceSummary.present || 0}</p>
                        </div>
                        <div className="bg-destructive/10 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Absent</p>
                          <p className="text-2xl font-bold">{attendanceSummary.absent || 0}</p>
                        </div>
                        <div className="bg-yellow-500/10 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Late</p>
                          <p className="text-2xl font-bold">{attendanceSummary.late || 0}</p>
                        </div>
                        <div className="bg-green-500/10 p-4 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">Attendance %</p>
                          <p className="text-2xl font-bold">
                            {attendanceSummary.percentage ? `${attendanceSummary.percentage.toFixed(1)}%` : "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Add detailed attendance records */}
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">Recent Attendance</h3>
                        <div className="border rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Teacher</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {attendanceSummary.records && attendanceSummary.records.length > 0 ? (
                                attendanceSummary.records.map((record, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{formatDate(record.date)}</TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={
                                          record.status === "present"
                                            ? "default"
                                            : record.status === "late"
                                              ? "outline"
                                              : "destructive"
                                        }
                                      >
                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>{record.class || "N/A"}</TableCell>
                                    <TableCell>{record.subject || "N/A"}</TableCell>
                                    <TableCell>{record.teacher || "N/A"}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={5} className="text-center py-4">
                                    No detailed attendance records available
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>No attendance records found</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>Payment status and history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Current Status</h3>
                      <div className="mt-2">
                        <Badge
                          variant={
                            student.paymentStatus === "paid"
                              ? "default"
                              : student.paymentStatus === "requested"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          <CreditCard className="h-3 w-3 mr-1" />
                          {student.paymentStatus === "paid"
                            ? "Paid"
                            : student.paymentStatus === "requested"
                              ? "Payment Requested"
                              : "Payment Pending"}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Payment History</h3>
                      {paymentHistory && paymentHistory.length > 0 ? (
                        <div className="mt-2 border rounded-md">
                          <div className="grid grid-cols-4 gap-4 p-3 font-medium border-b">
                            <div>Date</div>
                            <div>Amount</div>
                            <div>Status</div>
                            <div>Notes</div>
                          </div>
                          {paymentHistory.map((payment, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 p-3 border-b last:border-0">
                              <div>{formatDate(payment.date)}</div>
                              <div>₹{payment.amount}</div>
                              <div>
                                <Badge
                                  variant={
                                    payment.status === "paid"
                                      ? "default"
                                      : payment.status === "requested"
                                        ? "outline"
                                        : "destructive"
                                  }
                                >
                                  {payment.status}
                                </Badge>
                              </div>
                              <div>{payment.notes || "N/A"}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2">No payment history available</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
