"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Check, ChevronLeft, ChevronRight, Clock, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function TeacherAttendancePage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString("default", { month: "long" }))
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  )
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [attendance, setAttendance] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [session, setSession] = useState(null) // Placeholder for session
  const [selectedTeacher, setSelectedTeacher] = useState(null) // Placeholder for selectedTeacher

  const fetchAttendanceData = async () => {
    // Placeholder function for fetching attendance data
    console.log("Fetching attendance data...")
  }

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/teachers")
        if (!response.ok) {
          throw new Error("Failed to fetch teachers")
        }
        const data = await response.json()
        setTeachers(data)

        // If we have a selected date, fetch attendance for that date
        if (selectedDate) {
          fetchAttendanceForDate(selectedDate)
        }
      } catch (error) {
        console.error("Error fetching teachers:", error)
        toast({
          title: "Error",
          description: "Failed to load teachers. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTeachers()
  }, [toast])

  const fetchAttendanceForDate = async (date: Date) => {
    try {
      setLoading(true)
      const formattedDate = date.toISOString().split("T")[0]
      const response = await fetch(`/api/attendance/teachers?date=${formattedDate}`)

      if (!response.ok) {
        throw new Error("Failed to fetch attendance")
      }

      const attendanceData = await response.json()
      console.log("Attendance data:", attendanceData)

      // Update the attendance state with the fetched data
      const updatedAttendance = { ...attendance }

      // Reset all attendance first
      teachers.forEach((teacher) => {
        updatedAttendance[teacher._id] = { status: "absent", notes: "" }
      })

      // Then update with actual attendance data
      attendanceData.forEach((record: any) => {
        if (record.teacherId && record.teacherId._id) {
          updatedAttendance[record.teacherId._id] = {
            status: record.status,
            notes: record.notes || "",
          }
        }
      })

      setAttendance(updatedAttendance)
    } catch (error) {
      console.error("Error fetching attendance:", error)
      toast({
        title: "Error",
        description: "Failed to load attendance data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      fetchAttendanceForDate(date)
    }
  }

  const toggleAttendance = (teacherId) => {
    setTeachers(
      teachers.map((teacher) => {
        if (teacher.id === teacherId) {
          const currentStatus = teacher.attendance[0].status
          const newStatus = currentStatus === "Present" ? "Absent" : currentStatus === "Absent" ? "Leave" : "Present"

          // Update the first attendance record (for the selected date)
          const updatedAttendance = [...teacher.attendance]
          updatedAttendance[0] = {
            ...updatedAttendance[0],
            status: newStatus,
          }

          return {
            ...teacher,
            attendance: updatedAttendance,
          }
        }
        return teacher
      }),
    )
  }

  const markAllPresent = () => {
    setTeachers(
      teachers.map((teacher) => {
        // Update the first attendance record (for the selected date)
        const updatedAttendance = [...teacher.attendance]
        updatedAttendance[0] = {
          ...updatedAttendance[0],
          status: "Present",
        }

        return {
          ...teacher,
          attendance: updatedAttendance,
        }
      }),
    )
  }

  const saveAttendance = async () => {
    try {
      setSaving(true)

      // Convert selected date to ISO format
      const dateParts = selectedDate.split(" ")
      const months = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
      }
      const dateObj = new Date(
        Number.parseInt(dateParts[2]), // year
        months[dateParts[1]], // month
        Number.parseInt(dateParts[0]), // day
      )

      // Save attendance for each teacher
      for (const teacher of teachers) {
        await fetch("/api/attendance/teacher", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teacherId: teacher.id,
            date: dateObj.toISOString(),
            status: teacher.attendance[0].status,
            remarks: "Marked by admin",
          }),
        })
      }

      toast({
        title: "Attendance saved",
        description: `Teacher attendance for ${selectedDate} has been saved.`,
      })
    } catch (error) {
      console.error("Error saving attendance:", error)
      toast({
        variant: "destructive",
        title: "Error saving attendance",
        description: error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  // Calculate attendance statistics
  const totalTeachers = teachers.length
  const presentTeachers = teachers.filter((teacher) => teacher.attendance[0]?.status === "Present").length
  const absentTeachers = teachers.filter((teacher) => teacher.attendance[0]?.status === "Absent").length
  const leaveTeachers = teachers.filter((teacher) => teacher.attendance[0]?.status === "Leave").length
  const attendancePercentage = totalTeachers > 0 ? Math.round((presentTeachers / totalTeachers) * 100) : 0

  // Add this function to handle marking attendance for a teacher
  const markAttendance = async (teacherId, status, date, notes = "") => {
    setSubmitting(true)
    try {
      const response = await fetch("/api/attendance/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId,
          status,
          date: date.toISOString(),
          notes,
          markedBy: session?.user?.name || "Admin",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark attendance")
      }

      toast({
        title: "Success",
        description: `Attendance marked as ${status} for ${selectedTeacher?.name}`,
      })

      // Refresh the attendance data
      fetchAttendanceData()
    } catch (error) {
      console.error("Error marking attendance:", error)
      toast({
        title: "Error",
        description: "Failed to mark attendance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Teacher Attendance Management</h2>
          <p className="text-muted-foreground">Mark and manage teacher attendance</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeachers}</div>
            <p className="text-xs text-muted-foreground">Active faculty members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{presentTeachers}</div>
            <p className="text-xs text-muted-foreground">Teachers present</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <X className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{absentTeachers}</div>
            <p className="text-xs text-muted-foreground">Teachers absent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <Calendar className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{leaveTeachers}</div>
            <p className="text-xs text-muted-foreground">Teachers on leave</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mark" className="space-y-4">
        <TabsList className="bg-sankalp-100 text-black">
          <TabsTrigger value="mark" className="data-[state=active]:bg-sankalp-500">
            Mark Attendance
          </TabsTrigger>
          <TabsTrigger value="view" className="data-[state=active]:bg-sankalp-500">
            View Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mark" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mark Teacher Attendance</CardTitle>
              <CardDescription>Mark attendance for faculty members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="min-w-[120px] text-center">{selectedDate}</div>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  className="border-green-500 text-green-500 hover:bg-green-50"
                  onClick={markAllPresent}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark All Present
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-sankalp-100">
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Teacher Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          <Clock className="h-5 w-5 animate-spin mx-auto mb-2" />
                          <p>Loading teacher data...</p>
                        </TableCell>
                      </TableRow>
                    ) : teachers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No teachers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      teachers.map((teacher, index) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{teacher.employeeId}</TableCell>
                          <TableCell>{teacher.name}</TableCell>
                          <TableCell>
                            <div className="text-sm">{teacher.contactNumber}</div>
                            <div className="text-xs text-muted-foreground">{teacher.email}</div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                teacher.attendance[0]?.status === "Present"
                                  ? "success"
                                  : teacher.attendance[0]?.status === "Leave"
                                    ? "outline"
                                    : "destructive"
                              }
                              className={
                                teacher.attendance[0]?.status === "Present" ? "bg-green-500 hover:bg-green-600" : ""
                              }
                            >
                              {teacher.attendance[0]?.status === "Present" ? (
                                <Check className="mr-1 h-3 w-3" />
                              ) : teacher.attendance[0]?.status === "Leave" ? (
                                <Calendar className="mr-1 h-3 w-3" />
                              ) : (
                                <X className="mr-1 h-3 w-3" />
                              )}
                              {teacher.attendance[0]?.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAttendance(teacher.id)}
                              className={
                                teacher.attendance[0]?.status === "Present"
                                  ? "text-green-500 hover:text-green-600 hover:bg-green-50"
                                  : ""
                              }
                            >
                              Toggle
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  className="bg-sankalp-600 hover:bg-sankalp-700 text-black"
                  onClick={saveAttendance}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Attendance
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports</CardTitle>
              <CardDescription>View and analyze teacher attendance data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="January">January 2023</SelectItem>
                      <SelectItem value="February">February 2023</SelectItem>
                      <SelectItem value="March">March 2023</SelectItem>
                      <SelectItem value="April">April 2023</SelectItem>
                      <SelectItem value="May">May 2023</SelectItem>
                      <SelectItem value="June">June 2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline">Generate Report</Button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8 text-center">
                  <div className="space-y-2">
                    <Clock className="h-12 w-12 animate-spin text-muted-foreground mx-auto" />
                    <h3 className="text-lg font-medium">Loading attendance data...</h3>
                  </div>
                </div>
              ) : teachers.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-center">
                  <div className="space-y-2">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h3 className="text-lg font-medium">No attendance data available</h3>
                    <p className="text-sm text-muted-foreground">Select a different month or mark attendance first</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {teachers.slice(0, 5).map((teacher) => (
                    <Card key={teacher.id} className="overflow-hidden">
                      <CardHeader className="bg-sankalp-50 py-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-base">{teacher.name}</CardTitle>
                            <CardDescription>{teacher.employeeId}</CardDescription>
                          </div>
                          <Badge
                            variant={
                              teacher.stats.attendancePercentage >= 90
                                ? "success"
                                : teacher.stats.attendancePercentage >= 75
                                  ? "outline"
                                  : "destructive"
                            }
                            className={teacher.stats.attendancePercentage >= 90 ? "bg-green-500" : ""}
                          >
                            {teacher.stats.attendancePercentage}% Attendance
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="p-4 grid grid-cols-4 gap-4 text-center border-b">
                          <div>
                            <p className="text-sm text-muted-foreground">Working Days</p>
                            <p className="text-lg font-medium">{teacher.stats.workingDays}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Present</p>
                            <p className="text-lg font-medium text-green-500">{teacher.stats.presentDays}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Absent</p>
                            <p className="text-lg font-medium text-red-500">{teacher.stats.absentDays}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Leave</p>
                            <p className="text-lg font-medium text-amber-500">{teacher.stats.leaveDays}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
