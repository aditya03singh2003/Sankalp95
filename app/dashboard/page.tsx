"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  Calendar,
  Clock,
  CreditCard,
  Users,
  Video,
  FileText,
  Beaker,
  Award,
  GraduationCap,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated") {
      // Fetch user data based on role
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/users/${session.user.id}`)
          if (response.ok) {
            const data = await response.json()
            setUserData(data)
          } else {
            console.error("Failed to fetch user data")
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchUserData()
    } else if (status === "unauthenticated") {
      redirect("/login")
    }
  }, [status, session])

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    )
  }

  if (!session) {
    redirect("/login")
  }

  // Redirect to appropriate dashboard based on role
  if (session.user.role === "admin") {
    redirect("/dashboard/admin")
  } else if (session.user.role === "teacher") {
    redirect("/dashboard/teacher")
  } else if (session.user.role === "parent") {
    redirect("/dashboard/parent")
  }

  // Student dashboard (default)
  const studentData = userData?.student || {}
  const userName = studentData.name || session.user.name || "Student"

  // Update the upcoming classes section with more detailed information
  const upcomingClasses = [
    {
      id: 1,
      subject: "Mathematics",
      topic: "Quadratic Equations",
      date: "Today",
      time: "4:00 PM - 5:30 PM",
      teacher: "Dr. Amit Kumar",
      room: "Room 101",
      materials: ["Textbook Ch. 5", "Practice Sheet"],
      joinLink: "https://meet.google.com/abc-defg-hij",
    },
    {
      id: 2,
      subject: "Physics",
      topic: "Laws of Motion",
      date: "Tomorrow",
      time: "2:00 PM - 3:30 PM",
      teacher: "Mrs. Priya Singh",
      room: "Room 103",
      materials: ["Textbook Ch. 3", "Lab Manual"],
      joinLink: "https://meet.google.com/klm-nopq-rst",
    },
    {
      id: 3,
      subject: "Chemistry",
      topic: "Periodic Table",
      date: "Wed, 27 Mar",
      time: "5:00 PM - 6:30 PM",
      teacher: "Mr. Rajesh Verma",
      room: "Room 105",
      materials: ["Textbook Ch. 4", "Element Chart"],
      joinLink: "https://meet.google.com/uvw-xyz-123",
    },
  ]

  // Update the recent activities with more detailed information
  const recentActivities = [
    {
      id: 1,
      activity: "Completed Assignment",
      subject: "Mathematics",
      topic: "Quadratic Equations",
      time: "2 hours ago",
      score: "18/20",
      feedback: "Good work! Just a few minor errors.",
    },
    {
      id: 2,
      activity: "Watched Lecture",
      subject: "Physics - Wave Motion",
      duration: "45 minutes",
      time: "Yesterday",
      progress: "100%",
      notes: "Made notes on interference patterns",
    },
    {
      id: 3,
      activity: "Attended Live Class",
      subject: "Chemistry - Organic Chemistry",
      time: "2 days ago",
      duration: "1.5 hours",
      participation: "Asked 3 questions",
    },
    {
      id: 4,
      activity: "Submitted Quiz",
      subject: "Mathematics - Calculus",
      time: "3 days ago",
      score: "9/10",
      feedback: "Excellent understanding of derivatives",
    },
  ]

  // Add subject progress data
  const subjectProgress = [
    { subject: "Mathematics", progress: 78, totalTopics: 45, completedTopics: 35 },
    { subject: "Physics", progress: 65, totalTopics: 40, completedTopics: 26 },
    { subject: "Chemistry", progress: 82, totalTopics: 38, completedTopics: 31 },
    { subject: "Biology", progress: 70, totalTopics: 42, completedTopics: 29 },
    { subject: "English", progress: 90, totalTopics: 30, completedTopics: 27 },
  ]

  // Add recent achievements
  const recentAchievements = [
    { id: 1, title: "Perfect Attendance", date: "March 2023", icon: <Award className="h-8 w-8 text-yellow-500" /> },
    { id: 2, title: "Top Scorer - Physics", date: "February 2023", icon: <Award className="h-8 w-8 text-blue-500" /> },
    { id: 3, title: "Quiz Champion", date: "January 2023", icon: <Award className="h-8 w-8 text-green-500" /> },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 bg-gradient-to-r from-sankalp-100 to-sankalp-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back, {userName}!</h2>
            <p className="text-muted-foreground">Here's what's happening with your studies today.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/schedule">
              <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white">
                <Calendar className="mr-2 h-4 w-4" />
                View Schedule
              </Button>
            </Link>
            <Link href="/dashboard/live-classes">
              <Button size="sm" className="bg-sankalp-600 hover:bg-sankalp-700 text-black">
                <Video className="mr-2 h-4 w-4" />
                Join Live Class
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
            <Video className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next class in 2 hours</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentData.attendanceRate ? `${studentData.attendanceRate}%` : "92%"}
            </div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Lectures</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24/30</div>
            <p className="text-xs text-muted-foreground">6 lectures remaining</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {studentData.fees && studentData.fees.length > 0 && studentData.fees[0].status === "Paid"
                ? "Paid"
                : "Pending"}
            </div>
            <p className="text-xs text-muted-foreground">Next due: {studentData.nextDueDate || "15 Apr 2023"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Progress</CardTitle>
          <CardDescription>Your progress across different subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectProgress.map((subject) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span className="font-medium">{subject.subject}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {subject.completedTopics}/{subject.totalTopics} topics
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={subject.progress} className="h-2" />
                  <span className="text-sm font-medium">{subject.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>Your scheduled live classes for the next few days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-start space-x-4 rounded-md border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">
                      {cls.subject}: {cls.topic}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {cls.date} • {cls.time}
                    </p>
                    <p className="text-sm text-muted-foreground">Teacher: {cls.teacher}</p>
                    <p className="text-sm text-muted-foreground">Location: {cls.room}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {cls.materials.map((material, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <Button size="sm" className="bg-sankalp-600 hover:bg-sankalp-700 text-black">
                      <a href={cls.joinLink} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        Join
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
              <div className="text-center">
                <Link href="/dashboard/schedule">
                  <Button variant="outline">View All Classes</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{activity.activity}</p>
                      {activity.score && (
                        <Badge
                          variant={
                            Number.parseFloat(activity.score.split("/")[0]) /
                              Number.parseFloat(activity.score.split("/")[1]) >=
                            0.8
                              ? "success"
                              : "default"
                          }
                        >
                          {activity.score}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.subject} • {activity.time}
                    </p>
                    {activity.feedback && <p className="text-xs text-muted-foreground italic">"{activity.feedback}"</p>}
                    {activity.duration && (
                      <p className="text-xs text-muted-foreground">Duration: {activity.duration}</p>
                    )}
                    {activity.progress && (
                      <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: activity.progress }}></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
          <CardDescription>Your academic accomplishments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex flex-col items-center justify-center p-4 rounded-lg border text-center hover:bg-muted/50 transition-colors"
              >
                {achievement.icon}
                <h3 className="mt-2 font-medium">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground">{achievement.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Assessments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Assessments</CardTitle>
          <CardDescription>Tests and assignments scheduled for the next week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 rounded-md border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Mathematics Quiz</p>
                <p className="text-sm text-muted-foreground">Friday, 29 Mar • 4:00 PM</p>
                <p className="text-sm text-muted-foreground">Topics: Quadratic Equations, Polynomials</p>
                <Badge variant="outline" className="mt-1">
                  20 minutes
                </Badge>
              </div>
            </div>
            <div className="flex items-start space-x-4 rounded-md border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Physics Assignment</p>
                <p className="text-sm text-muted-foreground">Due: Monday, 1 Apr • 11:59 PM</p>
                <p className="text-sm text-muted-foreground">Topics: Laws of Motion, Friction</p>
                <Badge variant="outline" className="mt-1">
                  10 questions
                </Badge>
              </div>
            </div>
            <div className="flex items-start space-x-4 rounded-md border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Beaker className="h-5 w-5 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Chemistry Lab Report</p>
                <p className="text-sm text-muted-foreground">Due: Wednesday, 3 Apr • 5:00 PM</p>
                <p className="text-sm text-muted-foreground">Topic: Acid-Base Titration</p>
                <Badge variant="outline" className="mt-1">
                  Lab work + Report
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
