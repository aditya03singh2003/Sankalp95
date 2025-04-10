"use client"

import { useState, useEffect } from "react"
import { format, addDays, subDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AttendancePage() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(false)
  const [teachers, setTeachers] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [teacherAttendance, setTeacherAttendance] = useState<{
    [key: string]: string
  }>({})
  const [studentAttendance, setStudentAttendance] = useState<{
    [key: string]: string
  }>({})
  const [loadingTeachers, setLoadingTeachers] = useState(false)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true)
        setError(null)
        const response = await fetch("/api/classes")
        if (response.ok) {
          const data = await response.json()
          setClasses(data)

          // Set default class if available
          if (data.length > 0 && !selectedClass) {
            setSelectedClass(data[0].name)
          }
        } else {
          console.error("Failed to fetch classes")
          const errorText = await response.text()
          console.error("Error response:", errorText)
          setError("Failed to fetch classes")
          toast({
            title: "Error",
            description: "Failed to fetch classes",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching classes:", error)
        setError(`Error fetching classes: ${error.message}`)
        toast({
          title: "Error",
          description: `Failed to fetch classes: ${error.message}`,
          variant: "destructive",
        })
      } finally {
        setLoadingClasses(false)
      }
    }

    fetchClasses()
  }, [toast])

  // Fetch subjects when class changes
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedClass) return

      try {
        setLoadingSubjects(true)
        setError(null)
        const response = await fetch(`/api/subjects?class=${selectedClass}`)
        if (response.ok) {
          const data = await response.json()
          setSubjects(data)

          // If there's at least one subject, select the first one by default
          if (data.length > 0 && !selectedSubject) {
            setSelectedSubject(data[0].name)
          }
        } else {
          console.error("Failed to fetch subjects")
          const errorText = await response.text()
          console.error("Error response:", errorText)
          setError("Failed to fetch subjects")
          toast({
            title: "Error",
            description: "Failed to fetch subjects",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching subjects:", error)
        setError(`Error fetching subjects: ${error.message}`)
        toast({
          title: "Error",
          description: `Failed to fetch subjects: ${error.message}`,
          variant: "destructive",
        })
      } finally {
        setLoadingSubjects(false)
      }
    }

    fetchSubjects()
  }, [selectedClass, toast])

  // Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoadingTeachers(true)
        setError(null)
        const response = await fetch("/api/teachers")
        if (response.ok) {
          const data = await response.json()
          console.log("Teachers data:", data)
          setTeachers(data)

          // Fetch existing attendance for teachers
          const attendanceDate = format(date, "yyyy-MM-dd")
          const attendanceResponse = await fetch(`/api/attendance/teacher?date=${attendanceDate}`)

          if (attendanceResponse.ok) {
            const attendanceData = await attendanceResponse.json()
            console.log("Teacher attendance data:", attendanceData)

            // Create a map of teacher ID to attendance status
            const attendanceMap: { [key: string]: string } = {}

            // Initialize all teachers as absent by default
            data.forEach((teacher: any) => {
              attendanceMap[teacher._id] = "absent"
            })

            // Then update with actual attendance records
            attendanceData.forEach((record: any) => {
              attendanceMap[record.teacherId] = record.status || "absent"
            })

            setTeacherAttendance(attendanceMap)
          } else {
            console.error("Failed to fetch teacher attendance")
            const errorText = await attendanceResponse.text()
            console.error("Error response:", errorText)

            // If no attendance records for today, try to get yesterday's records
            const yesterdayDate = format(subDays(date, 1), "yyyy-MM-dd")
            const yesterdayResponse = await fetch(`/api/attendance/teacher?date=${yesterdayDate}`)

            if (yesterdayResponse.ok) {
              const yesterdayData = await yesterdayResponse.json()

              // Initialize with yesterday's attendance
              const attendanceMap: { [key: string]: string } = {}

              // Initialize all teachers with yesterday's status or absent
              data.forEach((teacher: any) => {
                const yesterdayRecord = yesterdayData.find((record: any) => record.teacherId === teacher._id)
                attendanceMap[teacher._id] = yesterdayRecord ? yesterdayRecord.status : "absent"
              })

              setTeacherAttendance(attendanceMap)
            } else {
              // If no yesterday's data either, initialize all as absent
              const attendanceMap: { [key: string]: string } = {}
              data.forEach((teacher: any) => {
                attendanceMap[teacher._id] = "absent"
              })
              setTeacherAttendance(attendanceMap)
            }
          }
        } else {
          console.error("Failed to fetch teachers")
          const errorText = await response.text()
          console.error("Error response:", errorText)
          setError("Failed to fetch teachers")
          toast({
            title: "Error",
            description: "Failed to fetch teachers",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching teachers:", error)
        setError(`Error fetching teachers: ${error.message}`)
        toast({
          title: "Error",
          description: `Failed to fetch teachers: ${error.message}`,
          variant: "destructive",
        })
      } finally {
        setLoadingTeachers(false)
      }
    }

    fetchTeachers()
  }, [date, toast])

  // Fetch students based on class and subject
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return

      try {
        setLoadingStudents(true)
        setError(null)

        // First fetch all students in the selected class
        const studentsUrl = `/api/students?class=${selectedClass}`
        console.log("Fetching students from:", studentsUrl)

        const studentsResponse = await fetch(studentsUrl)

        if (!studentsResponse.ok) {
          console.error("Failed to fetch students")
          const errorText = await studentsResponse.text()
          console.error("Error response:", errorText)
          setError("Failed to fetch students")
          toast({
            title: "Error",
            description: "Failed to fetch students",
            variant: "destructive",
          })
          setStudents([])
          return
        }

        const studentsData = await studentsResponse.json()
        console.log("Students data:", studentsData)
        setStudents(studentsData)

        // Then fetch attendance data if we have students and a subject selected
        if (studentsData.length > 0 && selectedSubject) {
          const attendanceDate = format(date, "yyyy-MM-dd")
          const attendanceUrl = `/api/attendance/students?date=${attendanceDate}&class=${selectedClass}&subject=${selectedSubject}`
          console.log("Fetching attendance from:", attendanceUrl)

          const attendanceResponse = await fetch(attendanceUrl)

          if (attendanceResponse.ok) {
            const attendanceData = await attendanceResponse.json()
            console.log("Student attendance data:", attendanceData)

            // Create a map of student ID to attendance status
            const attendanceMap: { [key: string]: string } = {}

            // Initialize all students as absent by default
            studentsData.forEach((student: any) => {
              attendanceMap[student._id] = "absent"
            })

            // Check if attendanceData is an array (new format) or has students property (old format)
            if (Array.isArray(attendanceData)) {
              // New format - direct array of attendance records
              attendanceData.forEach((record: any) => {
                const studentId = record.studentId?.toString()
                if (studentId) {
                  attendanceMap[studentId] = record.status || "absent"
                }
              })
            } else if (attendanceData.students && Array.isArray(attendanceData.students)) {
              // Old format with students property
              attendanceData.students.forEach((student: any) => {
                attendanceMap[student.id] = student.attendance || "absent"
              })
            }

            setStudentAttendance(attendanceMap)
          } else {
            console.error("Failed to fetch student attendance")
            const errorText = await attendanceResponse.text()
            console.error("Error response:", errorText)

            // If no attendance records for today, try to get yesterday's records
            const yesterdayDate = format(subDays(date, 1), "yyyy-MM-dd")
            const yesterdayUrl = `/api/attendance/students?date=${yesterdayDate}&class=${selectedClass}&subject=${selectedSubject}`

            const yesterdayResponse = await fetch(yesterdayUrl)

            if (yesterdayResponse.ok) {
              const yesterdayData = await yesterdayResponse.json()

              // Initialize with yesterday's attendance
              const attendanceMap: { [key: string]: string } = {}

              // Initialize all students with yesterday's status or absent
              studentsData.forEach((student: any) => {
                if (Array.isArray(yesterdayData)) {
                  // New format - direct array of attendance records
                  const yesterdayRecord = yesterdayData.find(
                    (record: any) => record.studentId?.toString() === student._id.toString(),
                  )
                  attendanceMap[student._id] = yesterdayRecord ? yesterdayRecord.status : "absent"
                } else if (yesterdayData.students && Array.isArray(yesterdayData.students)) {
                  // Old format with students property
                  const yesterdayRecord = yesterdayData.students.find((s: any) => s.id === student._id)
                  attendanceMap[student._id] = yesterdayRecord ? yesterdayRecord.attendance : "absent"
                } else {
                  attendanceMap[student._id] = "absent"
                }
              })

              setStudentAttendance(attendanceMap)
            } else {
              // If no yesterday's data either, initialize all as absent
              const attendanceMap: { [key: string]: string } = {}
              studentsData.forEach((student: any) => {
                attendanceMap[student._id] = "absent"
              })
              setStudentAttendance(attendanceMap)
            }
          }
        }
      } catch (error) {
        console.error("Error in student attendance flow:", error)
        setError(`Error fetching student data: ${error.message}`)
        toast({
          title: "Error",
          description: `Failed to fetch student data: ${error.message}`,
          variant: "destructive",
        })
        setStudents([])
      } finally {
        setLoadingStudents(false)
      }
    }

    fetchStudents()
  }, [selectedClass, selectedSubject, date, toast])

  const handlePreviousDay = () => {
    setDate(subDays(date, 1))
  }

  const handleNextDay = () => {
    setDate(addDays(date, 1))
  }

  const toggleTeacherAttendance = (teacherId: string) => {
    setTeacherAttendance((prev) => {
      const currentStatus = prev[teacherId] || "absent"
      let newStatus = "absent"

      if (currentStatus === "absent") newStatus = "present"
      else if (currentStatus === "present") newStatus = "leave"
      else if (currentStatus === "leave") newStatus = "absent"

      return {
        ...prev,
        [teacherId]: newStatus,
      }
    })
  }

  const toggleStudentAttendance = (studentId: string) => {
    setStudentAttendance((prev) => {
      const currentStatus = prev[studentId] || "absent"
      let newStatus = "absent"

      if (currentStatus === "absent") newStatus = "present"
      else if (currentStatus === "present") newStatus = "leave"
      else if (currentStatus === "leave") newStatus = "absent"

      return {
        ...prev,
        [studentId]: newStatus,
      }
    })
  }

  const saveTeacherAttendance = async () => {
    try {
      setLoading(true)
      setError(null)

      // Only include teachers that have attendance status set
      const attendanceData = Object.entries(teacherAttendance)
        .filter(([teacherId]) => teachers.some((t) => t._id === teacherId))
        .map(([teacherId, status]) => ({
          teacherId,
          date: format(date, "yyyy-MM-dd"),
          status,
        }))

      console.log("Saving teacher attendance:", attendanceData)

      if (attendanceData.length === 0) {
        toast({
          title: "Warning",
          description: "No attendance data to save",
          variant: "default",
        })
        setLoading(false)
        return
      }

      const response = await fetch("/api/attendance/teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ attendance: attendanceData }),
      })

      const result = await response.json()

      if (response.ok) {
        console.log("Teacher attendance saved:", result)

        // Show success toast that disappears after 2 seconds
        toast({
          title: "Success",
          description: "Teacher attendance saved successfully",
          duration: 2000, // 2 seconds
        })

        // Refresh the attendance data
        const attendanceDate = format(date, "yyyy-MM-dd")
        const refreshResponse = await fetch(`/api/attendance/teacher?date=${attendanceDate}`)

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json()

          // Update the attendance map
          const attendanceMap: { [key: string]: string } = {}
          refreshData.forEach((record: any) => {
            attendanceMap[record.teacherId] = record.status || "absent"
          })

          setTeacherAttendance(attendanceMap)
        }
      } else {
        console.error("Failed to save teacher attendance:", result)
        setError(result.error || "Failed to save attendance")
        toast({
          title: "Error",
          description: result.error || "Failed to save attendance",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error saving teacher attendance:", error)
      setError(`Error saving teacher attendance: ${error.message}`)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save attendance",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveStudentAttendance = async () => {
    try {
      if (!selectedClass || !selectedSubject) {
        toast({
          title: "Warning",
          description: "Please select both class and subject",
          variant: "default",
        })
        return
      }

      setLoading(true)
      setError(null)

      // Only include students that have attendance status set
      const attendanceData = Object.entries(studentAttendance)
        .filter(([studentId]) => students.some((s) => s._id === studentId))
        .map(([studentId, status]) => ({
          studentId,
          date: format(date, "yyyy-MM-dd"),
          class: selectedClass,
          subject: selectedSubject,
          status,
        }))

      console.log("Saving student attendance:", attendanceData)

      if (attendanceData.length === 0) {
        toast({
          title: "Warning",
          description: "No attendance data to save",
          variant: "default",
        })
        setLoading(false)
        return
      }

      const response = await fetch("/api/attendance/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attendance: attendanceData,
          date: format(date, "yyyy-MM-dd"),
          class: selectedClass,
          subject: selectedSubject,
        }),
      })

      let result
      try {
        result = await response.json()
      } catch (error) {
        console.error("Failed to parse response:", error)
        toast({
          title: "Error",
          description: "Failed to process server response",
          variant: "destructive",
        })
        return
      }

      if (response.ok) {
        console.log("Student attendance saved:", result)

        // Show success toast that disappears after 2 seconds
        toast({
          title: "Success",
          description: "Student attendance saved successfully",
          duration: 2000, // 2 seconds
        })

        // Refresh the attendance data
        if (students.length > 0 && selectedSubject) {
          const attendanceDate = format(date, "yyyy-MM-dd")
          const refreshUrl = `/api/attendance/students?date=${attendanceDate}&class=${selectedClass}&subject=${selectedSubject}`

          const refreshResponse = await fetch(refreshUrl)

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json()

            // Update the attendance map
            const attendanceMap: { [key: string]: string } = {}
            refreshData.students.forEach((student: any) => {
              attendanceMap[student.id] = student.attendance || "absent"
            })

            setStudentAttendance(attendanceMap)
          }
        }
      } else {
        console.error("Failed to save student attendance:", result)
        setError(result.error || "Failed to save attendance")
        toast({
          title: "Error",
          description: result.error || "Failed to save attendance",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving student attendance:", error)
      setError(`Error saving student attendance: ${error.message}`)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save attendance",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-500 text-white hover:bg-green-600"
      case "absent":
        return "bg-red-500 text-white hover:bg-red-600"
      case "leave":
        return "bg-amber-500 text-white hover:bg-amber-600"
      default:
        return "bg-gray-500 text-white hover:bg-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 mr-1" />
      case "absent":
        return <XCircle className="h-4 w-4 mr-1" />
      case "leave":
        return <Clock className="h-4 w-4 mr-1" />
      default:
        return <XCircle className="h-4 w-4 mr-1" />
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Attendance Management</h1>

      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-md flex items-center text-red-800">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Date Selection</CardTitle>
            <CardDescription>Select a date to manage attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={handlePreviousDay}>
                  Previous Day
                </Button>
                <span className="font-medium">{format(date, "EEEE, MMMM d, yyyy")}</span>
                <Button variant="outline" onClick={handleNextDay}>
                  Next Day
                </Button>
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                className="rounded-md border"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>Manage attendance for teachers and students</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="teachers">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="teachers">Teachers</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
              </TabsList>

              <TabsContent value="teachers" className="mt-4">
                <div className="space-y-4">
                  {loadingTeachers ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : teachers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No teachers found</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-4">
                        {teachers.map((teacher) => (
                          <div key={teacher._id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-medium">{teacher.name}</h3>
                              <p className="text-sm text-muted-foreground">{teacher.email}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={`cursor-pointer ${getStatusBadgeColor(teacherAttendance[teacher._id] || "absent")}`}
                                onClick={() => toggleTeacherAttendance(teacher._id)}
                              >
                                {getStatusIcon(teacherAttendance[teacher._id] || "absent")}
                                {(teacherAttendance[teacher._id] || "absent").charAt(0).toUpperCase() +
                                  (teacherAttendance[teacher._id] || "absent").slice(1)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full" onClick={saveTeacherAttendance} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Teacher Attendance
                      </Button>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="students" className="mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Select Class</label>
                      <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingClasses ? (
                            <div className="flex justify-center py-2">
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            </div>
                          ) : (
                            classes.map((cls) => (
                              <SelectItem key={cls._id || cls.name} value={cls.name}>
                                {cls.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Select Subject</label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClass}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingSubjects ? (
                            <div className="flex justify-center py-2">
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            </div>
                          ) : (
                            subjects.map((subject) => (
                              <SelectItem key={subject._id || subject.name} value={subject.name}>
                                {subject.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {!selectedClass ? (
                    <div className="text-center py-8 text-muted-foreground">Please select a class to view students</div>
                  ) : loadingStudents ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : students.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No students found for the selected criteria
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-4">
                        {students.map((student) => (
                          <div key={student._id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-medium">{student.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {student.email || "No email"} • Class: {student.class || "Unknown"}
                                {student.rollNumber && ` • Roll: ${student.rollNumber}`}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={`cursor-pointer ${getStatusBadgeColor(studentAttendance[student._id] || "absent")}`}
                                onClick={() => toggleStudentAttendance(student._id)}
                              >
                                {getStatusIcon(studentAttendance[student._id] || "absent")}
                                {(studentAttendance[student._id] || "absent").charAt(0).toUpperCase() +
                                  (studentAttendance[student._id] || "absent").slice(1)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        className="w-full"
                        onClick={saveStudentAttendance}
                        disabled={loading || !selectedClass || !selectedSubject}
                      >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Student Attendance
                      </Button>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
