"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isBefore,
  isAfter,
  parseISO,
  addMonths,
  subMonths,
  isWeekend,
} from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, Loader2, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
    leave: 0,
    total: 0,
    percentage: 0,
    registrationDate: null,
    attendedDays: 0,
  })
  const [registrationDate, setRegistrationDate] = useState<Date | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchAttendanceSummary()
      fetchAttendance()
    }
  }, [status, session, month])

  const fetchAttendanceSummary = async () => {
    try {
      const monthString = format(month, "yyyy-MM")
      const response = await fetch(`/api/students/${session?.user.id}/attendance/summary?month=${monthString}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch attendance summary: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      setAttendanceSummary({
        present: data.present || 0,
        absent: data.absent || 0,
        leave: data.leave || 0,
        total: data.total || 0,
        percentage: data.percentage || 0,
        registrationDate: data.registrationDate,
        attendedDays: data.attendedDays || 0,
      })

      // Store debug info
      setDebugInfo(data.dateRange || null)

      if (data.registrationDate) {
        setRegistrationDate(parseISO(data.registrationDate))
      }
    } catch (error) {
      console.error("Error fetching attendance summary:", error)
      toast({
        title: "Error",
        description: "Failed to load attendance summary. Please try again later.",
        variant: "destructive",
      })
    }
  }

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
      } else {
        console.error("Invalid attendance data format:", data)
        setAttendanceData([])
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
    } finally {
      setLoading(false)
    }
  }

  const previousMonth = () => {
    setMonth((prev) => subMonths(prev, 1))
  }

  const nextMonth = () => {
    setMonth((prev) => addMonths(prev, 1))
  }

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  })

  const getAttendanceForDay = (day: Date) => {
    const dayRecords = attendanceData.filter((record) => {
      try {
        const recordDate = new Date(record.date)
        return isSameDay(recordDate, day)
      } catch (error) {
        return false
      }
    })

    // If any record for the day is "present", return present
    if (dayRecords.some((record) => record.status === "present")) {
      return { status: "present", records: dayRecords }
    }
    // If no present but any leave, return leave
    else if (dayRecords.some((record) => record.status === "leave")) {
      return { status: "leave", records: dayRecords }
    }
    // If there are records but none are present or leave, return absent
    else if (dayRecords.length > 0) {
      return { status: "absent", records: dayRecords }
    }

    // No records found
    return null
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

  // Group attendance records by date for the table view
  const groupedAttendanceData = attendanceData.reduce((acc, record) => {
    const dateStr = format(new Date(record.date), "yyyy-MM-dd")
    if (!acc[dateStr]) {
      acc[dateStr] = []
    }
    acc[dateStr].push(record)
    return acc
  }, {})

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
                <p className="text-sm font-medium text-muted-foreground">Leave</p>
                <p className="text-2xl font-bold text-amber-600">{attendanceSummary.leave}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Attendance Rate</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <span className="text-sm font-bold">{attendanceSummary.percentage}%</span>
                        <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {attendanceSummary.attendedDays} days attended out of {attendanceSummary.total} school days
                        <br />
                        (Present + Leave) ÷ Total School Days
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={cn(
                    "h-2.5 rounded-full",
                    attendanceSummary.percentage >= 90
                      ? "bg-green-600"
                      : attendanceSummary.percentage >= 75
                        ? "bg-amber-500"
                        : "bg-red-600",
                  )}
                  style={{ width: `${attendanceSummary.percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Based on {attendanceSummary.total} school days since{" "}
                {registrationDate ? format(registrationDate, "PPP") : "registration"}
              </p>
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
                  const today = new Date()
                  const isFutureDate = isAfter(day, today)
                  const isPastRegistration = registrationDate ? !isBefore(day, registrationDate) : true
                  const isWeekendDay = isWeekend(day)

                  // Only show attendance status for past dates after registration
                  const attendance = !isFutureDate && isPastRegistration ? getAttendanceForDay(day) : null

                  return (
                    <TooltipProvider key={day.toString()}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "flex h-10 items-center justify-center rounded-md text-sm",
                              isSameDay(day, today) && "border-2 border-blue-500",
                              !isFutureDate && isPastRegistration && !attendance && !isWeekendDay && "bg-gray-200", // School day with no record
                              isWeekendDay && "bg-gray-50 text-gray-400", // Weekend
                              attendance?.status === "present" && "bg-green-500 text-white font-medium",
                              attendance?.status === "absent" && "bg-red-500 text-white font-medium",
                              attendance?.status === "leave" && "bg-yellow-500 text-white font-medium",
                              isFutureDate && "text-gray-400", // Future date
                              registrationDate && isBefore(day, registrationDate) && "text-gray-300", // Before registration
                            )}
                          >
                            {format(day, "d")}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {format(day, "PPP")}
                            {isWeekendDay && " (Weekend)"}
                            {attendance &&
                              `: ${attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}`}
                            {!isFutureDate && isPastRegistration && !attendance && !isWeekendDay && ": No record"}
                            {isFutureDate && ": Future date"}
                            {registrationDate && isBefore(day, registrationDate) && ": Before registration"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </div>
            )}

            <div className="flex flex-wrap justify-center mt-4 gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span>Absent</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                <span>Leave</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-200 mr-1"></div>
                <span>No Record</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-50 mr-1"></div>
                <span>Weekend</span>
              </div>
            </div>
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
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(groupedAttendanceData).length > 0 ? (
                    Object.entries(groupedAttendanceData)
                      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                      .map(([dateStr, records]) => (
                        <TableRow key={dateStr}>
                          <TableCell className="font-medium">{format(new Date(dateStr), "PPP")}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {(records as any[]).map((record, idx) => (
                                <Badge
                                  key={`${record._id}-${idx}`}
                                  className={cn(
                                    "text-xs text-white",
                                    record.status === "present" && "bg-green-500",
                                    record.status === "absent" && "bg-red-500",
                                    record.status === "leave" && "bg-yellow-500",
                                  )}
                                >
                                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {(records as any[]).map((record, idx) => (
                                <span key={`${record._id}-subject-${idx}`} className="text-sm">
                                  {record.subject || "N/A"}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {(records as any[]).map((record, idx) => (
                                <span key={`${record._id}-notes-${idx}`} className="text-sm text-muted-foreground">
                                  {record.notes || "N/A"}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
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
