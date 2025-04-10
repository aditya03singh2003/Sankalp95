"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, FileText, CalendarIcon, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

export default function ScheduleManagementPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("weekly-schedule")
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Weekly Schedule State
  const [scheduleItems, setScheduleItems] = useState([])
  const [newScheduleItem, setNewScheduleItem] = useState({
    day: "Monday",
    startTime: "08:00",
    endTime: "09:00",
    subject: "",
    teacher: "",
    classGroup: "",
    location: "",
    notes: "",
    assignType: "class", // 'class' or 'individual'
    selectedStudents: [],
  })

  // Exams State
  const [exams, setExams] = useState([])
  const [newExam, setNewExam] = useState({
    title: "",
    subject: "",
    date: new Date(),
    startTime: "09:00",
    duration: "60",
    classGroup: "",
    location: "",
    description: "",
    assignType: "class", // 'class' or 'individual'
    selectedStudents: [],
  })

  // Events State
  const [events, setEvents] = useState([])
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    location: "",
    description: "",
    type: "Special Event", // 'Special Event', 'Holiday', 'Competition', etc.
    assignType: "all", // 'all', 'class', or 'individual'
    classGroup: "",
    selectedStudents: [],
  })

  // Days of the week
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Event types
  const eventTypes = ["Special Event", "Holiday", "Competition", "Workshop", "Field Trip", "Parent-Teacher Meeting"]

  useEffect(() => {
    fetchClasses()
    fetchScheduleItems()
    fetchExams()
    fetchEvents()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/classes")
      if (response.ok) {
        const data = await response.json()
        setClasses(data)
      }
    } catch (err) {
      console.error("Error fetching classes:", err)
    }
  }

  const fetchStudents = async (classId) => {
    if (!classId) return

    try {
      const response = await fetch(`/api/students/class?class=${classId}`)
      if (response.ok) {
        const data = await response.json()
        setStudents(data)
      }
    } catch (err) {
      console.error("Error fetching students:", err)
    }
  }

  const fetchScheduleItems = async () => {
    try {
      const response = await fetch("/api/schedule")
      if (response.ok) {
        const data = await response.json()
        setScheduleItems(data)
      }
    } catch (err) {
      console.error("Error fetching schedule items:", err)
    }
  }

  const fetchExams = async () => {
    try {
      const response = await fetch("/api/exams")
      if (response.ok) {
        const data = await response.json()
        setExams(data)
      }
    } catch (err) {
      console.error("Error fetching exams:", err)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (err) {
      console.error("Error fetching events:", err)
    }
  }

  const handleScheduleInputChange = (e) => {
    const { name, value } = e.target
    setNewScheduleItem((prev) => ({ ...prev, [name]: value }))

    if (name === "classGroup" && value) {
      fetchStudents(value)
    }
  }

  const handleExamInputChange = (e) => {
    const { name, value } = e.target
    setNewExam((prev) => ({ ...prev, [name]: value }))

    if (name === "classGroup" && value) {
      fetchStudents(value)
    }
  }

  const handleEventInputChange = (e) => {
    const { name, value } = e.target
    setNewEvent((prev) => ({ ...prev, [name]: value }))

    if (name === "classGroup" && value) {
      fetchStudents(value)
    }
  }

  const handleStudentSelection = (studentId, section) => {
    if (section === "schedule") {
      setNewScheduleItem((prev) => {
        const selectedStudents = [...prev.selectedStudents]
        if (selectedStudents.includes(studentId)) {
          return { ...prev, selectedStudents: selectedStudents.filter((id) => id !== studentId) }
        } else {
          return { ...prev, selectedStudents: [...selectedStudents, studentId] }
        }
      })
    } else if (section === "exam") {
      setNewExam((prev) => {
        const selectedStudents = [...prev.selectedStudents]
        if (selectedStudents.includes(studentId)) {
          return { ...prev, selectedStudents: selectedStudents.filter((id) => id !== studentId) }
        } else {
          return { ...prev, selectedStudents: [...selectedStudents, studentId] }
        }
      })
    } else if (section === "event") {
      setNewEvent((prev) => {
        const selectedStudents = [...prev.selectedStudents]
        if (selectedStudents.includes(studentId)) {
          return { ...prev, selectedStudents: selectedStudents.filter((id) => id !== studentId) }
        } else {
          return { ...prev, selectedStudents: [...selectedStudents, studentId] }
        }
      })
    }
  }

  const addScheduleItem = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newScheduleItem),
      })

      if (response.ok) {
        setSuccess("Schedule item added successfully!")
        fetchScheduleItems()
        setNewScheduleItem({
          day: "Monday",
          startTime: "08:00",
          endTime: "09:00",
          subject: "",
          teacher: "",
          classGroup: "",
          location: "",
          notes: "",
          assignType: "class",
          selectedStudents: [],
        })
        toast({
          title: "Success",
          description: "Schedule item added successfully!",
        })
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to add schedule item")
      }
    } catch (err) {
      setError(err.message || "An error occurred while adding the schedule item.")
      toast({
        title: "Error",
        description: err.message || "An error occurred while adding the schedule item.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addExam = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newExam,
          date: newExam.date.toISOString(),
        }),
      })

      if (response.ok) {
        setSuccess("Exam added successfully!")
        fetchExams()
        setNewExam({
          title: "",
          subject: "",
          date: new Date(),
          startTime: "09:00",
          duration: "60",
          classGroup: "",
          location: "",
          description: "",
          assignType: "class",
          selectedStudents: [],
        })
        toast({
          title: "Success",
          description: "Exam added successfully!",
        })
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to add exam")
      }
    } catch (err) {
      setError(err.message || "An error occurred while adding the exam.")
      toast({
        title: "Error",
        description: err.message || "An error occurred while adding the exam.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addEvent = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newEvent,
          date: newEvent.date.toISOString(),
        }),
      })

      if (response.ok) {
        setSuccess("Event added successfully!")
        fetchEvents()
        setNewEvent({
          title: "",
          date: new Date(),
          startTime: "09:00",
          endTime: "10:00",
          location: "",
          description: "",
          type: "Special Event",
          assignType: "all",
          classGroup: "",
          selectedStudents: [],
        })
        toast({
          title: "Success",
          description: "Event added successfully!",
        })
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to add event")
      }
    } catch (err) {
      setError(err.message || "An error occurred while adding the event.")
      toast({
        title: "Error",
        description: err.message || "An error occurred while adding the event.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteScheduleItem = async (id) => {
    if (!confirm("Are you sure you want to delete this schedule item?")) return

    try {
      const response = await fetch(`/api/schedule/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchScheduleItems()
        toast({
          title: "Success",
          description: "Schedule item deleted successfully!",
        })
      } else {
        throw new Error("Failed to delete schedule item")
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "An error occurred while deleting the schedule item.",
        variant: "destructive",
      })
    }
  }

  const deleteExam = async (id) => {
    if (!confirm("Are you sure you want to delete this exam?")) return

    try {
      const response = await fetch(`/api/exams/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchExams()
        toast({
          title: "Success",
          description: "Exam deleted successfully!",
        })
      } else {
        throw new Error("Failed to delete exam")
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "An error occurred while deleting the exam.",
        variant: "destructive",
      })
    }
  }

  const deleteEvent = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchEvents()
        toast({
          title: "Success",
          description: "Event deleted successfully!",
        })
      } else {
        throw new Error("Failed to delete event")
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "An error occurred while deleting the event.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Schedule Management</h2>
          <p className="text-muted-foreground">Manage weekly schedules, exams, and special events</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly-schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Weekly Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="exams" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Upcoming Exams</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Special Events</span>
          </TabsTrigger>
        </TabsList>

        {/* Weekly Schedule Tab */}
        <TabsContent value="weekly-schedule" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Schedule Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Weekly Schedule</CardTitle>
                <CardDescription>Create a new schedule item for classes or individual students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="day">Day</Label>
                    <Select
                      value={newScheduleItem.day}
                      onValueChange={(value) => setNewScheduleItem((prev) => ({ ...prev, day: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={newScheduleItem.subject}
                      onChange={handleScheduleInputChange}
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={newScheduleItem.startTime}
                      onChange={handleScheduleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={newScheduleItem.endTime}
                      onChange={handleScheduleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher">Teacher</Label>
                    <Input
                      id="teacher"
                      name="teacher"
                      value={newScheduleItem.teacher}
                      onChange={handleScheduleInputChange}
                      placeholder="Teacher name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={newScheduleItem.location}
                      onChange={handleScheduleInputChange}
                      placeholder="e.g., Room 101"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={newScheduleItem.notes}
                    onChange={handleScheduleInputChange}
                    placeholder="Any additional information"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Assign To</Label>
                  <RadioGroup
                    value={newScheduleItem.assignType}
                    onValueChange={(value) => setNewScheduleItem((prev) => ({ ...prev, assignType: value }))}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="class" id="schedule-class" />
                      <Label htmlFor="schedule-class">Entire Class</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="schedule-individual" />
                      <Label htmlFor="schedule-individual">Individual Students</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classGroup">Class</Label>
                  <Select
                    value={newScheduleItem.classGroup}
                    onValueChange={(value) => {
                      setNewScheduleItem((prev) => ({ ...prev, classGroup: value }))
                      fetchStudents(value)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls._id} value={cls._id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newScheduleItem.assignType === "individual" && newScheduleItem.classGroup && (
                  <div className="space-y-2">
                    <Label>Select Students</Label>
                    <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                      {students.length > 0 ? (
                        students.map((student) => (
                          <div key={student._id} className="flex items-center space-x-2 py-1">
                            <Checkbox
                              id={`student-${student._id}`}
                              checked={newScheduleItem.selectedStudents.includes(student._id)}
                              onCheckedChange={() => handleStudentSelection(student._id, "schedule")}
                            />
                            <Label htmlFor={`student-${student._id}`} className="cursor-pointer">
                              {student.name}
                            </Label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No students found in this class</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={addScheduleItem} disabled={loading}>
                  {loading ? "Adding..." : "Add Schedule Item"}
                </Button>
              </CardFooter>
            </Card>

            {/* Schedule List */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>View and manage all schedule items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduleItems.length > 0 ? (
                        scheduleItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>{item.day}</TableCell>
                            <TableCell>
                              {item.startTime} - {item.endTime}
                            </TableCell>
                            <TableCell>{item.subject}</TableCell>
                            <TableCell>
                              {item.assignType === "class" ? (
                                <Badge variant="outline">{item.className || "Class"}</Badge>
                              ) : (
                                <Badge variant="secondary">Individual</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => deleteScheduleItem(item._id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No schedule items found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value="exams" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Exam Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Upcoming Exam</CardTitle>
                <CardDescription>Schedule a new exam for classes or individual students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="examTitle">Exam Title</Label>
                  <Input
                    id="examTitle"
                    name="title"
                    value={newExam.title}
                    onChange={handleExamInputChange}
                    placeholder="e.g., Mid-Term Mathematics Exam"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="examSubject">Subject</Label>
                    <Input
                      id="examSubject"
                      name="subject"
                      value={newExam.subject}
                      onChange={handleExamInputChange}
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="examDate">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newExam.date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newExam.date ? format(newExam.date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={newExam.date}
                          onSelect={(date) => setNewExam((prev) => ({ ...prev, date: date || new Date() }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="examStartTime">Start Time</Label>
                    <Input
                      id="examStartTime"
                      name="startTime"
                      type="time"
                      value={newExam.startTime}
                      onChange={handleExamInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="examDuration">Duration (minutes)</Label>
                    <Input
                      id="examDuration"
                      name="duration"
                      type="number"
                      value={newExam.duration}
                      onChange={handleExamInputChange}
                      min="15"
                      step="15"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examLocation">Location</Label>
                  <Input
                    id="examLocation"
                    name="location"
                    value={newExam.location}
                    onChange={handleExamInputChange}
                    placeholder="e.g., Examination Hall"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examDescription">Description</Label>
                  <Textarea
                    id="examDescription"
                    name="description"
                    value={newExam.description}
                    onChange={handleExamInputChange}
                    placeholder="Exam details, syllabus, instructions, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Assign To</Label>
                  <RadioGroup
                    value={newExam.assignType}
                    onValueChange={(value) => setNewExam((prev) => ({ ...prev, assignType: value }))}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="class" id="exam-class" />
                      <Label htmlFor="exam-class">Entire Class</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="exam-individual" />
                      <Label htmlFor="exam-individual">Individual Students</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examClassGroup">Class</Label>
                  <Select
                    value={newExam.classGroup}
                    onValueChange={(value) => {
                      setNewExam((prev) => ({ ...prev, classGroup: value }))
                      fetchStudents(value)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls._id} value={cls._id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newExam.assignType === "individual" && newExam.classGroup && (
                  <div className="space-y-2">
                    <Label>Select Students</Label>
                    <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                      {students.length > 0 ? (
                        students.map((student) => (
                          <div key={student._id} className="flex items-center space-x-2 py-1">
                            <Checkbox
                              id={`exam-student-${student._id}`}
                              checked={newExam.selectedStudents.includes(student._id)}
                              onCheckedChange={() => handleStudentSelection(student._id, "exam")}
                            />
                            <Label htmlFor={`exam-student-${student._id}`} className="cursor-pointer">
                              {student.name}
                            </Label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No students found in this class</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={addExam} disabled={loading}>
                  {loading ? "Adding..." : "Add Exam"}
                </Button>
              </CardFooter>
            </Card>

            {/* Exams List */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Exams</CardTitle>
                <CardDescription>View and manage all scheduled exams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exams.length > 0 ? (
                        exams.map((exam) => (
                          <TableRow key={exam._id}>
                            <TableCell className="font-medium">{exam.title}</TableCell>
                            <TableCell>{exam.subject}</TableCell>
                            <TableCell>{format(new Date(exam.date), "PPP")}</TableCell>
                            <TableCell>
                              {exam.assignType === "class" ? (
                                <Badge variant="outline">{exam.className || "Class"}</Badge>
                              ) : (
                                <Badge variant="secondary">Individual</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => deleteExam(exam._id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No exams found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Event Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Special Event</CardTitle>
                <CardDescription>Schedule a new event for all students, classes, or individuals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eventTitle">Event Title</Label>
                  <Input
                    id="eventTitle"
                    name="title"
                    value={newEvent.title}
                    onChange={handleEventInputChange}
                    placeholder="e.g., Annual Sports Day"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select
                      value={newEvent.type}
                      onValueChange={(value) => setNewEvent((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newEvent.date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newEvent.date ? format(newEvent.date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={newEvent.date}
                          onSelect={(date) => setNewEvent((prev) => ({ ...prev, date: date || new Date() }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventStartTime">Start Time</Label>
                    <Input
                      id="eventStartTime"
                      name="startTime"
                      type="time"
                      value={newEvent.startTime}
                      onChange={handleEventInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventEndTime">End Time</Label>
                    <Input
                      id="eventEndTime"
                      name="endTime"
                      type="time"
                      value={newEvent.endTime}
                      onChange={handleEventInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventLocation">Location</Label>
                  <Input
                    id="eventLocation"
                    name="location"
                    value={newEvent.location}
                    onChange={handleEventInputChange}
                    placeholder="e.g., School Auditorium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventDescription">Description</Label>
                  <Textarea
                    id="eventDescription"
                    name="description"
                    value={newEvent.description}
                    onChange={handleEventInputChange}
                    placeholder="Event details, schedule, instructions, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Assign To</Label>
                  <RadioGroup
                    value={newEvent.assignType}
                    onValueChange={(value) => setNewEvent((prev) => ({ ...prev, assignType: value }))}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="event-all" />
                      <Label htmlFor="event-all">All Students</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="class" id="event-class" />
                      <Label htmlFor="event-class">Specific Class</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="event-individual" />
                      <Label htmlFor="event-individual">Individual Students</Label>
                    </div>
                  </RadioGroup>
                </div>

                {(newEvent.assignType === "class" || newEvent.assignType === "individual") && (
                  <div className="space-y-2">
                    <Label htmlFor="eventClassGroup">Class</Label>
                    <Select
                      value={newEvent.classGroup}
                      onValueChange={(value) => {
                        setNewEvent((prev) => ({ ...prev, classGroup: value }))
                        fetchStudents(value)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls._id} value={cls._id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {newEvent.assignType === "individual" && newEvent.classGroup && (
                  <div className="space-y-2">
                    <Label>Select Students</Label>
                    <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                      {students.length > 0 ? (
                        students.map((student) => (
                          <div key={student._id} className="flex items-center space-x-2 py-1">
                            <Checkbox
                              id={`event-student-${student._id}`}
                              checked={newEvent.selectedStudents.includes(student._id)}
                              onCheckedChange={() => handleStudentSelection(student._id, "event")}
                            />
                            <Label htmlFor={`event-student-${student._id}`} className="cursor-pointer">
                              {student.name}
                            </Label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No students found in this class</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={addEvent} disabled={loading}>
                  {loading ? "Adding..." : "Add Event"}
                </Button>
              </CardFooter>
            </Card>

            {/* Events List */}
            <Card>
              <CardHeader>
                <CardTitle>Special Events</CardTitle>
                <CardDescription>View and manage all scheduled events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.length > 0 ? (
                        events.map((event) => (
                          <TableRow key={event._id}>
                            <TableCell className="font-medium">{event.title}</TableCell>
                            <TableCell>{event.type}</TableCell>
                            <TableCell>{format(new Date(event.date), "PPP")}</TableCell>
                            <TableCell>
                              {event.assignType === "all" ? (
                                <Badge>All Students</Badge>
                              ) : event.assignType === "class" ? (
                                <Badge variant="outline">{event.className || "Class"}</Badge>
                              ) : (
                                <Badge variant="secondary">Individual</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => deleteEvent(event._id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No events found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
