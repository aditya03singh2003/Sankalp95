"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  BookOpen,
  Calendar,
  Clock,
  CreditCard,
  Users,
  Video,
  Mail,
  UserPlus,
  FileText,
  Loader2,
  AlertTriangle,
  CalendarDays,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    classesToday: 0,
    revenueThisMonth: "₹0",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role !== "admin") {
        redirect("/dashboard")
      }

      // Fetch admin dashboard stats from the database
      const fetchStats = async () => {
        try {
          setLoading(true)
          setError(null)

          // Fetch admin stats from a single endpoint
          const response = await fetch("/api/admin/stats", {
            // Add cache: 'no-store' to prevent caching
            cache: "no-store",
            // Add a timeout
            signal: AbortSignal.timeout(15000),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || `Failed to fetch admin stats: ${response.status}`)
          }

          const data = await response.json()

          setStats({
            totalStudents: data.totalStudents || 0,
            totalTeachers: data.totalTeachers || 0,
            classesToday: data.classesToday || 0,
            revenueThisMonth: data.revenueThisMonth || "₹0",
          })
        } catch (error: any) {
          console.error("Error fetching admin stats:", error)
          setError(error.message || "Failed to load dashboard data. Please try again later.")
          // Keep the current stats if API fails
        } finally {
          setLoading(false)
        }
      }

      fetchStats()

      // Set up interval to refresh stats every 60 seconds (increased from 30)
      const intervalId = setInterval(fetchStats, 60000)

      // Clean up interval on component unmount
      return () => clearInterval(intervalId)
    } else if (status === "unauthenticated") {
      redirect("/login")
    }
  }, [status, session])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading admin dashboard...</span>
      </div>
    )
  }

  // Sample data for recent activities
  const recentActivities = [
    {
      id: 1,
      activity: "New student registered",
      details: "Ananya Sharma - Class 10",
      time: "10 minutes ago",
    },
    {
      id: 2,
      activity: "Attendance updated",
      details: "Class 8 - Mathematics",
      time: "30 minutes ago",
    },
    {
      id: 3,
      activity: "Payment received",
      details: "Rahul Verma - Class 12 - ₹4,999",
      time: "1 hour ago",
    },
    {
      id: 4,
      activity: "New lecture uploaded",
      details: "Physics - Laws of Motion - Class 11",
      time: "2 hours ago",
    },
  ]

  // Sample data for pending tasks
  const pendingTasks = [
    {
      id: 1,
      task: "Review new teacher applications",
      priority: "High",
      deadline: "Today",
    },
    {
      id: 2,
      task: "Send fee reminder emails",
      priority: "Medium",
      deadline: "Tomorrow",
    },
    {
      id: 3,
      task: "Update class 10 syllabus",
      priority: "Medium",
      deadline: "This week",
    },
    {
      id: 4,
      task: "Prepare monthly performance report",
      priority: "High",
      deadline: "This week",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, {session?.user?.name}! Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/admin/email">
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Send Notifications
            </Button>
          </Link>
          <Link href="/dashboard/admin/reports">
            <Button size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Generate Reports
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">Across all classes</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalTeachers}</div>
                <p className="text-xs text-muted-foreground">Active faculty members</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.classesToday}</div>
                <p className="text-xs text-muted-foreground">Scheduled for today</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.revenueThisMonth}</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Manage various aspects of the coaching center</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/dashboard/admin/students">
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer h-full">
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium text-center">Manage Students</span>
                </div>
              </Link>
              <Link href="/dashboard/admin/teachers">
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer h-full">
                  <UserPlus className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium text-center">Manage Teachers</span>
                </div>
              </Link>
              <Link href="/dashboard/admin/attendance">
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer h-full">
                  <Calendar className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium text-center">Attendance</span>
                </div>
              </Link>
              <Link href="/dashboard/admin/lectures">
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer h-full">
                  <Video className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium text-center">Manage Lectures</span>
                </div>
              </Link>
              <Link href="/dashboard/admin/payments">
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer h-full">
                  <CreditCard className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium text-center">Payments</span>
                </div>
              </Link>
              <Link href="/dashboard/admin/schedule-management">
                <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer h-full">
                  <CalendarDays className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-medium text-center">Manage Schedule</span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
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

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>Classes scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 rounded-md border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Mathematics: Quadratic Equations</p>
                  <p className="text-sm text-muted-foreground">Class 10 • 4:00 PM - 5:30 PM</p>
                  <p className="text-sm text-muted-foreground">Teacher: Dr. Amit Kumar</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 rounded-md border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Physics: Laws of Motion</p>
                  <p className="text-sm text-muted-foreground">Class 11 • 5:30 PM - 7:00 PM</p>
                  <p className="text-sm text-muted-foreground">Teacher: Mrs. Priya Singh</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 rounded-md border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Chemistry: Periodic Table</p>
                  <p className="text-sm text-muted-foreground">Class 9 • 3:00 PM - 4:30 PM</p>
                  <p className="text-sm text-muted-foreground">Teacher: Mr. Rajesh Verma</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
