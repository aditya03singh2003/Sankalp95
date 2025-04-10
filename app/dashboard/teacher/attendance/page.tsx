"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TeacherAttendancePage() {
  const { data: session } = useSession()
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
    leave: 0,
    total: 0,
    percentage: 0,
  })

  useEffect(() => {
    if (session?.user?.id) {
      fetchAttendance()
    }
  }, [session, currentMonth, currentYear])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/teachers/${session.user.id}/attendance?month=${currentMonth + 1}&year=${currentYear}`,
      )

      if (response.ok) {
        const data = await response.json()
        setAttendance(data.attendance || [])

        // Calculate summary
        const present = data.attendance.filter((a) => a.status === "present").length
        const absent = data.attendance.filter((a) => a.status === "absent").length
        const leave = data.attendance.filter((a) => a.status === "leave").length
        const total = data.attendance.length
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0

        setSummary({
          present,
          absent,
          leave,
          total,
          percentage,
        })
      } else {
        console.error("Failed to fetch attendance")
      }
    } catch (error) {
      console.error("Error fetching attendance:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const getMonthName = (month) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months[month]
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500">Present</Badge>
      case "absent":
        return <Badge className="bg-red-500">Absent</Badge>
      case "leave":
        return <Badge className="bg-amber-500">Leave</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Attendance</h2>
        <p className="text-muted-foreground">View your attendance records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Present Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.present}</div>
            <p className="text-xs text-muted-foreground">out of {summary.total} working days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.absent}</div>
            <p className="text-xs text-muted-foreground">out of {summary.total} working days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Leave Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.leave}</div>
            <p className="text-xs text-muted-foreground">out of {summary.total} working days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attendance %</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.percentage}%</div>
            <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  summary.percentage >= 75 ? "bg-green-500" : summary.percentage >= 50 ? "bg-amber-500" : "bg-red-500"
                }`}
                style={{ width: `${summary.percentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Attendance Records</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[150px] text-center">
                {getMonthName(currentMonth)} {currentYear}
              </span>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Your attendance records for {getMonthName(currentMonth)} {currentYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Clock className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
              <p>Loading attendance records...</p>
            </div>
          ) : attendance.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Records Found</h3>
              <p className="text-sm text-muted-foreground mt-1">There are no attendance records for this month</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-sankalp-100">
                    <TableHead>Date</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Marked By</TableHead>
                    <TableHead>Marked At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>{new Date(record.date).toLocaleDateString("en-US", { weekday: "long" })}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>{record.markedByName || "System"}</TableCell>
                      <TableCell>
                        {new Date(record.updatedAt).toLocaleString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "short",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
