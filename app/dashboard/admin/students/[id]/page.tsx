"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft, Pencil, User, Mail, BookOpen, Users, Phone, Calendar, CreditCard } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

export default function StudentDetailsPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attendanceData, setAttendanceData] = useState({
    records: [],
    presentCount: 0,
    absentCount: 0,
    leaveCount: 0,
    totalCount: 0,
    presentPercentage: 0,
    absentPercentage: 0,
    leavePercentage: 0,
  })
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState("pending")
  const [paymentHistory, setPaymentHistory] = useState([])
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentNotes, setPaymentNotes] = useState("")

  // Get the student ID from params
  const studentId = params.id

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return

      try {
        setLoading(true)
        setError(null)
        console.log(`Fetching student with ID: ${studentId}`)

        const response = await fetch(`/api/students/${studentId}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch student details")
        }

        const data = await response.json()
        console.log("Student data received:", data)
        setStudent(data)

        // Fetch attendance data immediately
        fetchAttendanceData()
        // Fetch payment data
        fetchPaymentData()
      } catch (error) {
        console.error("Error fetching student details:", error)
        setError(error.message || "Failed to fetch student details")
        toast({
          title: "Error",
          description: error.message || "Failed to fetch student details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [studentId, toast])

  // Fetch attendance data
  const fetchAttendanceData = async () => {
    if (!studentId) return

    try {
      setLoadingAttendance(true)
      console.log(`Fetching attendance data for student: ${studentId}`)
      const response = await fetch(`/api/students/${studentId}/attendance`)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Attendance API error:", errorData)
        throw new Error(errorData.error || "Failed to fetch attendance data")
      }

      const data = await response.json()
      console.log("Attendance data received:", data)
      setAttendanceData(data)
    } catch (error) {
      console.error("Error fetching attendance data:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch attendance data",
        variant: "destructive",
      })
    } finally {
      setLoadingAttendance(false)
    }
  }

  // Fetch payment data
  const fetchPaymentData = async () => {
    if (!studentId) return

    try {
      const response = await fetch(`/api/students/${studentId}/payment`)

      if (!response.ok) {
        throw new Error("Failed to fetch payment data")
      }

      const data = await response.json()
      console.log("Payment data received:", data)

      setPaymentStatus(data.paymentStatus || "pending")
      setPaymentHistory(data.paymentHistory || [])
    } catch (error) {
      console.error("Error fetching payment data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch payment information",
        variant: "destructive",
      })
    }
  }

  // Update payment status
  const updatePaymentStatus = async (newStatus) => {
    if (!studentId) return

    try {
      setIsUpdatingPayment(true)

      const response = await fetch(`/api/students/${studentId}/payment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentStatus: newStatus,
          amount: paymentAmount ? Number.parseFloat(paymentAmount) : undefined,
          notes: paymentNotes || undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update payment status")
      }

      const data = await response.json()
      toast({
        title: "Success",
        description: data.message || "Payment status updated successfully",
      })

      // Refresh payment data
      fetchPaymentData()

      // Reset form fields
      setPaymentAmount("")
      setPaymentNotes("")
    } catch (error) {
      console.error("Error updating payment status:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update payment status",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingPayment(false)
    }
  }

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "requested":
        return <Badge className="bg-blue-100 text-blue-800">Requested</Badge>
      case "pending":
      default:
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
    }
  }

  const getAttendanceStatusBadge = (status) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800">Present</Badge>
      case "absent":
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>
      case "leave":
        return <Badge className="bg-blue-100 text-blue-800">Leave</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

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

  if (!student) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Student Not Found</h1>
        </div>
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-muted-foreground">The requested student could not be found.</div>
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
          <h1 className="text-3xl font-bold">Student Details</h1>
        </div>
        <Button onClick={() => router.push(`/dashboard/admin/students/${studentId}/edit`)}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Student
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>View detailed information about this student</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Name
                </div>
                <div className="font-medium">{student.name}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </div>
                <div>{student.email}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Class
                </div>
                <div>{student.class || "Not assigned"}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Student ID
                </div>
                <div>{student.studentId || "Not assigned"}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Parent Name
                </div>
                <div>{student.parentName || "Not provided"}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Parent Contact
                </div>
                <div>{student.parentContact || "Not provided"}</div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Subjects
              </div>
              <div className="flex flex-wrap gap-2">
                {student.subjects && student.subjects.length > 0 ? (
                  student.subjects.map((subject, index) => (
                    <Badge key={index} variant="outline">
                      {subject}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">No subjects assigned</span>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Registration Date
              </div>
              <div>{student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "Unknown"}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>Current payment information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Status
              </div>
              <div>{getPaymentStatusBadge(paymentStatus)}</div>
            </div>

            {paymentHistory && paymentHistory.length > 0 ? (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Payment History
                  </div>
                  <div className="space-y-2">
                    {paymentHistory.map((payment, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">
                            {payment.amount ? `₹${payment.amount}` : "Amount not specified"}
                          </div>
                          <Badge
                            className={
                              payment.status === "paid" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                            }
                          >
                            {payment.status || "pending"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {payment.date ? new Date(payment.date).toLocaleDateString() : "Date not recorded"}
                        </div>
                        {payment.notes && <div className="text-sm mt-2 italic">{payment.notes}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground">No payment history available</div>
            )}
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Manage Payments</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Payment Status</DialogTitle>
                  <DialogDescription>Change the payment status for {student.name}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="amount" className="text-right">
                      Amount (₹)
                    </label>
                    <input
                      id="amount"
                      type="number"
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="notes" className="text-right">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      className="col-span-3 flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Add payment notes"
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter className="sm:justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="bg-green-100 text-green-800 hover:bg-green-200"
                      onClick={() => updatePaymentStatus("paid")}
                      disabled={isUpdatingPayment}
                    >
                      {isUpdatingPayment ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      Mark as Paid
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                      onClick={() => updatePaymentStatus("pending")}
                      disabled={isUpdatingPayment}
                    >
                      {isUpdatingPayment ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      Mark as Pending
                    </Button>
                  </div>
                  <DialogClose asChild>
                    <Button variant="secondary" disabled={isUpdatingPayment}>
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>

      {/* Attendance Section */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>View student's attendance history</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="history">Attendance History</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4 pt-4">
                {loadingAttendance ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : attendanceData && attendanceData.totalCount > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Present</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            {attendanceData.presentPercentage || 0}%
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {attendanceData.presentCount || 0} days present
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Absent</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">{attendanceData.absentPercentage || 0}%</div>
                          <p className="text-xs text-muted-foreground">{attendanceData.absentCount || 0} days absent</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Leave</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">{attendanceData.leavePercentage || 0}%</div>
                          <p className="text-xs text-muted-foreground">
                            {attendanceData.leaveCount || 0} days on leave
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{attendanceData.totalCount || 0}</div>
                          <p className="text-xs text-muted-foreground">Since enrollment</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Recent Attendance</h3>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead>Date</TableHead>
                              <TableHead>Subject</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Marked By</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {attendanceData.records.slice(0, 5).map((record, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  {new Date(record.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </TableCell>
                                <TableCell>{record.subject}</TableCell>
                                <TableCell>{getAttendanceStatusBadge(record.status)}</TableCell>
                                <TableCell>{record.markedBy}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No attendance records found for this student.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="pt-4">
                {loadingAttendance ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : attendanceData && attendanceData.records && attendanceData.records.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Date</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Marked By</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceData.records.map((record, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {new Date(record.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </TableCell>
                            <TableCell>{record.subject}</TableCell>
                            <TableCell>{getAttendanceStatusBadge(record.status)}</TableCell>
                            <TableCell>{record.markedBy}</TableCell>
                            <TableCell>{record.notes || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No attendance records found for this student.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
