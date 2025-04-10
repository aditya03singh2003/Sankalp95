"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { useSession } from "next-auth/react"

// Mock data - will be replaced with actual API calls
const mockChildren = [
  {
    id: 1,
    name: "Rahul Sharma",
    grade: "10",
    section: "A",
    rollNumber: "S2001",
    attendance: [
      { date: "2023-04-01", status: "Present" },
      { date: "2023-04-02", status: "Present" },
      { date: "2023-04-03", status: "Present" },
      { date: "2023-04-04", status: "Absent", remarks: "Sick leave" },
      { date: "2023-04-05", status: "Present" },
      { date: "2023-04-06", status: "Present" },
      { date: "2023-04-07", status: "Present" },
      { date: "2023-04-08", status: "Weekend" },
      { date: "2023-04-09", status: "Weekend" },
      { date: "2023-04-10", status: "Present" },
      { date: "2023-04-11", status: "Late", remarks: "Arrived 15 minutes late" },
      { date: "2023-04-12", status: "Present" },
      { date: "2023-04-13", status: "Present" },
      { date: "2023-04-14", status: "Present" },
      { date: "2023-04-15", status: "Weekend" },
      { date: "2023-04-16", status: "Weekend" },
      { date: "2023-04-17", status: "Present" },
      { date: "2023-04-18", status: "Present" },
      { date: "2023-04-19", status: "Present" },
      { date: "2023-04-20", status: "Absent", remarks: "Family function" },
      { date: "2023-04-21", status: "Present" },
      { date: "2023-04-22", status: "Weekend" },
      { date: "2023-04-23", status: "Weekend" },
      { date: "2023-04-24", status: "Present" },
      { date: "2023-04-25", status: "Present" },
      { date: "2023-04-26", status: "Present" },
      { date: "2023-04-27", status: "Present" },
      { date: "2023-04-28", status: "Present" },
      { date: "2023-04-29", status: "Weekend" },
      { date: "2023-04-30", status: "Weekend" },
    ],
    summary: {
      present: 20,
      absent: 2,
      late: 1,
      total: 23,
      percentage: 87,
    },
  },
  {
    id: 2,
    name: "Priya Sharma",
    grade: "8",
    section: "B",
    rollNumber: "S2015",
    attendance: [
      { date: "2023-04-01", status: "Present" },
      { date: "2023-04-02", status: "Present" },
      { date: "2023-04-03", status: "Present" },
      { date: "2023-04-04", status: "Present" },
      { date: "2023-04-05", status: "Present" },
      { date: "2023-04-06", status: "Present" },
      { date: "2023-04-07", status: "Present" },
      { date: "2023-04-08", status: "Weekend" },
      { date: "2023-04-09", status: "Weekend" },
      { date: "2023-04-10", status: "Present" },
      { date: "2023-04-11", status: "Present" },
      { date: "2023-04-12", status: "Present" },
      { date: "2023-04-13", status: "Present" },
      { date: "2023-04-14", status: "Present" },
      { date: "2023-04-15", status: "Weekend" },
      { date: "2023-04-16", status: "Weekend" },
      { date: "2023-04-17", status: "Present" },
      { date: "2023-04-18", status: "Present" },
      { date: "2023-04-19", status: "Present" },
      { date: "2023-04-20", status: "Present" },
      { date: "2023-04-21", status: "Present" },
      { date: "2023-04-22", status: "Weekend" },
      { date: "2023-04-23", status: "Weekend" },
      { date: "2023-04-24", status: "Present" },
      { date: "2023-04-25", status: "Present" },
      { date: "2023-04-26", status: "Present" },
      { date: "2023-04-27", status: "Present" },
      { date: "2023-04-28", status: "Present" },
      { date: "2023-04-29", status: "Weekend" },
      { date: "2023-04-30", status: "Weekend" },
    ],
    summary: {
      present: 22,
      absent: 0,
      late: 0,
      total: 22,
      percentage: 100,
    },
  },
]

export default function ParentAttendancePage() {
  const { data: session } = useSession()
  const [children, setChildren] = useState(mockChildren)
  const [loading, setLoading] = useState(true)
  const [selectedChild, setSelectedChild] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [attendanceData, setAttendanceData] = useState([])

  useEffect(() => {
    // Simulate API call to fetch children data
    const fetchChildren = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/parent/children')
        // const data = await response.json()
        // setChildren(data)

        // Using mock data for now
        setTimeout(() => {
          setChildren(mockChildren)
          setSelectedChild(mockChildren[0])
          setAttendanceData(mockChildren[0].attendance)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching children data:", error)
        setLoading(false)
      }
    }

    fetchChildren()
  }, [])

  const handleChildChange = (childId) => {
    const child = children.find((c) => c.id.toString() === childId)
    setSelectedChild(child)
    setAttendanceData(child.attendance)
  }

  const getAttendanceStatusForDate = (date) => {
    const dateString = date.toISOString().split("T")[0]
    const record = attendanceData.find((a) => a.date === dateString)
    return record ? record.status : null
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800"
      case "Absent":
        return "bg-red-100 text-red-800"
      case "Late":
        return "bg-yellow-100 text-yellow-800"
      case "Weekend":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading attendance data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Attendance Tracker</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/3">
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
            <CardDescription>View your child's attendance records</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Child</label>
              <Select value={selectedChild?.id.toString()} onValueChange={handleChildChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a child" />
                </SelectTrigger>
                <SelectContent>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id.toString()}>
                      {child.name} - Class {child.grade}-{child.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedChild && (
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Present</p>
                    <p className="text-2xl font-bold text-green-600">{selectedChild.summary.present}</p>
                    <p className="text-xs text-gray-500">days</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Absent</p>
                    <p className="text-2xl font-bold text-red-600">{selectedChild.summary.absent}</p>
                    <p className="text-xs text-gray-500">days</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Late</p>
                    <p className="text-2xl font-bold text-yellow-600">{selectedChild.summary.late}</p>
                    <p className="text-xs text-gray-500">days</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Attendance</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedChild.summary.percentage}%</p>
                    <p className="text-xs text-gray-500">rate</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Recent Absences</h3>
                  {selectedChild.attendance
                    .filter((a) => a.status === "Absent")
                    .slice(0, 3)
                    .map((absence, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div>
                          <p className="text-sm font-medium">{new Date(absence.date).toLocaleDateString()}</p>
                          {absence.remarks && <p className="text-xs text-gray-500">{absence.remarks}</p>}
                        </div>
                        <Badge variant="destructive">Absent</Badge>
                      </div>
                    ))}

                  {selectedChild.attendance.filter((a) => a.status === "Absent").length === 0 && (
                    <p className="text-sm text-gray-500 py-2">No recent absences.</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:w-2/3">
          <CardHeader>
            <CardTitle>Monthly Attendance</CardTitle>
            <CardDescription>
              {selectedChild ? `Viewing attendance for ${selectedChild.name}` : "Select a child to view attendance"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calendar">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="pt-4">
                <Calendar
                  mode="single"
                  selected={selectedMonth}
                  onSelect={setSelectedMonth}
                  className="rounded-md border"
                  components={{
                    Day: ({ day, ...props }) => {
                      const status = getAttendanceStatusForDate(day)
                      return (
                        <div
                          {...props}
                          className={`relative p-3 text-center text-sm focus:z-10 ${
                            status ? getStatusColor(status) : ""
                          }`}
                        >
                          <time dateTime={day.toISOString().split("T")[0]}>{day.getDate()}</time>
                          {status && <div className="mt-1 text-xs">{status}</div>}
                        </div>
                      )
                    },
                  }}
                />

                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                    <span className="text-xs">Present</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                    <span className="text-xs">Absent</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                    <span className="text-xs">Late</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
                    <span className="text-xs">Weekend/Holiday</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="list" className="pt-4">
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedChild &&
                        attendanceData
                          .filter((a) => a.status !== "Weekend")
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((record, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {new Date(record.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <Badge
                                  className={
                                    record.status === "Present"
                                      ? "bg-green-100 text-green-800"
                                      : record.status === "Absent"
                                        ? "bg-red-100 text-red-800"
                                        : record.status === "Late"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {record.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {record.remarks || "-"}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
