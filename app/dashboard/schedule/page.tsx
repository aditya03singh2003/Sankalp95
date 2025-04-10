"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Download, Filter, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SchedulePage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [selectedDay, setSelectedDay] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedClass, setSelectedClass] = useState("all")
  const [loading, setLoading] = useState(true)
  const [weeklySchedule, setWeeklySchedule] = useState([])
  const [upcomingExams, setUpcomingExams] = useState([])
  const [specialEvents, setSpecialEvents] = useState([])
  const [availableClasses, setAvailableClasses] = useState([])
  const [userClass, setUserClass] = useState("")

  useEffect(() => {
    if (status === "authenticated") {
      fetchScheduleData()
      fetchExams()
      fetchEvents()
      fetchClasses()

      // If student, get their class
      if (session?.user?.role === "student") {
        fetchStudentClass()
      }
    }
  }, [status, session, selectedClass])

  const fetchStudentClass = async () => {
    try {
      const response = await fetch(`/api/students/${session?.user.id}`)
      if (response.ok) {
        const data = await response.json()
        if (data.class) {
          setUserClass(data.class)
          setSelectedClass(data.class)
        }
      }
    } catch (error) {
      console.error("Error fetching student class:", error)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/classes")
      if (response.ok) {
        const data = await response.json()
        setAvailableClasses(data)
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
    }
  }

  const fetchScheduleData = async () => {
    try {
      setLoading(true)
      let url = "/api/schedule"

      // If a specific class is selected and not "all"
      if (selectedClass !== "all") {
        // Find the class ID if available
        const classObj = availableClasses.find((c) => c.name === selectedClass)
        if (classObj) {
          url += `?class=${classObj._id}`
        } else {
          // If we don't have the class ID, try to filter by class name on the client side
          url += `?className=${selectedClass}`
        }
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to fetch schedule: ${response.status}`)
      }

      const data = await response.json()

      // Group by day
      const groupedByDay = data.reduce((acc, item) => {
        const day = item.day
        if (!acc[day]) {
          acc[day] = []
        }

        acc[day].push({
          time: `${item.startTime} - ${item.endTime}`,
          subject: item.subject,
          teacher: item.teacher,
          room: item.location || "Not specified",
          className: item.className,
        })

        return acc
      }, {})

      // Convert to array format
      const formattedSchedule = Object.keys(groupedByDay).map((day) => ({
        day,
        classes: groupedByDay[day],
      }))

      setWeeklySchedule(formattedSchedule)
    } catch (error) {
      console.error("Error fetching schedule:", error)
      toast({
        title: "Error",
        description: "Failed to load schedule data. Please try again later.",
        variant: "destructive",
      })
      setWeeklySchedule([])
    } finally {
      setLoading(false)
    }
  }

  const fetchExams = async () => {
    try {
      const response = await fetch("/api/exams")
      if (response.ok) {
        const data = await response.json()

        // Format exam data
        const formattedExams = data.map((exam) => ({
          date: new Date(exam.date).toLocaleDateString(),
          subject: exam.subject,
          topic: exam.topic || "General",
          duration: exam.duration || "Not specified",
          room: exam.location || "Not specified",
        }))

        setUpcomingExams(formattedExams)
      }
    } catch (error) {
      console.error("Error fetching exams:", error)
      setUpcomingExams([])
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      if (response.ok) {
        const data = await response.json()

        // Format event data
        const formattedEvents = data.map((event) => ({
          date: new Date(event.date).toLocaleDateString(),
          name: event.title,
          time: event.time || "All day",
          venue: event.location || "Not specified",
        }))

        setSpecialEvents(formattedEvents)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
      setSpecialEvents([])
    }
  }

  // Filter schedule based on selected day and subject
  const filteredSchedule = weeklySchedule
    .filter((day) => selectedDay === "all" || day.day === selectedDay)
    .map((day) => ({
      ...day,
      classes: day.classes.filter((cls) => selectedSubject === "all" || cls.subject === selectedSubject),
    }))
    .filter((day) => day.classes.length > 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Class Schedule</h2>
        <p className="text-muted-foreground">View your weekly schedule, upcoming exams, and special events</p>
      </div>

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Weekly Schedule
          </TabsTrigger>
          <TabsTrigger value="exams" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Upcoming Exams
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Special Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-wrap">
            <h3 className="text-lg font-medium">Weekly Class Schedule</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {session?.user?.role === "admin" && (
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {availableClasses.map((cls) => (
                      <SelectItem key={cls._id} value={cls.name}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Days</SelectItem>
                  {weeklySchedule.map((day) => (
                    <SelectItem key={day.day} value={day.day}>
                      {day.day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {Array.from(new Set(weeklySchedule.flatMap((day) => day.classes.map((cls) => cls.subject)))).map(
                    (subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredSchedule.length > 0 ? (
            filteredSchedule.map((day) => (
              <Card key={day.day}>
                <CardHeader>
                  <CardTitle>{day.day}</CardTitle>
                  <CardDescription>{day.classes.length} classes scheduled</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-100">
                          <TableHead>Time</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Teacher</TableHead>
                          <TableHead>Room</TableHead>
                          {session?.user?.role === "admin" && <TableHead>Class</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {day.classes.map((cls, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{cls.time}</TableCell>
                            <TableCell>{cls.subject}</TableCell>
                            <TableCell>{cls.teacher}</TableCell>
                            <TableCell>{cls.room}</TableCell>
                            {session?.user?.role === "admin" && <TableCell>{cls.className}</TableCell>}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-2">No schedule found for the selected filters</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedDay("all")
                    setSelectedSubject("all")
                  }}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="exams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Examinations</CardTitle>
              <CardDescription>Schedule for upcoming tests and examinations</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingExams.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-100">
                        <TableHead>Date</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Topic</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Room</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingExams.map((exam, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{exam.date}</TableCell>
                          <TableCell>{exam.subject}</TableCell>
                          <TableCell>{exam.topic}</TableCell>
                          <TableCell>{exam.duration}</TableCell>
                          <TableCell>{exam.room}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex items-center justify-center py-10">
                  <p className="text-muted-foreground">No upcoming exams scheduled</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Special Events</CardTitle>
              <CardDescription>Upcoming special events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              {specialEvents.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-100">
                        <TableHead>Date</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Venue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {specialEvents.map((event, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{event.date}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{event.name}</Badge>
                          </TableCell>
                          <TableCell>{event.time}</TableCell>
                          <TableCell>{event.venue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex items-center justify-center py-10">
                  <p className="text-muted-foreground">No upcoming events scheduled</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
