"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { BookOpen, Clock, FileText, Trophy } from "lucide-react"

export default function StudentMarksPage() {
  const { data: session } = useSession()
  const [marks, setMarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedExam, setSelectedExam] = useState("all")
  const [studentInfo, setStudentInfo] = useState(null)

  useEffect(() => {
    if (session?.user?.id) {
      fetchStudentInfo()
      fetchMarks()
    }
  }, [session])

  const fetchStudentInfo = async () => {
    try {
      const response = await fetch(`/api/students/${session.user.studentId}`)

      if (response.ok) {
        const data = await response.json()
        setStudentInfo(data.student)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch student information",
        })
      }
    } catch (error) {
      console.error("Error fetching student info:", error)
    }
  }

  const fetchMarks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/students/${session.user.studentId}/marks`)

      if (response.ok) {
        const data = await response.json()
        setMarks(data.marks || [])
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch marks",
        })
      }
    } catch (error) {
      console.error("Error fetching marks:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter marks based on selected exam
  const filteredMarks = selectedExam === "all" ? marks : marks.filter((mark) => mark.examName === selectedExam)

  // Group marks by exam
  const marksByExam = {}
  marks.forEach((mark) => {
    if (!marksByExam[mark.examName]) {
      marksByExam[mark.examName] = []
    }
    marksByExam[mark.examName].push(mark)
  })

  // Calculate overall performance
  const calculateOverallPerformance = (examMarks) => {
    if (!examMarks || examMarks.length === 0) return { percentage: 0, grade: "-" }

    const totalObtained = examMarks.reduce((sum, mark) => sum + mark.marksObtained, 0)
    const totalMax = examMarks.reduce((sum, mark) => sum + mark.totalMarks, 0)
    const percentage = Math.round((totalObtained / totalMax) * 100)

    let grade = ""
    if (percentage >= 90) grade = "A+"
    else if (percentage >= 80) grade = "A"
    else if (percentage >= 70) grade = "B+"
    else if (percentage >= 60) grade = "B"
    else if (percentage >= 50) grade = "C"
    else if (percentage >= 40) grade = "D"
    else grade = "F"

    return { percentage, grade }
  }

  // Get unique exam names
  const examNames = [...new Set(marks.map((mark) => mark.examName))]

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not provided"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Academic Performance</h2>
          <p className="text-muted-foreground">View your test and exam results</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Performance</CardTitle>
            <Trophy className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateOverallPerformance(marks).percentage}%</div>
            <p className="text-xs text-muted-foreground">Grade: {calculateOverallPerformance(marks).grade}</p>
          </CardContent>
        </Card>

        {examNames.slice(0, 3).map((examName, index) => {
          const performance = calculateOverallPerformance(marksByExam[examName])

          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{examName}</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performance.percentage}%</div>
                <p className="text-xs text-muted-foreground">Grade: {performance.grade}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Marks Details</CardTitle>
            <CardDescription>Your performance in tests and exams</CardDescription>
          </div>
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exams</SelectItem>
              {examNames.map((exam, index) => (
                <SelectItem key={index} value={exam}>
                  {exam}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8 text-center">
              <div className="space-y-2">
                <Clock className="h-12 w-12 animate-spin text-muted-foreground mx-auto" />
                <h3 className="text-lg font-medium">Loading marks data...</h3>
              </div>
            </div>
          ) : filteredMarks.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-center">
              <div className="space-y-2">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-medium">No marks found</h3>
                <p className="text-sm text-muted-foreground">No marks have been recorded for you yet</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="table" className="w-full">
              <TabsList className="bg-sankalp-100 text-black">
                <TabsTrigger value="table" className="data-[state=active]:bg-sankalp-500">
                  Table View
                </TabsTrigger>
                <TabsTrigger value="subject" className="data-[state=active]:bg-sankalp-500">
                  Subject-wise
                </TabsTrigger>
              </TabsList>

              <TabsContent value="table" className="space-y-4 mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-sankalp-50">
                        <TableHead>Subject</TableHead>
                        <TableHead>Exam</TableHead>
                        <TableHead>Marks</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMarks.map((mark, index) => (
                        <TableRow key={index}>
                          <TableCell>{mark.subject}</TableCell>
                          <TableCell>{mark.examName}</TableCell>
                          <TableCell>
                            {mark.marksObtained}/{mark.totalMarks}
                            <span className="text-muted-foreground text-xs ml-1">
                              ({Math.round((mark.marksObtained / mark.totalMarks) * 100)}%)
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                mark.grade === "A" || mark.grade === "A+"
                                  ? "success"
                                  : mark.grade === "F"
                                    ? "destructive"
                                    : "outline"
                              }
                              className={
                                mark.grade === "A" || mark.grade === "A+" ? "bg-green-500 hover:bg-green-600" : ""
                              }
                            >
                              {mark.grade}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(mark.date)}</TableCell>
                          <TableCell>{mark.remarks || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="subject" className="space-y-4 mt-4">
                {/* Group marks by subject */}
                {Object.entries(
                  filteredMarks.reduce((acc, mark) => {
                    if (!acc[mark.subject]) acc[mark.subject] = []
                    acc[mark.subject].push(mark)
                    return acc
                  }, {}),
                ).map(([subject, subjectMarks]) => (
                  <Card key={subject} className="mb-4">
                    <CardHeader className="bg-sankalp-50 py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">{subject}</CardTitle>
                        <Badge
                          variant={
                            calculateOverallPerformance(subjectMarks).grade === "A+" ||
                            calculateOverallPerformance(subjectMarks).grade === "A"
                              ? "success"
                              : "outline"
                          }
                          className={
                            calculateOverallPerformance(subjectMarks).grade === "A+" ||
                            calculateOverallPerformance(subjectMarks).grade === "A"
                              ? "bg-green-500"
                              : ""
                          }
                        >
                          {calculateOverallPerformance(subjectMarks).percentage}% Overall
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-sankalp-50/50">
                            <TableHead>Exam</TableHead>
                            <TableHead>Marks</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subjectMarks.map((mark, index) => (
                            <TableRow key={index}>
                              <TableCell>{mark.examName}</TableCell>
                              <TableCell>
                                {mark.marksObtained}/{mark.totalMarks}
                                <span className="text-muted-foreground text-xs ml-1">
                                  ({Math.round((mark.marksObtained / mark.totalMarks) * 100)}%)
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    mark.grade === "A" || mark.grade === "A+"
                                      ? "success"
                                      : mark.grade === "F"
                                        ? "destructive"
                                        : "outline"
                                  }
                                  className={
                                    mark.grade === "A" || mark.grade === "A+" ? "bg-green-500 hover:bg-green-600" : ""
                                  }
                                >
                                  {mark.grade}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(mark.date)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
