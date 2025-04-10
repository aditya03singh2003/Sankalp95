"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Check, CreditCard, Download, FileText, Search, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
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
import { Banknote, Building2, Smartphone, FileCheck, Loader2 } from "lucide-react"
import { format } from "date-fns"

// Generate dummy salary data for teachers
const generateTeacherSalaryData = () => {
  const teachers = [
    { id: 1, name: "Amit Kumar", subject: "Mathematics", experience: "8 years", qualification: "M.Sc., B.Ed." },
    { id: 2, name: "Priya Singh", subject: "Physics", experience: "6 years", qualification: "M.Sc., B.Ed." },
    { id: 3, name: "Rajesh Verma", subject: "Chemistry", experience: "10 years", qualification: "Ph.D." },
    { id: 4, name: "Meena Sharma", subject: "Biology", experience: "7 years", qualification: "M.Sc., B.Ed." },
    { id: 5, name: "Sanjay Gupta", subject: "English", experience: "5 years", qualification: "M.A., B.Ed." },
    { id: 6, name: "Anjali Patel", subject: "Hindi", experience: "4 years", qualification: "M.A., B.Ed." },
    { id: 7, name: "Vikram Joshi", subject: "Social Studies", experience: "9 years", qualification: "M.A., B.Ed." },
    {
      id: 8,
      name: "Deepa Malhotra",
      subject: "Mathematics & Physics",
      experience: "12 years",
      qualification: "M.Sc., B.Ed.",
    },
    {
      id: 9,
      name: "Rahul Kapoor",
      subject: "Chemistry & Biology",
      experience: "8 years",
      qualification: "M.Sc., B.Ed.",
    },
    { id: 10, name: "Sunita Mehta", subject: "English & Hindi", experience: "6 years", qualification: "M.A., B.Ed." },
    { id: 11, name: "Pankaj Chauhan", subject: "All Subjects", experience: "15 years", qualification: "M.Sc., B.Ed." },
    {
      id: 12,
      name: "Neha Yadav",
      subject: "Mathematics & Science",
      experience: "7 years",
      qualification: "B.Tech., B.Ed.",
    },
  ]

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const currentMonth = new Date().getMonth()

  // Generate salary data for each teacher
  return teachers.map((teacher) => {
    // Base salary based on experience
    const experienceYears = Number.parseInt(teacher.experience.split(" ")[0])
    let baseSalary = 15000

    if (experienceYears > 10) {
      baseSalary = 30000
    } else if (experienceYears > 5) {
      baseSalary = 22000
    }

    // Adjust for subject complexity
    if (teacher.subject.includes("&") || teacher.subject === "All Subjects") {
      baseSalary += 5000
    }

    // Generate monthly salary data
    const salaryHistory = []
    for (let i = 0; i < 6; i++) {
      const monthIndex = (currentMonth - i + 12) % 12
      const month = months[monthIndex]
      const year = monthIndex > currentMonth ? new Date().getFullYear() - 1 : new Date().getFullYear()

      // Calculate working days and deductions
      const workingDays = 26
      const absentDays = Math.floor(Math.random() * 3)
      const deduction = Math.round((absentDays / workingDays) * baseSalary)

      // Calculate bonuses
      let bonus = 0
      if (month === "March" || month === "October") {
        bonus = Math.round(baseSalary * 0.1) // 10% bonus in festival months
      }

      // Calculate final salary
      const finalSalary = baseSalary - deduction + bonus

      // Payment status
      const isPaid = i < 2 || Math.random() > 0.1

      salaryHistory.push({
        month,
        year,
        baseSalary,
        workingDays,
        absentDays,
        deduction,
        bonus,
        finalSalary,
        status: isPaid ? "Paid" : "Pending",
        paymentDate: isPaid ? `${Math.floor(Math.random() * 5) + 1} ${month.substring(0, 3)} ${year}` : null,
        paymentMethod: isPaid ? ["Bank Transfer", "Cash", "UPI"][Math.floor(Math.random() * 3)] : null,
      })
    }

    return {
      ...teacher,
      baseSalary,
      salaryHistory,
    }
  })
}

export default function TeacherSalaryPage() {
  const [teacherSalaryData, setTeacherSalaryData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Add state variables for payment dialog
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedSalaryId, setSelectedSalaryId] = useState("")
  const [selectedTeacherName, setSelectedTeacherName] = useState("")
  const [selectedAmount, setSelectedAmount] = useState("")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0])
  const [paymentMethod, setPaymentMethod] = useState("bank")
  const [paymentNotes, setPaymentNotes] = useState("")
  const [processingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    const fetchTeacherSalaryData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/teachers/salary")

        if (response.ok) {
          const data = await response.json()
          setTeacherSalaryData(data.teachers)
        } else {
          // Fallback to dummy data if API fails
          setTeacherSalaryData(generateTeacherSalaryData())
        }
      } catch (error) {
        console.error("Error fetching teacher salary data:", error)
        // Fallback to dummy data
        setTeacherSalaryData(generateTeacherSalaryData())
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeacherSalaryData()
  }, [])

  // Add a function to update salary status
  const updateSalaryStatus = async (teacherId, month, year, status) => {
    try {
      const response = await fetch("/api/teachers/salary/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId,
          month,
          year,
          status,
        }),
      })

      if (response.ok) {
        // Update the local state to reflect the change
        setTeacherSalaryData((prevData) =>
          prevData.map((teacher) => {
            if (teacher.id === teacherId) {
              const updatedSalaryHistory = teacher.salaryHistory.map((salary) => {
                if (salary.month === month && salary.year === year) {
                  return { ...salary, status: status }
                }
                return salary
              })
              return { ...teacher, salaryHistory: updatedSalaryHistory }
            }
            return teacher
          }),
        )

        toast({
          title: "Salary status updated",
          description: `Teacher salary status has been updated to ${status}.`,
        })
      } else {
        throw new Error("Failed to update salary status")
      }
    } catch (error) {
      console.error("Error updating salary status:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update salary status. Please try again.",
      })
    }
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("March")

  // Filter teachers based on search term
  const filteredTeachers = teacherSalaryData.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get current month's salary data for each teacher
  const currentMonthSalaryData = filteredTeachers.map((teacher) => {
    const currentSalary = teacher.salaryHistory.find((s) => s.month === selectedMonth)
    return {
      ...teacher,
      currentSalary,
    }
  })

  // Calculate total salary disbursement for the selected month
  const totalSalaryDisbursement = currentMonthSalaryData.reduce((total, teacher) => {
    if (teacher.currentSalary?.status === "Paid") {
      return total + teacher.currentSalary.finalSalary
    }
    return total
  }, 0)

  // Calculate pending salary payments
  const pendingSalaryPayments = currentMonthSalaryData.reduce((total, teacher) => {
    if (teacher.currentSalary?.status === "Pending") {
      return total + teacher.currentSalary.finalSalary
    }
    return total
  }, 0)

  // Add function to open payment dialog
  const openPaymentDialog = (teacherId, teacherName, amount) => {
    setSelectedSalaryId(teacherId)
    setSelectedTeacherName(teacherName)
    setSelectedAmount(amount.toString())
    setPaymentDate(new Date().toISOString().split("T")[0])
    setPaymentMethod("bank")
    setPaymentNotes("")
    setIsPaymentDialogOpen(true)
  }

  // Add function to handle payment submission
  const handleSalaryPayment = async () => {
    try {
      setProcessingPayment(true)

      // Update the local state to reflect the change
      setTeacherSalaryData((prevData) =>
        prevData.map((teacher) => {
          if (teacher.id === selectedSalaryId) {
            const updatedSalaryHistory = teacher.salaryHistory.map((salary) => {
              if (salary.month === selectedMonth && salary.year === new Date().getFullYear()) {
                return {
                  ...salary,
                  status: "Paid",
                  paymentDate: format(new Date(paymentDate), "d MMM yyyy"),
                  paymentMethod: paymentMethod,
                }
              }
              return salary
            })
            return { ...teacher, salaryHistory: updatedSalaryHistory }
          }
          return teacher
        }),
      )

      // Call API to update salary status
      const response = await fetch("/api/teachers/salary/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId: selectedSalaryId,
          month: selectedMonth,
          year: new Date().getFullYear(),
          status: "Paid",
          paymentDate: new Date(paymentDate).toISOString(),
          paymentMethod: paymentMethod,
          notes: paymentNotes,
          amount: Number(selectedAmount),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Salary payment for ${selectedTeacherName} has been processed.`,
        })
      } else {
        throw new Error("Failed to update salary status")
      }
    } catch (error) {
      console.error("Error processing salary payment:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process salary payment. Please try again.",
      })
    } finally {
      setProcessingPayment(false)
      setIsPaymentDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Teacher Salary Management</h2>
          <p className="text-muted-foreground">Manage and process salary payments for teachers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm">
            <CreditCard className="mr-2 h-4 w-4" />
            Process Payments
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-users"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherSalaryData.length}</div>
            <p className="text-xs text-muted-foreground">Active faculty members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Salary (Monthly)</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{teacherSalaryData.reduce((total, teacher) => total + teacher.baseSalary, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Base salary without deductions/bonuses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disbursed ({selectedMonth})</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">₹{totalSalaryDisbursement.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Salaries paid for {selectedMonth}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending ({selectedMonth})</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">₹{pendingSalaryPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Pending payments for {selectedMonth}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search teachers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="January">January 2023</SelectItem>
              <SelectItem value="February">February 2023</SelectItem>
              <SelectItem value="March">March 2023</SelectItem>
              <SelectItem value="April">April 2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList className="bg-sankalp-100 text-black">
          <TabsTrigger value="current" className="data-[state=active]:bg-sankalp-500">
            Current Month
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-sankalp-500">
            Salary History
          </TabsTrigger>
          <TabsTrigger value="structure" className="data-[state=active]:bg-sankalp-500">
            Salary Structure
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Salary for {selectedMonth} 2023</CardTitle>
              <CardDescription>Manage and process salary payments for the current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-sankalp-100">
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Base Salary</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Bonus</TableHead>
                      <TableHead>Final Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentMonthSalaryData.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{teacher.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {teacher.experience} • {teacher.qualification}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{teacher.subject}</TableCell>
                        <TableCell>₹{teacher.baseSalary.toLocaleString()}</TableCell>
                        <TableCell>
                          {teacher.currentSalary?.deduction > 0 ? (
                            <span className="text-red-500">-₹{teacher.currentSalary.deduction.toLocaleString()}</span>
                          ) : (
                            <span>₹0</span>
                          )}
                          {teacher.currentSalary?.absentDays > 0 && (
                            <div className="text-xs text-muted-foreground">
                              ({teacher.currentSalary.absentDays} absent days)
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {teacher.currentSalary?.bonus > 0 ? (
                            <span className="text-green-500">+₹{teacher.currentSalary.bonus.toLocaleString()}</span>
                          ) : (
                            <span>₹0</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          ₹{teacher.currentSalary?.finalSalary.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={teacher.currentSalary?.status === "Paid" ? "success" : "outline"}>
                            {teacher.currentSalary?.status === "Paid" ? (
                              <Check className="mr-1 h-3 w-3" />
                            ) : (
                              <Calendar className="mr-1 h-3 w-3" />
                            )}
                            {teacher.currentSalary?.status}
                          </Badge>
                          {teacher.currentSalary?.paymentDate && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {teacher.currentSalary.paymentDate}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {teacher.currentSalary?.status === "Paid" ? (
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-3 w-3" />
                              Receipt
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-sankalp-600 hover:bg-sankalp-700 text-black"
                              onClick={() =>
                                openPaymentDialog(
                                  teacher.id,
                                  teacher.name,
                                  teacher.currentSalary?.finalSalary || teacher.baseSalary,
                                )
                              }
                            >
                              <CreditCard className="mr-2 h-3 w-3" />
                              Pay Now
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Salary Payment History</CardTitle>
              <CardDescription>View historical salary payments for all teachers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTeachers.slice(0, 3).map((teacher) => (
                  <div key={teacher.id} className="rounded-lg border p-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{teacher.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {teacher.subject} • {teacher.experience}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">Base Salary: ₹{teacher.baseSalary.toLocaleString()}/month</div>
                      </div>
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-sankalp-100">
                            <TableHead>Month</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Deductions</TableHead>
                            <TableHead>Bonus</TableHead>
                            <TableHead>Final Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment Date</TableHead>
                            <TableHead>Method</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {teacher.salaryHistory.map((salary, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {salary.month} {salary.year}
                              </TableCell>
                              <TableCell>₹{salary.baseSalary.toLocaleString()}</TableCell>
                              <TableCell>
                                {salary.deduction > 0 ? (
                                  <span className="text-red-500">-₹{salary.deduction.toLocaleString()}</span>
                                ) : (
                                  <span>₹0</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {salary.bonus > 0 ? (
                                  <span className="text-green-500">+₹{salary.bonus.toLocaleString()}</span>
                                ) : (
                                  <span>₹0</span>
                                )}
                              </TableCell>
                              <TableCell className="font-medium">₹{salary.finalSalary.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge variant={salary.status === "Paid" ? "success" : "outline"}>
                                  {salary.status === "Paid" ? (
                                    <Check className="mr-1 h-3 w-3" />
                                  ) : (
                                    <Calendar className="mr-1 h-3 w-3" />
                                  )}
                                  {salary.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{salary.paymentDate || "-"}</TableCell>
                              <TableCell>{salary.paymentMethod || "-"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}

                {filteredTeachers.length > 3 && (
                  <div className="text-center">
                    <Button variant="outline">View More Teachers</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Salary Structure</CardTitle>
              <CardDescription>View and manage salary structure for different teacher categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-semibold mb-4">Base Salary Structure</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-sankalp-100">
                          <TableHead>Experience Level</TableHead>
                          <TableHead>Qualification</TableHead>
                          <TableHead>Subject Category</TableHead>
                          <TableHead>Base Salary Range</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>0-5 years</TableCell>
                          <TableCell>B.Ed. with relevant degree</TableCell>
                          <TableCell>Single Subject</TableCell>
                          <TableCell>₹15,000 - ₹20,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>5-10 years</TableCell>
                          <TableCell>B.Ed. with relevant degree</TableCell>
                          <TableCell>Single Subject</TableCell>
                          <TableCell>₹20,000 - ₹25,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>10+ years</TableCell>
                          <TableCell>B.Ed. with relevant degree</TableCell>
                          <TableCell>Single Subject</TableCell>
                          <TableCell>₹25,000 - ₹30,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Any</TableCell>
                          <TableCell>Ph.D. with B.Ed.</TableCell>
                          <TableCell>Single Subject</TableCell>
                          <TableCell>+₹5,000 to base</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Any</TableCell>
                          <TableCell>Any</TableCell>
                          <TableCell>Multiple Subjects</TableCell>
                          <TableCell>+₹5,000 to base</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-semibold mb-4">Deductions & Bonuses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Deductions</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <X className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Absent Days</p>
                            <p className="text-sm text-muted-foreground">
                              Calculated as: (Absent Days / Working Days) × Base Salary
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <X className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Late Arrivals</p>
                            <p className="text-sm text-muted-foreground">3 late arrivals = 1 absent day</p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Bonuses</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Festival Bonus</p>
                            <p className="text-sm text-muted-foreground">10% of base salary in March and October</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Performance Bonus</p>
                            <p className="text-sm text-muted-foreground">
                              Up to 15% based on student results and feedback
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Salary Payment</DialogTitle>
            <DialogDescription>Enter payment details to process salary for {selectedTeacherName}</DialogDescription>
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
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
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
            <Button onClick={handleSalaryPayment} disabled={processingPayment}>
              {processingPayment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
