"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Search, Plus, Eye, Pencil, Trash2, MoreHorizontal, RefreshCw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function StudentsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [students, setStudents] = useState<any[]>([])
  const [filteredStudents, setFilteredStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [classes, setClasses] = useState<any[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/classes")
      if (response.ok) {
        const data = await response.json()
        setClasses(data)
      } else {
        console.error("Failed to fetch classes")
        // Use default classes if API fails
        setClasses([
          { _id: "1", name: "Class 1" },
          { _id: "2", name: "Class 2" },
          { _id: "3", name: "Class 3" },
          { _id: "4", name: "Class 4" },
          { _id: "5", name: "Class 5" },
          { _id: "6", name: "Class 6" },
          { _id: "7", name: "Class 7" },
          { _id: "8", name: "Class 8" },
          { _id: "9", name: "Class 9" },
          { _id: "10", name: "Class 10" },
          { _id: "11", name: "Class 11" },
          { _id: "12", name: "Class 12" },
        ])
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
      // Use default classes if API fails
      setClasses([
        { _id: "1", name: "Class 1" },
        { _id: "2", name: "Class 2" },
        { _id: "3", name: "Class 3" },
        { _id: "4", name: "Class 4" },
        { _id: "5", name: "Class 5" },
        { _id: "6", name: "Class 6" },
        { _id: "7", name: "Class 7" },
        { _id: "8", name: "Class 8" },
        { _id: "9", name: "Class 9" },
        { _id: "10", name: "Class 10" },
        { _id: "11", name: "Class 11" },
        { _id: "12", name: "Class 12" },
      ])
    }
  }

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const url =
        selectedClass && selectedClass !== "all"
          ? `/api/students?class=${encodeURIComponent(selectedClass)}`
          : "/api/students"

      console.log("Fetching students from:", url)

      const response = await fetch(url)

      if (response.ok) {
        const data = await response.json()
        console.log(`Fetched ${data.length} students`)
        setStudents(data)
        setFilteredStudents(data)
      } else {
        console.error("Failed to fetch students")
        toast({
          title: "Error",
          description: "Failed to fetch students",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching students:", error)
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [selectedClass, toast])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStudents(students)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = students.filter(
        (student) =>
          student.name?.toLowerCase().includes(query) ||
          student.email?.toLowerCase().includes(query) ||
          student.studentId?.toLowerCase().includes(query) ||
          student.parentName?.toLowerCase().includes(query),
      )
      setFilteredStudents(filtered)
    }
  }, [searchQuery, students])

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true)
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setStudents((prev) => prev.filter((student) => student._id !== id))
        setFilteredStudents((prev) => prev.filter((student) => student._id !== id))
        toast({
          title: "Success",
          description: "Student deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete student",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting student:", error)
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setStudentToDelete(null)
    }
  }

  const confirmDelete = (id: string) => {
    setStudentToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchStudents()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
          <Button onClick={() => router.push("/dashboard/admin/students/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter students by class or search by name, email, or ID</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls._id} value={cls.name}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-2/3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name, email, or ID..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>Manage all students in the coaching center</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No students found. Try adjusting your filters or add a new student.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">S.No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Parent Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.studentId || "Not assigned"}</TableCell>
                      <TableCell>{student.class || "Not assigned"}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.parentName}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/students/${student._id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/admin/students/${student._id}/edit`)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => confirmDelete(student._id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => studentToDelete && handleDelete(studentToDelete)}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
