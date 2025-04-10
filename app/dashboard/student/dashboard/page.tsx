"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import { Calendar, Clock, FileText, GraduationCap, Users, BookOpen, Loader2, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function StudentDashboardPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [studentData, setStudentData] = useState(null)
  const [scheduleData, setScheduleData] = useState([])
  const [examData, setExamData] = useState([])
  const [eventData, setEventData] = useState([])
  const [attendanceData, setAttendanceData] = useState({
    present: 0,
    absent: 0,
    leave: 0,
    total: 0,
    percentage: 0,
    records: [],
  })

  useEffect(() => {
    if (session?.user?.id) {
      setLoading(true)
      Promise.all([
        fetchStudentData(),
        fetchScheduleData(),
        fetchExamData(),
        fetchEventData(),
        fetchAttendanceData(),
      ]).finally(() => {
        setLoading(false)
      })
    }
  }, [session])

  const fetchStudentData = async () => {
    try {
      const response = await fetch(`/api/students/${session.user.id}`)
      if (response.ok) {
        const data = await response.json()
        setStudentData(data)
        return data
      }
    } catch (error) {
      console.error("Error fetching student data:", error)
      toast({
        title: "Error",
        description: "Failed to load student data",
        variant: "destructive",
      })
    }
    return null
  }

  const fetchScheduleData = async () => {
    try {
      // Try to fetch schedule for the student, if this API exists
      const studentId = session.user.id
      let response = await fetch(`/api/students/${studentId}/schedule`)

      // If that doesn't work, get all schedules
      if (!response.ok) {
        response = await fetch("/api/schedule")
      }

      if (!response.ok) {
        throw new Error("Failed to fetch schedule data")
      }

      const data = await response.json()
      setScheduleData(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching schedule data:", error)
      toast({
        title: "Error",
        description: "Failed to load schedule data",
        variant: "destructive",
      })
      setScheduleData([])
    }
  }

  const fetchExamData = async () => {
    try {
      // Try specific student endpoint first
      const studentId = session.user.id
      let response = await fetch(`/api/students/${studentId}/exams`)

      // If that doesn't work, get all exams
      if (!response.ok) {
        response = await fetch("/api/exams")
      }

      if (!response.ok) {
        throw new Error("Failed to fetch exam data")
      }

      const data = await response.json()
      setExamData(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching exam data:", error)
      toast({
        title: "Error",
        description: "Failed to load exam data",
        variant: "destructive",
      })
      setExamData([])
    }
  }

  const fetchEventData = async () => {
    try {
      // Try specific student endpoint first
      const studentId = session.user.id
      let response = await fetch(`/api/students/${studentId}/events`)

      // If that doesn't work, get all events
      if (!response.ok) {
        response = await fetch("/api/events")
      }

      if (!response.ok) {
        throw new Error("Failed to fetch event data")
      }

      const data = await response.json()
      setEventData(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching event data:", error)
      toast({
        title: "Error",
        description: "Failed to load event data",
        variant: "destructive",
      })
      setEventData([])
    }
  }

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(`/api/students/${session.user.id}/attendance/summary`)
      if (response.ok) {
        const data = await response.json()
        setAttendanceData({
          present: data.presentCount || 0,
          absent: data.absentCount || 0,
          leave: data.leaveCount || 0,
          total: data.totalCount || 0,
          percentage: data.presentPercentage || 0,
          records: data.recentRecords || [],
        })
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error)
      toast({
        title: "Error",
        description: "Failed to load attendance data",
        variant: "destructive",
      })
    }
  }

  const getTodaySchedule = () => {
    if (!Array.isArray(scheduleData)) return []
    const today = new Date().getDay()
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return scheduleData.filter((item) => item.day === dayNames[today])
  }

  const getUpcomingExams = () => {
    if (!Array.isArray(examData)) return []
    const today = new Date()
    return examData
      .filter((exam) => new Date(exam.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3)
  }

  const getUpcomingEvents = () => {
    if (!Array.isArray(eventData)) return []
    const today = new Date()
    return eventData
      .filter((event) => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3)
  }

  const formatDate = (date) => {
    try {
      return format(new Date(date), "MMM d, yyyy")
    } catch (error) {
      return date
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Student Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, {studentData?.name || session?.user?.name || "Student"}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceData.percentage}%</div>
            <p className="text-xs text-muted-foreground">
              Present: {attendanceData.present} / {attendanceData.total} days
            </p>
            <Progress value={attendanceData.percentage} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{examData.length}</div>
            <p className="text-xs text-muted-foreground">
              Next: {examData.length > 0 ? formatDate(examData[0]?.date) : "None scheduled"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Today</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTodaySchedule().length}</div>
            <p className="text-xs text-muted-foreground">
              {getTodaySchedule().length > 0
                ? `First: ${getTodaySchedule()[0]?.subject} at ${getTodaySchedule()[0]?.startTime}`
                : "No classes today"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Special Events</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventData.length}</div>
            <p className="text-xs text-muted-foreground">
              Next: {eventData.length > 0 ? formatDate(eventData[0]?.date) : "None scheduled"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Weekly Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="exams" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Upcoming Exams</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Special Events</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Attendance History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Your classes for the week</CardDescription>
            </CardHeader>
            <CardContent>
              {scheduleData.length > 0 ? (
                <div className="space-y-4">
                  {scheduleData.map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{schedule.subject}</p>
                          <p className="text-sm text-muted-foreground">{schedule.teacher}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{`${schedule.startTime || ""} - ${schedule.endTime || ""}`}</p>
                        <p className="text-sm text-muted-foreground">{schedule.day}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No scheduled classes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Exams</CardTitle>
              <CardDescription>Prepare for your upcoming exams</CardDescription>
            </CardHeader>
            <CardContent>
              {examData.length > 0 ? (
                <div className="space-y-4">
                  {getUpcomingExams().map((exam, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{exam.subject}</p>
                          <p className="text-sm text-muted-foreground">{exam.topic || exam.type || "Exam"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatDate(exam.date)}</p>
                        <p className="text-sm text-muted-foreground">{exam.time || "TBD"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No upcoming exams</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Special Events</CardTitle>
              <CardDescription>Upcoming events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              {eventData.length > 0 ? (
                <div className="space-y-4">
                  {getUpcomingEvents().map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{event.title || event.name}</p>
                          <p className="text-sm text-muted-foreground">{event.description || "Event"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatDate(event.date)}</p>
                        <p className="text-sm text-muted-foreground">{event.location || event.venue || "TBD"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No upcoming events</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>Your recent attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                  <p className="text-green-600 dark:text-green-400 text-2xl font-bold">{attendanceData.present}</p>
                  <p className="text-green-600 dark:text-green-400">Present</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                  <p className="text-red-600 dark:text-red-400 text-2xl font-bold">{attendanceData.absent}</p>
                  <p className="text-red-600 dark:text-red-400">Absent</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                  <p className="text-blue-600 dark:text-blue-400 text-2xl font-bold">{attendanceData.percentage}%</p>
                  <p className="text-blue-600 dark:text-blue-400">Attendance</p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Recent Attendance</h3>
                {attendanceData.records && attendanceData.records.length > 0 ? (
                  <div className="space-y-2">
                    {attendanceData.records.map((record, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded-lg border">
                        <div className="flex items-center gap-2">
                          {record.status === "present" ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span>{formatDate(record.date)}</span>
                        </div>
                        <Badge variant={record.status === "present" ? "default" : "destructive"}>{record.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No recent attendance records</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
