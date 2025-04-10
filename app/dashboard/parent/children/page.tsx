"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"

// Mock data - will be replaced with actual API calls
const mockChildren = [
  {
    id: 1,
    name: "Rahul Sharma",
    grade: "10",
    section: "A",
    rollNumber: "S2001",
    attendance: {
      present: 85,
      absent: 5,
      late: 2,
      total: 92,
    },
    fees: {
      paid: 35000,
      pending: 10000,
      dueDate: "2023-05-15",
      status: "Partially Paid",
    },
    academics: {
      currentAverage: 78,
      lastTestScore: 82,
      subjects: [
        { name: "Mathematics", score: 85, grade: "A" },
        { name: "Science", score: 78, grade: "B" },
        { name: "English", score: 82, grade: "B+" },
        { name: "Social Studies", score: 75, grade: "B" },
        { name: "Hindi", score: 80, grade: "B+" },
      ],
    },
  },
  {
    id: 2,
    name: "Priya Sharma",
    grade: "8",
    section: "B",
    rollNumber: "S2015",
    attendance: {
      present: 90,
      absent: 2,
      late: 1,
      total: 93,
    },
    fees: {
      paid: 30000,
      pending: 0,
      dueDate: "2023-05-15",
      status: "Paid",
    },
    academics: {
      currentAverage: 85,
      lastTestScore: 88,
      subjects: [
        { name: "Mathematics", score: 90, grade: "A+" },
        { name: "Science", score: 85, grade: "A" },
        { name: "English", score: 88, grade: "A" },
        { name: "Social Studies", score: 82, grade: "B+" },
        { name: "Hindi", score: 80, grade: "B+" },
      ],
    },
  },
]

export default function ParentChildrenPage() {
  const { data: session } = useSession()
  const [children, setChildren] = useState(mockChildren)
  const [loading, setLoading] = useState(true)
  const [selectedChild, setSelectedChild] = useState(null)

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
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching children data:", error)
        setLoading(false)
      }
    }

    fetchChildren()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading children data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Children</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Children</CardTitle>
              <CardDescription>Select a child to view details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {children.map((child) => (
                  <Button
                    key={child.id}
                    variant={selectedChild?.id === child.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedChild(child)}
                  >
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={`/placeholder.svg?text=${child.name.charAt(0)}`} />
                        <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-medium">{child.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Class {child.grade}-{child.section}
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          {selectedChild ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedChild.name}</CardTitle>
                    <CardDescription>
                      Class {selectedChild.grade}-{selectedChild.section} | Roll No: {selectedChild.rollNumber}
                    </CardDescription>
                  </div>
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`/placeholder.svg?text=${selectedChild.name.charAt(0)}`} />
                    <AvatarFallback>{selectedChild.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="academics">Academics</TabsTrigger>
                    <TabsTrigger value="fees">Fees</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span>Present:</span>
                              <Badge variant="outline" className="bg-green-50">
                                {selectedChild.attendance.present} days
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Absent:</span>
                              <Badge variant="outline" className="bg-red-50">
                                {selectedChild.attendance.absent} days
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Late:</span>
                              <Badge variant="outline" className="bg-yellow-50">
                                {selectedChild.attendance.late} days
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center font-medium pt-2 border-t">
                              <span>Attendance Rate:</span>
                              <span className="text-green-600">
                                {Math.round((selectedChild.attendance.present / selectedChild.attendance.total) * 100)}%
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Academic Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span>Current Average:</span>
                              <Badge
                                variant="outline"
                                className={`${
                                  selectedChild.academics.currentAverage >= 80
                                    ? "bg-green-50"
                                    : selectedChild.academics.currentAverage >= 60
                                      ? "bg-yellow-50"
                                      : "bg-red-50"
                                }`}
                              >
                                {selectedChild.academics.currentAverage}%
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Last Test Score:</span>
                              <Badge
                                variant="outline"
                                className={`${
                                  selectedChild.academics.lastTestScore >= 80
                                    ? "bg-green-50"
                                    : selectedChild.academics.lastTestScore >= 60
                                      ? "bg-yellow-50"
                                      : "bg-red-50"
                                }`}
                              >
                                {selectedChild.academics.lastTestScore}%
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center font-medium pt-2 border-t">
                              <span>Status:</span>
                              <span
                                className={`${
                                  selectedChild.academics.currentAverage >= 80
                                    ? "text-green-600"
                                    : selectedChild.academics.currentAverage >= 60
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }`}
                              >
                                {selectedChild.academics.currentAverage >= 80
                                  ? "Excellent"
                                  : selectedChild.academics.currentAverage >= 60
                                    ? "Good"
                                    : "Needs Improvement"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Fee Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Total Fees:</span>
                            <span>₹{(selectedChild.fees.paid + selectedChild.fees.pending).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Paid Amount:</span>
                            <span className="text-green-600">₹{selectedChild.fees.paid.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Pending Amount:</span>
                            <span className={selectedChild.fees.pending > 0 ? "text-red-600" : "text-green-600"}>
                              ₹{selectedChild.fees.pending.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Next Due Date:</span>
                            <span>{new Date(selectedChild.fees.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between items-center font-medium pt-2 border-t">
                            <span>Status:</span>
                            <Badge
                              variant={
                                selectedChild.fees.status === "Paid"
                                  ? "success"
                                  : selectedChild.fees.status === "Partially Paid"
                                    ? "warning"
                                    : "destructive"
                              }
                            >
                              {selectedChild.fees.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="academics" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Subject-wise Performance</CardTitle>
                        <CardDescription>Latest academic performance across all subjects</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {selectedChild.academics.subjects.map((subject, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between">
                                <span className="font-medium">{subject.name}</span>
                                <div className="flex items-center space-x-2">
                                  <span>{subject.score}%</span>
                                  <Badge
                                    variant={
                                      subject.grade.startsWith("A")
                                        ? "success"
                                        : subject.grade.startsWith("B")
                                          ? "warning"
                                          : "destructive"
                                    }
                                  >
                                    {subject.grade}
                                  </Badge>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    subject.score >= 80
                                      ? "bg-green-600"
                                      : subject.score >= 60
                                        ? "bg-yellow-500"
                                        : "bg-red-600"
                                  }`}
                                  style={{ width: `${subject.score}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="fees" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Fee Details</CardTitle>
                        <CardDescription>Complete fee payment history and upcoming dues</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h3 className="font-medium">Fee Summary</h3>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span>Total Annual Fee:</span>
                                  <span>
                                    ₹{(selectedChild.fees.paid + selectedChild.fees.pending).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Paid Amount:</span>
                                  <span className="text-green-600">₹{selectedChild.fees.paid.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Pending Amount:</span>
                                  <span className={selectedChild.fees.pending > 0 ? "text-red-600" : "text-green-600"}>
                                    ₹{selectedChild.fees.pending.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h3 className="font-medium">Next Payment</h3>
                              <div className="p-3 border rounded-md">
                                {selectedChild.fees.pending > 0 ? (
                                  <>
                                    <div className="flex justify-between mb-2">
                                      <span>Amount Due:</span>
                                      <span className="font-medium">
                                        ₹{selectedChild.fees.pending.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between mb-4">
                                      <span>Due Date:</span>
                                      <span className="font-medium">
                                        {new Date(selectedChild.fees.dueDate).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <Button className="w-full">Pay Now</Button>
                                  </>
                                ) : (
                                  <p className="text-green-600 text-center py-2">All fees paid. No pending payments.</p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="font-medium">Payment History</h3>
                            <div className="border rounded-md overflow-hidden">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Mode
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Status
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">15 Apr 2023</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">₹20,000</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">Online Transfer</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      <Badge variant="success">Paid</Badge>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">10 Jan 2023</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">₹15,000</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">Cheque</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      <Badge variant="success">Paid</Badge>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex items-center justify-center h-[60vh]">
              <CardContent className="text-center">
                <p className="text-muted-foreground">Select a child to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
