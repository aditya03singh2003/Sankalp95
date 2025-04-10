"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Calendar, Check, ChevronLeft, ChevronRight, Clock, Mail } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function TeacherStudentAttendancePage() {
  const { data: session } = useSession()
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  )
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (session?.user?.id) {
      fetchTeacherClasses()
    }
  }, [session])

  useEffect(() => {
    if (selectedClass && selectedSubject) {
      fetchStudents()
    }
  }, [selectedClass, selectedSubject, selectedDate])

  const fetchTeacherClasses = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/teachers/${session.user.id}/classes`)

      if (response.ok) {
        const data = await response.json()
        setClasses(data.classes || [])

        // Extract unique subjects from classes
        const uniqueSubjects = [...new Set(data.classes.map((c) => c.subject))]
        setSubjects(uniqueSubjects)

        // Set default selections if available
        if (data.classes.length > 0) {
          setSelectedClass(data.classes[0].grade)
          setSelectedSubject(data.classes[0].subject)
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch your assigned classes",
        })
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/attendance/students?class=${selectedClass}&subject=${selectedSubject}&date=${selectedDate}`,
      )

      if (response.ok) {
        const data = await response.json()
        setStudents(data.students || [])
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch students",
        })
      }
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAttendance = (studentId) => {
    setStudents(
      students.map((student) => {
        if (student.id === studentId) {
          const currentStatus = student.attendance
          const newStatus = currentStatus === "present" ? "absent" : currentStatus === "absent" ? "leave" : "present"

          return {
            ...student,
            attendance: newStatus,
          }
        }
        return student
      }),
    )
  }

  const markAllPresent = () => {
    setStudents(
      students.map((student) => ({
        ...student,
        attendance: "present",
      })),
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

      // Validate that all students have IDs
      const missingIds = students.filter((student) => !student.id)
      if (missingIds.length > 0) {
        throw new Error(`${missingIds.length} students are missing IDs. Please refresh and try again.`)
      }

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: dateObj.toISOString(),
          class: selectedClass,
          subject: selectedSubject,
          attendance: students.map((student) => ({
            studentId: student.id,
            status: student.attendance,
          })),
          markedBy: session.user.id,
        }),
      })

      if (response.ok) {
        // Show success dialog
        setSuccessMessage(`Attendance for ${selectedClass} - ${selectedSubject} has been saved.`)
        setShowSuccessDialog(true)

        // Also show toast notification
        toast({
          title: "Attendance saved",
          description: `Attendance for ${selectedClass} - ${selectedSubject} has been saved.`,
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save attendance")
      }
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

  const handlePreviousDay = () => {
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
    const currentDate = new Date(
      Number.parseInt(dateParts[2]), // year
      months[dateParts[1]], // month
      Number.parseInt(dateParts[0]), // day
    )

    // Subtract one day
    currentDate.setDate(currentDate.getDate() - 1)

    // Format the new date
    setSelectedDate(
      currentDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    )
  }
  const handleNextDay = () => {
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
    const currentDate = new Date(
      Number.parseInt(dateParts[2]), // year
      months[dateParts[1]], // month
      Number.parseInt(dateParts[0]), // day
    )

    // Add one day
    currentDate.setDate(currentDate.getDate() + 1)

    // Format the new date
    setSelectedDate(
      currentDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    )
  }

  const sendAbsenteeNotification = async () => {
    try {
      const absentStudents = students.filter((student) => student.attendance === "absent")

      if (absentStudents.length === 0) {
        toast({
          title: "No absent students",
          description: "There are no absent students to notify.",
        })
        return
      }

      const response = await fetch("/api/notifications/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          class: selectedClass,
          subject: selectedSubject,
          absentees: absentStudents.map((student) => ({
            studentId: student.id,
            name: student.name,
            parentEmail: student.parentEmail,
          })),
        }),
      })

      if (response.ok) {
        // Show success dialog
        setSuccessMessage(`Absence notifications sent to parents of ${absentStudents.length} students.`)
        setShowSuccessDialog(true)

        // Also show toast notification
        toast({
          title: "Notifications sent",
          description: `Absence notifications sent to parents of ${absentStudents.length} students.`,
        })
      } else {
        throw new Error("Failed to send notifications")
      }
    } catch (error) {
      console.error("Error sending notifications:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send absence notifications.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Student Attendance</h2>
          <p className="text-muted-foreground">Mark and manage attendance for your classes</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>Select class and subject to mark attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem, index) => (
                    <SelectItem key={index} value={classItem.grade}>
                      {classItem.grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject, index) => (
                    <SelectItem key={index} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousDay}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-[120px] text-center">{selectedDate}</div>
              <Button variant="outline" size="icon" onClick={handleNextDay}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {selectedClass && selectedSubject ? (
            <>
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  className="border-green-500 text-green-500 hover:bg-green-50"
                  onClick={markAllPresent}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark All Present
                </Button>
                <Button
                  variant="outline"
                  className="border-amber-500 text-amber-500 hover:bg-amber-50"
                  onClick={sendAbsenteeNotification}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Notify Absentees
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-sankalp-100">
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          <Clock className="h-5 w-5 animate-spin mx-auto mb-2" />
                          <p>Loading student data...</p>
                        </TableCell>
                      </TableRow>
                    ) : students.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No students found in this class
                        </TableCell>
                      </TableRow>
                    ) : (
                      students.map((student, index) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{student.rollNumber || "N/A"}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div
                                className={`w-3 h-3 rounded-full mr-2 ${
                                  student.attendance === "present"
                                    ? "bg-green-500"
                                    : student.attendance === "absent"
                                      ? "bg-red-500"
                                      : "bg-amber-500"
                                }`}
                              ></div>
                              <span>{student.attendance.charAt(0).toUpperCase() + student.attendance.slice(1)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAttendance(student.id)}
                              className={
                                student.attendance === "present"
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
                <div className="flex items-center gap-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">
                      Present: {students.filter((s) => s.attendance === "present").length}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm">Absent: {students.filter((s) => s.attendance === "absent").length}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span className="text-sm">Leave: {students.filter((s) => s.attendance === "leave").length}</span>
                  </div>
                </div>
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
            </>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Class Selected</h3>
              <p className="text-sm text-muted-foreground mt-1">Please select a class and subject to mark attendance</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription>{successMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
