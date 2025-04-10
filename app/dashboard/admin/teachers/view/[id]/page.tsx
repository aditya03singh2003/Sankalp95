"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  Edit,
  Trash,
  ArrowLeft,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
import { useToast } from "@/components/ui/use-toast"

export default function TeacherDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [teacher, setTeacher] = useState(null)
  const [loading, setLoading] = useState(true)
  const [attendanceData, setAttendanceData] = useState({
    records: [],
    presentCount: 0,
    absentCount: 0,
    leaveCount: 0,
    totalCount: 0,
    presentPercentage: 0,
  })
  const [salaryData, setSalaryData] = useState([])
  const [classesData, setClassesData] = useState([])
  const [salaryDialogOpen, setSalaryDialogOpen] = useState(false)
  const [processingSalary, setProcessingSalary] = useState(false)
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [attendanceSummary, setAttendanceSummary] = useState(null)
  const [loadingAttendance, setLoadingAttendance] = useState(true)

  useEffect(() => {
    if (session) {
      fetchTeacherData()
      fetchSalaryData()
      fetchClassesData()
      fetchAttendance()
    }
  }, [session, params.id])

  const fetchTeacherData = async () => {
    try {
      const response = await fetch(`/api/teachers/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setTeacher(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch teacher data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error)
      toast({
        title: "Error",
        description: "An error occurred while fetching teacher data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendance = async () => {
    setLoadingAttendance(true)
    try {
      const response = await fetch(`/api/attendance/teacher/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setAttendanceRecords(data.attendanceRecords)
        setAttendanceSummary(data.summary)
      } else {
        console.error("Failed to fetch attendance data")
      }
    } catch (error) {
      console.error("Error fetching attendance:", error)
    } finally {
      setLoadingAttendance(false)
    }
  }

  const fetchSalaryData = async () => {
    try {
      const response = await fetch(`/api/teachers/salary/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setSalaryData(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error fetching salary data:", error)
    }
  }

  const fetchClassesData = async () => {
    try {
      const response = await fetch(`/api/teachers/${params.id}/classes`)
      if (response.ok) {
        const data = await response.json()
        setClassesData(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error fetching classes data:", error)
    }
  }

  const handleEditTeacher = () => {
    router.push(`/dashboard/admin/teachers/${params.id}/edit`)
  }

  const handleDeleteTeacher = async () => {
    if (confirm("Are you sure you want to delete this teacher? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/teachers/${params.id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast({
            title: "Success",
            description: "Teacher deleted successfully",
          })
          router.push("/dashboard/admin/teachers")
        } else {
          toast({
            title: "Error",
            description: "Failed to delete teacher",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting teacher:", error)
        toast({
          title: "Error",
          description: "An error occurred while deleting the teacher",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpdateSalary = async (status) => {
    setProcessingSalary(true)
    try {
      const response = await fetch(`/api/teachers/salary/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId: params.id,
          status: status,
          date: new Date().toISOString(),
          updatedBy: session?.user?.name || "Admin",
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Salary marked as ${status}`,
        })
        fetchSalaryData()
        setSalaryDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: "Failed to update salary status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating salary:", error)
      toast({
        title: "Error",
        description: "An error occurred while updating salary",
        variant: "destructive",
      })
    } finally {
      setProcessingSalary(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading teacher details...</span>
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h2 className="text-2xl font-bold">Teacher Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The teacher you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button onClick={() => router.push("/dashboard/admin/teachers")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Teachers
        </Button>
      </div>
    )
  }

  const getSalaryStatus = () => {
    if (!salaryData || salaryData.length === 0) return "unpaid"
    const latestSalary = salaryData[0]
    return latestSalary.status || "unpaid"
  }

  const getSalaryStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "partial":
        return <Badge className="bg-blue-500">Partial</Badge>
      default:
        return <Badge variant="outline">Unpaid</Badge>
    }
  }

  const formatDate = (date) => {
    return format(new Date(date), "MMM d, yyyy")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/admin/teachers")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">Teacher Details</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEditTeacher}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDeleteTeacher}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{teacher.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{teacher.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{teacher.phone || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">
                  {teacher.dateOfBirth ? format(new Date(teacher.dateOfBirth), "MMMM d, yyyy") : "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{teacher.address || "Not provided"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Salary Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-3 py-4">
              {teacher.salary ? (
                <>
                  <div className="text-3xl font-bold">₹{teacher.salary}</div>
                  <p className="text-sm text-muted-foreground">Monthly Salary</p>

                  <div className="flex items-center justify-center w-full mt-2">
                    {teacher.salaryStatus === "paid" ? (
                      <Badge className="bg-green-500 text-white px-3 py-1 text-sm">Paid</Badge>
                    ) : teacher.salaryStatus === "pending" ? (
                      <Badge className="bg-amber-500 text-white px-3 py-1 text-sm">Pending</Badge>
                    ) : (
                      <Badge variant="outline" className="px-3 py-1 text-sm">
                        Not Processed
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    {teacher.lastPaymentDate
                      ? `Last payment: ${formatDate(teacher.lastPaymentDate)}`
                      : "No payment records"}
                  </p>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Salary not set</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => router.push(`/dashboard/admin/teachers/${params.id}/edit`)}
                  >
                    Set Salary
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Qualification</p>
                <p className="font-medium">{teacher.qualification || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-medium">{teacher.subject || "Not assigned"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Joining Date</p>
                <p className="font-medium">
                  {teacher.joiningDate ? format(new Date(teacher.joiningDate), "MMMM d, yyyy") : "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-sm text-muted-foreground">Salary Status</p>
                  <div className="flex items-center gap-2">
                    {getSalaryStatusBadge(getSalaryStatus())}
                    <p className="text-sm text-muted-foreground">
                      {salaryData.length > 0
                        ? `Last updated: ${format(new Date(salaryData[0].date), "MMM d, yyyy")}`
                        : "No salary records"}
                    </p>
                  </div>
                </div>
                <Dialog open={salaryDialogOpen} onOpenChange={setSalaryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">Manage Salary</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Salary Status</DialogTitle>
                      <DialogDescription>Update the salary status for {teacher.name}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Current Status: {getSalaryStatusBadge(getSalaryStatus())}</h3>
                        <p className="text-sm text-muted-foreground">Select a new status below:</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => handleUpdateSalary("paid")}
                          className="bg-green-500 hover:bg-green-600"
                          disabled={processingSalary}
                        >
                          {processingSalary ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Mark as Paid
                        </Button>
                        <Button
                          onClick={() => handleUpdateSalary("pending")}
                          className="bg-yellow-500 hover:bg-yellow-600"
                          disabled={processingSalary}
                        >
                          {processingSalary ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <AlertCircle className="h-4 w-4 mr-2" />
                          )}
                          Mark as Pending
                        </Button>
                        <Button
                          onClick={() => handleUpdateSalary("partial")}
                          className="bg-blue-500 hover:bg-blue-600"
                          disabled={processingSalary}
                        >
                          {processingSalary ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <CreditCard className="h-4 w-4 mr-2" />
                          )}
                          Mark as Partial
                        </Button>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" disabled={processingSalary}>
                          Cancel
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Attendance History</TabsTrigger>
          <TabsTrigger value="salary">Salary History</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
              <CardDescription>Overall attendance record for this teacher</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAttendance ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                      <p className="text-green-600 dark:text-green-400 text-2xl font-bold">
                        {attendanceSummary?.present || 0}
                      </p>
                      <p className="text-green-600 dark:text-green-400">Present</p>
                      <p className="text-sm text-green-500 dark:text-green-400">
                        {attendanceSummary?.percentage ? `${attendanceSummary.percentage.toFixed(1)}%` : "0%"}
                      </p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                      <p className="text-red-600 dark:text-red-400 text-2xl font-bold">
                        {attendanceSummary?.absent || 0}
                      </p>
                      <p className="text-red-600 dark:text-red-400">Absent</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg text-center">
                      <p className="text-amber-600 dark:text-amber-400 text-2xl font-bold">
                        {attendanceSummary?.leave || 0}
                      </p>
                      <p className="text-amber-600 dark:text-amber-400">Leave</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                      <p className="text-blue-600 dark:text-blue-400 text-2xl font-bold">
                        {attendanceSummary?.total || 0}
                      </p>
                      <p className="text-blue-600 dark:text-blue-400">Total Days</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <h3 className="font-medium mb-4">Attendance History</h3>
                    {attendanceRecords && attendanceRecords.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {attendanceRecords.map((record) => (
                            <TableRow key={record._id}>
                              <TableCell>{formatDate(record.date)}</TableCell>
                              <TableCell>
                                {record.status === "present" ? (
                                  <Badge className="bg-green-500">Present</Badge>
                                ) : record.status === "absent" ? (
                                  <Badge variant="destructive">Absent</Badge>
                                ) : (
                                  <Badge variant="outline" className="border-amber-500 text-amber-500">
                                    Leave
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>{record.notes || "-"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        No attendance records found for this teacher
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="salary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Salary History</CardTitle>
              <CardDescription>Record of all salary payments for this teacher</CardDescription>
            </CardHeader>
            <CardContent>
              {salaryData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Updated By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salaryData.map((salary, index) => (
                      <TableRow key={index}>
                        <TableCell>{format(new Date(salary.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>₹{salary.amount || "N/A"}</TableCell>
                        <TableCell>{getSalaryStatusBadge(salary.status)}</TableCell>
                        <TableCell>{salary.method || "N/A"}</TableCell>
                        <TableCell>{salary.updatedBy || "System"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No salary records available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Classes</CardTitle>
              <CardDescription>Classes assigned to this teacher</CardDescription>
            </CardHeader>
            <CardContent>
              {classesData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classesData.map((classItem, index) => (
                      <TableRow key={index}>
                        <TableCell>{classItem.day}</TableCell>
                        <TableCell>{classItem.subject}</TableCell>
                        <TableCell>{classItem.classGroup}</TableCell>
                        <TableCell>
                          {classItem.startTime} - {classItem.endTime}
                        </TableCell>
                        <TableCell>{classItem.location || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No classes assigned to this teacher</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
