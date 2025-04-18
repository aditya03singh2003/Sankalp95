"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export default function AttendancePage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [date, setDate] = useState<Date>(new Date())
  const [month, setMonth] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [attendanceSummary, setAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    total: 0,
    percentage: 0,
  })

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchAttendance()
    }
  }, [status, session, month])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const monthString = format(month, "yyyy-MM")
      const response = await fetch(`/api/students/${session?.user.id}/attendance?month=${monthString}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch attendance: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Ensure we have valid data
      if (Array.isArray(data)) {
        setAttendanceData(data)

        // Calculate summary
        const present = data.filter((record) => record.status === "present").length
        const total = data.length
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0

        setAttendanceSummary({
          present,
          absent: total - present,
          total,
          percentage,
        })
      } else {
        console.error("Invalid attendance data format:", data)
        setAttendanceData([])
        setAttendanceSummary({
          present: 0,
          absent: 0,
          total: 0,
          percentage: 0,
        })

        toast({
          title: "Error",
          description: "Failed to load attendance data. Invalid format received.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching attendance:", error)
      toast({
        title: "Error",
        description: "Failed to load attendance data. Please try again later.",
        variant: "destructive",
      })
      setAttendanceData([])
      setAttendanceSummary({
        present: 0,
        absent: 0,
        total: 0,
        percentage: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const previousMonth = () => {
    setMonth((prev) => {
      const newMonth = new Date(prev)
      newMonth.setMonth(newMonth.getMonth() - 1)
      return newMonth
    })
  }

  const nextMonth = () => {
    setMonth((prev) => {
      const newMonth = new Date(prev)
      newMonth.setMonth(newMonth.getMonth() + 1)
      return newMonth
    })
  }

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  })

  const getAttendanceForDay = (day: Date) => {
    return attendanceData.find((record) => {
      try {
        const recordDate = new Date(record.date)
        return isSameDay(recordDate, day)
      } catch (error) {
        return false
      }
    })
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Invalid Date"
      }
      return format(date, "PPP")
    } catch (error) {
      return "Invalid Date"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground">View your attendance records</p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Attendance Summary</CardTitle>
            <CardDescription>Your attendance for {format(month, "MMMM yyyy")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Present</p>
                <p className="text-2xl font-bold text-green-600">{attendanceSummary.present}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold text-red-600">{attendanceSummary.absent}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Percentage</p>
                <p className="text-2xl font-bold">{attendanceSummary.percentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Monthly View</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={previousMonth} className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous month</span>
                </Button>
                <span className="text-sm font-medium">{format(month, "MMMM yyyy")}</span>
                <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next month</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                {Array.from({ length: startOfMonth(month).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-10 rounded-md" />
                ))}
                {daysInMonth.map((day) => {
                  const attendance = getAttendanceForDay(day)
                  return (
                    <div
                      key={day.toString()}
                      className={cn(
                        "flex h-10 items-center justify-center rounded-md text-sm",
                        attendance && attendance.status === "present" && "bg-green-100 text-green-900 font-medium",
                        attendance && attendance.status === "absent" && "bg-red-100 text-red-900 font-medium",
                      )}
                    >
                      {format(day, "d")}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>Detailed view of your attendance</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.length > 0 ? (
                    attendanceData.map((record) => (
                      <TableRow key={record._id}>
                        <TableCell>{formatDate(record.date)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={record.status === "present" ? "default" : "destructive"}
                            className={cn(record.status === "present" && "bg-green-500 hover:bg-green-600")}
                          >
                            {record.status === "present" ? "Present" : "Absent"}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.subject || "N/A"}</TableCell>
                        <TableCell>{record.teacher || "N/A"}</TableCell>
                        <TableCell>{record.notes || "N/A"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No attendance records found for this month
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
