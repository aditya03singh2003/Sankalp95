"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart, LineChart, PieChart } from "lucide-react"

export default function ReportsPage() {
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedMonth, setSelectedMonth] = useState("all")

  // Dummy data for performance report
  const performanceData = [
    {
      subject: "Mathematics",
      tests: [
        { name: "Test 1", score: 85, maxScore: 100, date: "10 Jan 2023" },
        { name: "Test 2", score: 92, maxScore: 100, date: "25 Jan 2023" },
        { name: "Test 3", score: 78, maxScore: 100, date: "15 Feb 2023" },
        { name: "Test 4", score: 88, maxScore: 100, date: "5 Mar 2023" },
      ],
      average: 85.75,
      rank: 3,
      teacherRemarks: "Good performance, needs to work on consistency.",
    },
    {
      subject: "Physics",
      tests: [
        { name: "Test 1", score: 75, maxScore: 100, date: "12 Jan 2023" },
        { name: "Test 2", score: 82, maxScore: 100, date: "27 Jan 2023" },
        { name: "Test 3", score: 90, maxScore: 100, date: "17 Feb 2023" },
        { name: "Test 4", score: 85, maxScore: 100, date: "7 Mar 2023" },
      ],
      average: 83,
      rank: 5,
      teacherRemarks: "Showing improvement, keep it up!",
    },
    {
      subject: "Chemistry",
      tests: [
        { name: "Test 1", score: 92, maxScore: 100, date: "15 Jan 2023" },
        { name: "Test 2", score: 88, maxScore: 100, date: "30 Jan 2023" },
        { name: "Test 3", score: 95, maxScore: 100, date: "20 Feb 2023" },
        { name: "Test 4", score: 90, maxScore: 100, date: "10 Mar 2023" },
      ],
      average: 91.25,
      rank: 1,
      teacherRemarks: "Excellent performance, consistently good.",
    },
    {
      subject: "Biology",
      tests: [
        { name: "Test 1", score: 80, maxScore: 100, date: "18 Jan 2023" },
        { name: "Test 2", score: 85, maxScore: 100, date: "2 Feb 2023" },
        { name: "Test 3", score: 78, maxScore: 100, date: "22 Feb 2023" },
        { name: "Test 4", score: 88, maxScore: 100, date: "12 Mar 2023" },
      ],
      average: 82.75,
      rank: 6,
      teacherRemarks: "Good understanding of concepts, needs to improve test-taking skills.",
    },
    {
      subject: "English",
      tests: [
        { name: "Test 1", score: 88, maxScore: 100, date: "20 Jan 2023" },
        { name: "Test 2", score: 92, maxScore: 100, date: "5 Feb 2023" },
        { name: "Test 3", score: 90, maxScore: 100, date: "25 Feb 2023" },
        { name: "Test 4", score: 95, maxScore: 100, date: "15 Mar 2023" },
      ],
      average: 91.25,
      rank: 2,
      teacherRemarks: "Excellent language skills, very good performance.",
    },
  ]

  // Dummy data for attendance report
  const attendanceData = {
    monthly: [
      { month: "January", present: 22, total: 25, percentage: 88 },
      { month: "February", present: 20, total: 22, percentage: 91 },
      { month: "March", present: 18, total: 20, percentage: 90 },
      { month: "April", present: 21, total: 23, percentage: 91 },
    ],
    subjects: [
      { subject: "Mathematics", present: 42, total: 45, percentage: 93 },
      { subject: "Physics", present: 38, total: 45, percentage: 84 },
      { subject: "Chemistry", present: 40, total: 45, percentage: 89 },
      { subject: "Biology", present: 41, total: 45, percentage: 91 },
      { subject: "English", present: 43, total: 45, percentage: 96 },
    ],
  }

  // Filter performance data based on selected subject
  const filteredPerformance =
    selectedSubject === "all" ? performanceData : performanceData.filter((item) => item.subject === selectedSubject)

  // Filter attendance data based on selected month
  const filteredMonthlyAttendance =
    selectedMonth === "all"
      ? attendanceData.monthly
      : attendanceData.monthly.filter((item) => item.month === selectedMonth)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Academic Reports</h2>
        <p className="text-muted-foreground">View your performance, attendance, and other academic reports</p>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance" className="flex items-center">
            <BarChart className="mr-2 h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center">
            <PieChart className="mr-2 h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center">
            <LineChart className="mr-2 h-4 w-4" />
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Performance Report</h3>
            <div className="flex items-center gap-2">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {performanceData.map((item) => (
                    <SelectItem key={item.subject} value={item.subject}>
                      {item.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">Download Report</Button>
            </div>
          </div>

          {filteredPerformance.map((subject) => (
            <Card key={subject.subject}>
              <CardHeader>
                <CardTitle>{subject.subject}</CardTitle>
                <CardDescription>
                  Average Score: {subject.average}% | Class Rank: {subject.rank}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-sankalp-100">
                        <TableHead>Test Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Max Score</TableHead>
                        <TableHead>Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subject.tests.map((test, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{test.name}</TableCell>
                          <TableCell>{test.date}</TableCell>
                          <TableCell>{test.score}</TableCell>
                          <TableCell>{test.maxScore}</TableCell>
                          <TableCell>
                            <Badge
                              variant={test.score >= 90 ? "success" : test.score >= 75 ? "default" : "destructive"}
                              className={test.score >= 90 ? "bg-green-500 hover:bg-green-600" : ""}
                            >
                              {((test.score / test.maxScore) * 100).toFixed(1)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4">
                  <p className="font-medium">Teacher's Remarks:</p>
                  <p className="text-muted-foreground">{subject.teacherRemarks}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Attendance Report</h3>
            <div className="flex items-center gap-2">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {attendanceData.monthly.map((item) => (
                    <SelectItem key={item.month} value={item.month}>
                      {item.month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">Download Report</Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance</CardTitle>
                <CardDescription>Attendance record by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-sankalp-100">
                        <TableHead>Month</TableHead>
                        <TableHead>Present</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMonthlyAttendance.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.month}</TableCell>
                          <TableCell>{item.present}</TableCell>
                          <TableCell>{item.total}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.percentage >= 90 ? "success" : item.percentage >= 75 ? "default" : "destructive"
                              }
                              className={item.percentage >= 90 ? "bg-green-500 hover:bg-green-600" : ""}
                            >
                              {item.percentage}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Attendance</CardTitle>
                <CardDescription>Attendance record by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-sankalp-100">
                        <TableHead>Subject</TableHead>
                        <TableHead>Present</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceData.subjects.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.subject}</TableCell>
                          <TableCell>{item.present}</TableCell>
                          <TableCell>{item.total}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.percentage >= 90 ? "success" : item.percentage >= 75 ? "default" : "destructive"
                              }
                              className={item.percentage >= 90 ? "bg-green-500 hover:bg-green-600" : ""}
                            >
                              {item.percentage}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
              <CardDescription>Track your progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md p-4">
                <p className="text-muted-foreground">Progress charts will be available soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
