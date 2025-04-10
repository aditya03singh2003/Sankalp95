"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Check, Clock, FileText, Search } from "lucide-react"

export default function TeacherMarksPage() {
  const { data: session } = useSession()
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedExam, setSelectedExam] = useState("")
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Sample data for exams
  const exams = ["Unit Test 1", "Mid Term", "Unit Test 2", "Final Exam"]

  useEffect(() => {
    if (session?.user?.id) {
      fetchTeacherClasses()
    }
  }, [session])

  useEffect(() => {
    if (selectedClass && selectedSubject && selectedExam) {
      fetchStudents()
    }
  }, [selectedClass, selectedSubject, selectedExam])

  const fetchTeacherClasses = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/teachers/${session.user.id}/classes`)

      if (response.ok) {
        const data = await response.json()

        // Extract unique classes and subjects
        const uniqueClasses = [...new Set(data.classes.map((c) => c.grade))]
        setClasses(uniqueClasses)

        // Group subjects by class
        const subjectsByClass = {}
        data.classes.forEach((c) => {
          if (!subjectsByClass[c.grade]) {
            subjectsByClass[c.grade] = []
          }
          subjectsByClass[c.grade].push(c.subject)
        })
        setSubjects(subjectsByClass)

        // Set default selections if available
        if (uniqueClasses.length > 0) {
          setSelectedClass(uniqueClasses[0])
          if (subjectsByClass[uniqueClasses[0]]?.length > 0) {
            setSelectedSubject(subjectsByClass[uniqueClasses[0]][0])
          }
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch your assigned classes",
        })
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      setLoading(true)

      // Fetch students in the selected class
      const response = await fetch(`/api/students/class?grade=${selectedClass}`)

      if (response.ok) {
        const data = await response.json()

        // Check if marks already exist for this exam
        const marksResponse = await fetch(
          `/api/marks?class=${selectedClass}&subject=${selectedSubject}&exam=${selectedExam}`,
        )

        if (marksResponse.ok) {
          const marksData = await marksResponse.json()

          // Merge student data with existing marks
          const studentsWithMarks = data.students.map((student) => {
            const existingMark = marksData.marks.find((m) => m.studentId === student._id)

            return {
              id: student._id,
              name: student.name,
              rollNumber: student.rollNumber || "N/A",
              marks: existingMark ? existingMark.marksObtained : "",
              totalMarks: existingMark ? existingMark.totalMarks : 100,
              grade: existingMark ? existingMark.grade : "",
              remarks: existingMark ? existingMark.remarks : "",
            }
          })

          setStudents(studentsWithMarks)
        } else {
          // No existing marks, initialize with empty marks
          setStudents(
            data.students.map((student) => ({
              id: student._id,
              name: student.name,
              rollNumber: student.rollNumber || "N/A",
              marks: "",
              totalMarks: 100,
              grade: "",
              remarks: "",
            })),
          )
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch students",
        })
      }
    } catch (error) {
      console.error("Error fetching students:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch students",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMarksChange = (studentId, value) => {
    setStudents(
      students.map((student) => {
        if (student.id === studentId) {
          // Calculate grade based on marks
          let grade = ""
          const marks = Number.parseInt(value) || 0
          const percentage = (marks / student.totalMarks) * 100

          if (percentage >= 90) grade = "A+"
          else if (percentage >= 80) grade = "A"
          else if (percentage >= 70) grade = "B+"
          else if (percentage >= 60) grade = "B"
          else if (percentage >= 50) grade = "C"
          else if (percentage >= 40) grade = "D"
          else grade = "F"

          return {
            ...student,
            marks: value,
            grade,
          }
        }
        return student
      }),
    )
  }

  const handleRemarksChange = (studentId, value) => {
    setStudents(
      students.map((student) => {
        if (student.id === studentId) {
          return {
            ...student,
            remarks: value,
          }
        }
        return student
      }),
    )
  }

  const saveMarks = async () => {
    try {
      setSaving(true)

      // Validate marks
      const invalidMarks = students.some(
        (student) =>
          student.marks !== "" &&
          (isNaN(Number.parseInt(student.marks)) ||
            Number.parseInt(student.marks) < 0 ||
            Number.parseInt(student.marks) > student.totalMarks),
      )

      if (invalidMarks) {
        toast({
          variant: "destructive",
          title: "Invalid marks",
          description: `Marks must be between 0 and ${students[0].totalMarks}`,
        })
        return
      }

      const response = await fetch("/api/marks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class: selectedClass,
          subject: selectedSubject,
          examName: selectedExam,
          date: new Date().toISOString(),
          marks: students.map((student) => ({
            studentId: student.id,
            marksObtained: student.marks === "" ? null : Number.parseInt(student.marks),
            totalMarks: student.totalMarks,
            grade: student.grade,
            remarks: student.remarks,
          })),
        }),
      })

      if (response.ok) {
        toast({
          title: "Marks saved",
          description: `Marks for ${selectedClass} - ${selectedSubject} - ${selectedExam} have been saved.`,
        })
      } else {
        throw new Error("Failed to save marks")
      }
    } catch (error) {
      console.error("Error saving marks:", error)
      toast({
        variant: "destructive",
        title: "Error saving marks",
        description: error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Student Marks</h2>
          <p className="text-muted-foreground">Enter and manage marks for your classes</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Marks</CardTitle>
          <CardDescription>Select class, subject, and exam to enter marks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem, index) => (
                    <SelectItem key={index} value={classItem}>
                      {classItem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
                disabled={!selectedClass || !subjects[selectedClass]?.length}
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {selectedClass &&
                    subjects[selectedClass]?.map((subject, index) => (
                      <SelectItem key={index} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam">Exam/Test</Label>
              <Select value={selectedExam} onValueChange={setSelectedExam} disabled={!selectedSubject}>
                <SelectTrigger id="exam">
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam, index) => (
                    <SelectItem key={index} value={exam}>
                      {exam}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedClass && selectedSubject && selectedExam ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name or roll number..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-sankalp-100">
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="w-[120px]">Marks (/{students[0]?.totalMarks || 100})</TableHead>
                      <TableHead className="w-[80px]">Grade</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          <Clock className="h-5 w-5 animate-spin mx-auto mb-2" />
                          <p>Loading student data...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No students found in this class
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student, index) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{student.rollNumber}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max={student.totalMarks}
                              value={student.marks}
                              onChange={(e) => handleMarksChange(student.id, e.target.value)}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <div
                              className={`text-center font-medium ${
                                student.grade === "A+" || student.grade === "A"
                                  ? "text-green-600"
                                  : student.grade === "F"
                                    ? "text-red-600"
                                    : ""
                              }`}
                            >
                              {student.grade || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={student.remarks}
                              onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                              placeholder="Optional remarks"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  className="bg-sankalp-600 hover:bg-sankalp-700 text-black"
                  onClick={saveMarks}
                  disabled={saving || loading}
                >
                  {saving ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Marks
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Exam Selected</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please select a class, subject, and exam to enter marks
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
