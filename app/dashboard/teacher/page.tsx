"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Calendar, Clock, Users, Video, FileText, Loader2, GraduationCap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

export default function TeacherDashboardPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [teacherData, setTeacherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scheduleData, setScheduleData] = useState([])
  const [examData, setExamData] = useState([])
  const [eventData, setEventData] = useState([])
  const [upcomingClasses, setUpcomingClasses] = useState([])
  const [recentActivities, setRecentActivities] = useState([])

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role !== "teacher") {
        redirect("/dashboard")
      }

      // Fetch teacher data
      const fetchTeacherData = async () => {
        try {
          const response = await fetch(`/api/users/${session.user.id}`)
          if (response.ok) {
            const data = await response.json()
            setTeacherData(data)
          } else {
            console.error("Failed to fetch teacher data")
            toast({
              title: "Error",
              description: "Failed to load teacher data",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Error fetching teacher data:", error)
          toast({
            title: "Error",
            description: "Failed to load teacher data",
            variant: "destructive",
          })
        }
      }

      // Fetch schedule data
      const fetchScheduleData = async () => {
        try {
          const response = await fetch(`/api/teachers/${session.user.id}/schedule`)
          if (response.ok) {
            const data = await response.json()
            setScheduleData(data)

            // Get today's classes
            const today = new Date().getDay()
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            const todayClasses = data.filter((item) => item.day === dayNames[today])
            setUpcomingClasses(todayClasses)
          } else {
            console.error("Failed to fetch schedule data")
          }
        } catch (error) {
          console.error("Error fetching schedule data:", error)
        }
      }

      // Fetch exam data
      const fetchExamData = async () => {
        try {
          const response = await fetch(`/api/teachers/${session.user.id}/exams`)
          if (response.ok) {
            const data = await response.json()
            setExamData(data)
          } else {
            console.error("Failed to fetch exam data")
          }
        } catch (error) {
          console.error("Error fetching exam data:", error)
        }
      }

      // Fetch event data
      const fetchEventData = async () => {
        try {
          const response = await fetch(`/api/teachers/${session.user.id}/events`)
          if (response.ok) {
            const data = await response.json()
            setEventData(data)
          } else {
            console.error("Failed to fetch event data")
          }
        } catch (error) {
          console.error("Error fetching event data:", error)
        }
      }

      // Fetch recent activities
      const fetchRecentActivities = async () => {
        try {
          const response = await fetch(`/api/teachers/${session.user.id}/activities`)
          if (response.ok) {
            const data = await response.json()
            setRecentActivities(data)
          } else {
            // Fallback to sample data if API not implemented yet
            setRecentActivities([
              {
                id: 1,
                activity: "Marked Attendance",
                details: "Class 11 - Physics",
                time: "2 hours ago",
              },
              {
                id: 2,
                activity: "Uploaded Lecture",
                details: "Laws of Motion - Class 11",
                time: "Yesterday",
              },
              {
                id: 3,
                activity: "Graded Assignments",
                details: "Mathematics - Class 12",
                time: "2 days ago",
              },
              {
                id: 4,
                activity: "Conducted Test",
                details: "Physics - Class 12",
                time: "3 days ago",
              },
            ])
          }
        } catch (error) {
          console.error("Error fetching activities:", error)
        }
      }

      Promise.all([
        fetchTeacherData(),
        fetchScheduleData(),
        fetchExamData(),
        fetchEventData(),
        fetchRecentActivities(),
      ]).finally(() => {
        setLoading(false)
      })
    } else if (status === "unauthenticated") {
      redirect("/login")
    }
  }, [status, session, toast])

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading teacher dashboard...</span>
      </div>
    )
  }

  // Sample data for student performance
  const studentPerformance = [
    { grade: "Class 11", subject: "Physics", averageScore: 78, attendance: 92 },
    { grade: "Class 12", subject: "Physics", averageScore: 82, attendance: 88 },
    { grade: "Class 12", subject: "Mathematics", averageScore: 75, attendance: 90 },
  ]

  // Sample data for pending tasks
  const pendingTasks = [
    {
      id: 1,
      task: "Grade Physics assignments",
      deadline: "Today",
      priority: "High",
    },
    {
      id: 2,
      task: "Prepare test for Class 12",
      deadline: "Tomorrow",
      priority: "Medium",
    },
    {
      id: 3,
      task: "Upload lecture notes",
      deadline: "This week",
      priority: "Medium",
    },
  ]

  const userName = teacherData?.teacher?.name || session.user.name || "Teacher"

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 bg-gradient-to-r from-sankalp-100 to-sankalp-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back, {userName}!</h2>
            <p className="text-muted-foreground">Here's what's happening with your classes today.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/teacher/schedule">
              <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white">
                <Calendar className="mr-2 h-4 w-4" />
                View Schedule
              </Button>
            </Link>
            <Link href="/dashboard/teacher/live-classes">
              <Button size="sm" className="bg-sankalp-600 hover:bg-sankalp-700 text-black">
                <Video className="mr-2 h-4 w-4" />
                Start Live Class
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <Video className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingClasses.length > 0
                ? `Next class: ${upcomingClasses[0].subject} at ${upcomingClasses[0].startTime}`
                : "No classes today"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherData?.studentCount || 0}</div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{examData.length}</div>
            <p className="text-xs text-muted-foreground">
              {examData.length > 0 ? `Next: ${format(new Date(examData[0].date), "MMM d")}` : "No upcoming exams"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingTasks.filter((t) => t.priority === "High").length} high priority
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>Your scheduled classes for the next few days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.length > 0 ? (
                upcomingClasses.map((cls, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 rounded-md border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">{cls.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        Today • {cls.startTime} - {cls.endTime}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{cls.location || "Room not specified"}</span>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <Button size="sm" className="bg-sankalp-600 hover:bg-sankalp-700 text-black">
                        Start
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No classes scheduled for today</div>
              )}
              <div className="text-center">
                <Link href="/dashboard/teacher/schedule">
                  <Button variant="outline">View All Classes</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent teaching activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">{activity.activity}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.details} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Performance</CardTitle>
            <CardDescription>Average scores and attendance by class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentPerformance.map((performance, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <GraduationCap className="mr-2 h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {performance.grade} - {performance.subject}
                      </span>
                    </div>
                    <Badge variant={performance.averageScore >= 80 ? "success" : "default"}>
                      {performance.averageScore}%
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Average Score</span>
                      <span>{performance.averageScore}%</span>
                    </div>
                    <Progress value={performance.averageScore} className="h-1" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Attendance</span>
                      <span>{performance.attendance}%</span>
                    </div>
                    <Progress value={performance.attendance} className="h-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>Tasks that require your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium">{task.task}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span
                        className={`mr-2 h-2 w-2 rounded-full ${
                          task.priority === "High" ? "bg-red-500" : "bg-yellow-500"
                        }`}
                      />
                      {task.priority} Priority • Due {task.deadline}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Complete
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
