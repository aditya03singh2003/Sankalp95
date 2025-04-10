"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Loader2,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  FileCheck,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function PaymentsPage() {
  const { toast } = useToast()
  const [payments, setPayments] = useState<any[]>([])
  const [filteredPayments, setFilteredPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [error, setError] = useState<string | null>(null)
  const [students, setStudents] = useState<any[]>([])
  const [pendingPayments, setPendingPayments] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [teacherSalaries, setTeacherSalaries] = useState<any[]>([])
  const [filteredSalaries, setFilteredSalaries] = useState<any[]>([])
  const [salarySearchTerm, setSalarySearchTerm] = useState("")
  const [salaryStatusFilter, setSalaryStatusFilter] = useState("all")
  const [loadingTeachers, setLoadingTeachers] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash")
  const [selectedAmount, setSelectedAmount] = useState("")
  const [selectedPaymentId, setSelectedPaymentId] = useState("")
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0])
  const [paymentNotes, setPaymentNotes] = useState("")
  const [processingPayment, setProcessingPayment] = useState(false)
  const [processingSalary, setProcessingSalary] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [selectedTeacherId, setSelectedTeacherId] = useState("")
  const [selectedTeacherName, setSelectedTeacherName] = useState("")
  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false)
  const [selectedSalaryAmount, setSelectedSalaryAmount] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all students first
        const studentsResponse = await fetch("/api/students")
        if (!studentsResponse.ok) {
          throw new Error("Failed to fetch students")
        }
        const studentsData = await studentsResponse.json()
        setStudents(studentsData)

        // Fetch payments
        const paymentsResponse = await fetch("/api/payments")
        if (!paymentsResponse.ok) {
          throw new Error("Failed to fetch payments")
        }
        const paymentsData = await paymentsResponse.json()

        console.log("Fetched payments:", paymentsData)

        // Filter out any payments with null or undefined studentId
        const validPayments = paymentsData.filter((payment) => payment.studentId)
        setPayments(validPayments)
        setFilteredPayments(validPayments)

        // Generate pending payments for students who don't have any payment records
        const studentsWithoutPayments = studentsData.filter(
          (student: any) => !validPayments.some((payment: any) => payment.studentId === student._id.toString()),
        )

        console.log("Students without payments:", studentsWithoutPayments.length)

        const pendingPaymentsData = studentsWithoutPayments.map((student: any) => ({
          _id: `pending-${student._id}`,
          studentId: student._id.toString(),
          student: student,
          amount: 0,
          status: "pending",
          month: new Date().toLocaleString("default", { month: "long" }),
          year: new Date().getFullYear(),
          paymentDate: null,
          paymentMethod: null,
          createdAt: student.createdAt,
        }))

        setPendingPayments(pendingPaymentsData)

        // Combine actual payments with pending payments
        const allPayments = [...validPayments, ...pendingPaymentsData]
        setPayments(allPayments)
        setFilteredPayments(allPayments)
      } catch (error) {
        console.error("Error fetching payments:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch payments")
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch payments",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [toast])

  useEffect(() => {
    const fetchTeacherSalaries = async () => {
      try {
        setLoadingTeachers(true)

        // Fetch all teachers
        const teachersResponse = await fetch("/api/teachers")
        if (!teachersResponse.ok) {
          throw new Error("Failed to fetch teachers")
        }
        const teachersData = await teachersResponse.json()
        setTeachers(teachersData)

        // Fetch teacher salaries
        const salariesResponse = await fetch("/api/teachers/salary")
        if (!salariesResponse.ok) {
          throw new Error("Failed to fetch teacher salaries")
        }
        const salariesData = await salariesResponse.json()

        // Process salary data
        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear()

        // Create salary records for all teachers
        const allSalaries = teachersData.map((teacher: any) => {
          // Find existing salary record for this month
          const existingSalary = salariesData.find(
            (s: any) => s.teacherId === teacher._id && s.month === currentMonth && s.year === currentYear,
          )

          if (existingSalary) {
            return {
              ...existingSalary,
              teacher: teacher,
            }
          }

          // Create a new pending salary record
          return {
            _id: `pending-${teacher._id}-${currentMonth}-${currentYear}`,
            teacherId: teacher._id,
            teacher: teacher,
            amount: teacher.salary || 0,
            status: "pending",
            month: currentMonth,
            year: currentYear,
            paymentDate: null,
            paymentMethod: null,
          }
        })

        setTeacherSalaries(allSalaries)
        setFilteredSalaries(allSalaries)
      } catch (error) {
        console.error("Error fetching teacher salaries:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch teacher salaries",
          variant: "destructive",
        })
      } finally {
        setLoadingTeachers(false)
      }
    }

    fetchTeacherSalaries()
  }, [toast])

  useEffect(() => {
    // Filter payments based on search term and status filter
    let filtered = [...payments]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((payment) => {
        const studentName = payment.student?.name?.toLowerCase() || ""
        const studentId = payment.student?.studentId?.toLowerCase() || ""
        const studentClass = payment.student?.class?.toLowerCase() || ""
        return studentName.includes(term) || studentId.includes(term) || studentClass.includes(term)
      })
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter)
    }

    setFilteredPayments(filtered)
  }, [searchTerm, statusFilter, payments])

  useEffect(() => {
    // Filter teacher salaries based on search term and status filter
    let filtered = [...teacherSalaries]

    if (salarySearchTerm) {
      const term = salarySearchTerm.toLowerCase()
      filtered = filtered.filter((salary) => {
        const teacherName = salary.teacher?.name?.toLowerCase() || ""
        const teacherEmail = salary.teacher?.email?.toLowerCase() || ""
        return teacherName.includes(term) || teacherEmail.includes(term)
      })
    }

    if (salaryStatusFilter !== "all") {
      filtered = filtered.filter((salary) => salary.status === salaryStatusFilter)
    }

    setFilteredSalaries(filtered)
  }, [salarySearchTerm, salaryStatusFilter, teacherSalaries])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="success" className="flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="destructive" className="flex items-center">
            <XCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="flex items-center">
            {status}
          </Badge>
        )
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <Banknote className="h-4 w-4 mr-1" />
      case "card":
        return <CreditCard className="h-4 w-4 mr-1" />
      case "upi":
        return <Smartphone className="h-4 w-4 mr-1" />
      case "bank":
        return <Building2 className="h-4 w-4 mr-1" />
      case "cheque":
        return <FileCheck className="h-4 w-4 mr-1" />
      default:
        return <CreditCard className="h-4 w-4 mr-1" />
    }
  }

  const openPaymentDialog = (paymentId: string, amount = "0") => {
    setSelectedPaymentId(paymentId)
    setSelectedAmount(amount)
    setPaymentDate(new Date().toISOString().split("T")[0])
    setPaymentNotes("")
    setIsPaymentDialogOpen(true)
  }

  const openSalaryDialog = (teacherId: string, teacherName: string, amount = "0") => {
    setSelectedTeacherId(teacherId)
    setSelectedTeacherName(teacherName)
    setSelectedSalaryAmount(amount)
    setPaymentDate(new Date().toISOString().split("T")[0])
    setPaymentNotes("")
    setSelectedPaymentMethod("bank")
    setIsSalaryDialogOpen(true)
  }

  const handleMarkAsPaid = async (paymentId) => {
    try {
      setIsUpdating(true)

      // Get the payment details
      const payment = payments.find((p) => p._id === paymentId)
      if (!payment) {
        throw new Error("Payment not found")
      }

      console.log("Marking payment as paid:", payment)

      // Check if this is a pending payment that doesn't exist in the database yet
      if (paymentId.startsWith("pending-")) {
        // Extract the student ID
        const studentId = paymentId.split("-")[1]

        // Create a new payment record
        const response = await fetch("/api/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: studentId,
            amount: Number(selectedAmount) || 0,
            month: new Date().toLocaleString("default", { month: "long" }),
            year: new Date().getFullYear(),
            status: "paid",
            paymentDate: new Date().toISOString(),
            paymentMethod: selectedPaymentMethod,
            notes: paymentNotes,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create payment record")
        }

        const newPayment = await response.json()
        console.log("Created new payment:", newPayment)

        // Update the payments list
        setPayments((prev) => {
          const filtered = prev.filter((p) => p._id !== paymentId)
          return [...filtered, newPayment]
        })
      } else {
        // Update existing payment record
        const response = await fetch(`/api/payments/${paymentId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "paid",
            paymentMethod: selectedPaymentMethod || "cash",
            paymentDate: new Date(paymentDate).toISOString(),
            notes: paymentNotes,
            amount: Number(selectedAmount) || payment.amount,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("API error response:", errorData)
          throw new Error(errorData.error || "Failed to update payment status")
        }

        const updatedPayment = await response.json()
        console.log("Updated payment:", updatedPayment)

        // Update the payments list
        setPayments((prev) => prev.map((p) => (p._id === paymentId ? { ...p, ...updatedPayment } : p)))
      }

      setIsPaymentDialogOpen(false)

      toast({
        title: "Payment Processed",
        description: "The payment has been successfully processed.",
      })
    } catch (error) {
      console.error("Error processing payment:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process payment",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSalaryPayment = async () => {
    try {
      if (!selectedTeacherId) return

      setProcessingSalary(true)
      setIsSalaryDialogOpen(false)

      // Check if this is a pending salary that doesn't exist in the database yet
      if (selectedTeacherId.startsWith("pending-")) {
        const parts = selectedTeacherId.split("-")
        const teacherId = parts[1]
        const month = Number.parseInt(parts[2])
        const year = Number.parseInt(parts[3])

        // Find the teacher
        const teacher = teachers.find((t) => t._id === teacherId)
        if (!teacher) {
          throw new Error("Teacher not found")
        }

        // Create a new salary record
        const response = await fetch("/api/teachers/salary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teacherId,
            amount: Number(selectedSalaryAmount) || teacher.salary || 0,
            status: "paid",
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            paymentDate: new Date(paymentDate).toISOString(),
            paymentMethod: selectedPaymentMethod,
            notes: paymentNotes,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create salary record")
        }

        const newSalary = await response.json()

        // Update the salaries list
        setTeacherSalaries((prev) => {
          const filtered = prev.filter((s) => s._id !== selectedTeacherId)
          return [...filtered, { ...newSalary, teacher }]
        })

        // Show success dialog
        setSuccessMessage(`Salary payment for ${selectedTeacherName} has been processed.`)
        setShowSuccessDialog(true)

        // Also show toast notification
        toast({
          title: "Success",
          description: `Salary payment for ${selectedTeacherName} has been processed.`,
        })
      } else {
        // Update existing salary record
        const response = await fetch(`/api/teachers/salary/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            salaryId: selectedTeacherId,
            status: "paid",
            paymentDate: new Date(paymentDate).toISOString(),
            paymentMethod: selectedPaymentMethod,
            notes: paymentNotes,
            amount: Number(selectedSalaryAmount) || 0,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update salary status")
        }

        const updatedSalary = await response.json()

        // Update the salaries list
        setTeacherSalaries((prev) =>
          prev.map((salary) =>
            salary._id === selectedTeacherId ? { ...updatedSalary, teacher: salary.teacher } : salary,
          ),
        )

        // Show success dialog
        setSuccessMessage(`Salary payment for ${selectedTeacherName} has been processed.`)
        setShowSuccessDialog(true)

        // Also show toast notification
        toast({
          title: "Success",
          description: `Salary payment for ${selectedTeacherName} has been processed.`,
        })
      }
    } catch (error) {
      console.error("Error updating salary:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update salary",
        variant: "destructive",
      })
    } finally {
      setProcessingSalary(false)
      setSelectedTeacherId("")
      setSelectedTeacherName("")
      setSelectedSalaryAmount("")
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Payment Management</h1>

      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-md flex items-center text-red-800">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      )}

      <Tabs defaultValue="student-fees">
        <TabsList className="mb-6">
          <TabsTrigger value="student-fees">Student Fees</TabsTrigger>
          <TabsTrigger value="teacher-salaries">Teacher Salaries</TabsTrigger>
        </TabsList>

        <TabsContent value="student-fees">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Student Fee Records</CardTitle>
              <CardDescription>View and manage student fee payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name, ID, or class..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No payment records found</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Month/Year</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((payment) => {
                        // Find the student for this payment
                        const student = payment.student || students.find((s) => s._id === payment.studentId) || {}

                        return (
                          <TableRow key={payment._id}>
                            <TableCell className="font-medium">
                              {student.name || "Unknown Student"}
                              {student.studentId && (
                                <div className="text-xs text-muted-foreground">ID: {student.studentId}</div>
                              )}
                            </TableCell>
                            <TableCell>{student.class || "N/A"}</TableCell>
                            <TableCell>
                              {payment.month} {payment.year}
                            </TableCell>
                            <TableCell>{payment.amount ? `₹${payment.amount.toLocaleString()}` : "Not set"}</TableCell>
                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                            <TableCell>
                              {payment.paymentDate ? format(new Date(payment.paymentDate), "dd MMM yyyy") : "Not paid"}
                            </TableCell>
                            <TableCell>
                              {payment.paymentMethod ? (
                                <Badge variant="outline" className="flex items-center">
                                  {getPaymentMethodIcon(payment.paymentMethod)}
                                  {payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1)}
                                </Badge>
                              ) : (
                                "Not set"
                              )}
                            </TableCell>
                            <TableCell>
                              {payment.status !== "paid" && (
                                <Button
                                  size="sm"
                                  onClick={() => openPaymentDialog(payment._id, payment.amount?.toString() || "0")}
                                  disabled={isUpdating}
                                >
                                  {isUpdating && payment._id === selectedPaymentId ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : null}
                                  Mark as Paid
                                </Button>
                              )}
                              {payment.status === "paid" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    // Navigate to payment details or receipt
                                    // router.push(`/dashboard/admin/payments/${payment._id}`)
                                  }}
                                >
                                  View Receipt
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teacher-salaries">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Teacher Salary Records</CardTitle>
              <CardDescription>View and manage teacher salary payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by teacher name or email..."
                    className="pl-8"
                    value={salarySearchTerm}
                    onChange={(e) => setSalarySearchTerm(e.target.value)}
                  />
                </div>
                <Select value={salaryStatusFilter} onValueChange={setSalaryStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loadingTeachers ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredSalaries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No salary records found</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Month/Year</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSalaries.map((salary) => {
                        const teacher = salary.teacher || {}
                        const monthName = new Date(0, salary.month - 1).toLocaleString("default", { month: "long" })

                        return (
                          <TableRow key={salary._id}>
                            <TableCell className="font-medium">
                              {teacher.name || "Unknown Teacher"}
                              <div className="text-xs text-muted-foreground">{teacher.email}</div>
                            </TableCell>
                            <TableCell>
                              {monthName} {salary.year}
                            </TableCell>
                            <TableCell>{salary.amount ? `₹${salary.amount.toLocaleString()}` : "Not set"}</TableCell>
                            <TableCell>{getStatusBadge(salary.status)}</TableCell>
                            <TableCell>
                              {salary.paymentDate ? format(new Date(salary.paymentDate), "dd MMM yyyy") : "Not paid"}
                            </TableCell>
                            <TableCell>
                              {salary.status !== "paid" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    openSalaryDialog(
                                      salary._id,
                                      teacher.name || "Unknown Teacher",
                                      salary.amount?.toString() || teacher.salary?.toString() || "0",
                                    )
                                  }
                                  disabled={processingSalary}
                                >
                                  {processingSalary && salary._id === selectedTeacherId ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : null}
                                  Mark as Paid
                                </Button>
                              )}
                              {salary.status === "paid" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    // Navigate to salary details or receipt
                                  }}
                                >
                                  View Details
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Student Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>Enter payment details to mark this fee as paid.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount (₹)
              </Label>
              <Input
                id="amount"
                type="number"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment-method" className="text-right">
                Payment Method
              </Label>
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger id="payment-method" className="col-span-3">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center">
                      <Banknote className="mr-2 h-4 w-4" />
                      <span>Cash</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Card</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="upi">
                    <div className="flex items-center">
                      <Smartphone className="mr-2 h-4 w-4" />
                      <span>UPI</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="bank">
                    <div className="flex items-center">
                      <Building2 className="mr-2 h-4 w-4" />
                      <span>Bank Transfer</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cheque">
                    <div className="flex items-center">
                      <FileCheck className="mr-2 h-4 w-4" />
                      <span>Cheque</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment-date" className="text-right">
                Payment Date
              </Label>
              <Input
                id="payment-date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment-notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="payment-notes"
                placeholder="Any additional notes about this payment"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleMarkAsPaid(selectedPaymentId)} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mark as Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Teacher Salary Dialog */}
      <Dialog open={isSalaryDialogOpen} onOpenChange={setIsSalaryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Salary Payment</DialogTitle>
            <DialogDescription>Enter payment details to process salary for {selectedTeacherName}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary-amount" className="text-right">
                Amount (₹)
              </Label>
              <Input
                id="salary-amount"
                type="number"
                value={selectedSalaryAmount}
                onChange={(e) => setSelectedSalaryAmount(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary-payment-method" className="text-right">
                Payment Method
              </Label>
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger id="salary-payment-method" className="col-span-3">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center">
                      <Banknote className="mr-2 h-4 w-4" />
                      <span>Cash</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="bank">
                    <div className="flex items-center">
                      <Building2 className="mr-2 h-4 w-4" />
                      <span>Bank Transfer</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="upi">
                    <div className="flex items-center">
                      <Smartphone className="mr-2 h-4 w-4" />
                      <span>UPI</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cheque">
                    <div className="flex items-center">
                      <FileCheck className="mr-2 h-4 w-4" />
                      <span>Cheque</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary-payment-date" className="text-right">
                Payment Date
              </Label>
              <Input
                id="salary-payment-date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary-payment-notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="salary-payment-notes"
                placeholder="Any additional notes about this salary payment"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSalaryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSalaryPayment} disabled={processingSalary}>
              {processingSalary && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription>{successMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
