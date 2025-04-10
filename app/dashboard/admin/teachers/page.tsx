"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export default function TeachersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [teachers, setTeachers] = useState<any[]>([])
  const [filteredTeachers, setFilteredTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [teacherToDelete, setTeacherToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/teachers")

      if (response.ok) {
        const data = await response.json()
        console.log(`Fetched ${data.length} teachers`)
        setTeachers(data)
        setFilteredTeachers(data)
      } else {
        console.error("Failed to fetch teachers")
        toast({
          title: "Error",
          description: "Failed to fetch teachers",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching teachers:", error)
      toast({
        title: "Error",
        description: "Failed to fetch teachers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [toast])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTeachers(teachers)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = teachers.filter(
        (teacher) =>
          teacher.name?.toLowerCase().includes(query) ||
          teacher.email?.toLowerCase().includes(query) ||
          teacher.teacherId?.toLowerCase().includes(query) ||
          teacher.specialization?.toLowerCase().includes(query),
      )
      setFilteredTeachers(filtered)
    }
  }, [searchQuery, teachers])

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true)
      const response = await fetch(`/api/teachers/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTeachers((prev) => prev.filter((teacher) => teacher._id !== id))
        setFilteredTeachers((prev) => prev.filter((teacher) => teacher._id !== id))
        toast({
          title: "Success",
          description: "Teacher deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete teacher",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting teacher:", error)
      toast({
        title: "Error",
        description: "Failed to delete teacher",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setTeacherToDelete(null)
    }
  }

  const confirmDelete = (id: string) => {
    setTeacherToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchTeachers()
  }

  async function updateTeacherEmployeeIds() {
    try {
      const response = await fetch("/api/teachers/update-employee-ids", {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.message,
        })
        fetchTeachers() // Refresh the teacher list
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update teacher employee IDs")
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teachers</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
          <Button onClick={() => router.push("/dashboard/admin/teachers/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
          <Button variant="outline" size="sm" onClick={updateTeacherEmployeeIds} className="ml-2">
            Update Employee IDs
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search</CardTitle>
          <CardDescription>Search teachers by name, email, ID, or specialization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email, ID, or specialization..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teacher List</CardTitle>
          <CardDescription>Manage all teachers in the coaching center</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No teachers found. Try adjusting your search or add a new teacher.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">S.No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Teacher ID</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.map((teacher, index) => (
                    <TableRow key={teacher._id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell>{teacher.teacherId || "Not assigned"}</TableCell>
                      <TableCell>{teacher.specialization}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacher.phone}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/teachers/${teacher._id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/admin/teachers/${teacher._id}/edit`)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => confirmDelete(teacher._id)}
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
              This action cannot be undone. This will permanently delete the teacher and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => teacherToDelete && handleDelete(teacherToDelete)}
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
