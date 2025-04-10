"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, GraduationCap, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ParentDashboard() {
  const { data: session } = useSession()
  const [children, setChildren] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        // This would be replaced with an actual API call to get the parent's children
        // For now, we'll simulate with mock data
        setTimeout(() => {
          setChildren([
            {
              id: 1,
              name: "Arjun Kumar",
              class: "Class 10",
              rollNumber: "STU10045",
              attendance: 85,
              fees: {
                status: "Paid",
                lastPaid: "2023-07-15",
                nextDue: "2023-08-15",
              },
              performance: {
                overall: "Good",
                subjects: [
                  { name: "Mathematics", grade: "A", percentage: 87 },
                  { name: "Science", grade: "B+", percentage: 78 },
                  {
                    name: "English",
                    grade: "A-",
                    percentage: 82,
                  },
                  { name: "Social Studies", grade: "B", percentage: 75 },
                ],
              },
              upcomingTests: [
                { subject: "Mathematics", date: "2023-08-10", topic: "Trigonometry" },
                { subject: "Science", date: "2023-08-12", topic: "Chemical Reactions" },
              ],
            },
          ])
          setIsLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Error fetching children:", error)
        setIsLoading(false)
      }
    }

    fetchChildren()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Parent Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>Communicate with Teachers</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Children</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-20" /> : children.length}</div>
            <p className="text-xs text-muted-foreground">Enrolled in Sankalp95</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                `${children.reduce((acc, child) => acc + child.attendance, 0) / children.length}%`
              )}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Tests</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                children.reduce((acc, child) => acc + child.upcomingTests.length, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Fee Due</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-20" /> : children[0]?.fees.nextDue || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? <Skeleton className="h-4 w-28" /> : children[0]?.fees.status || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Children</CardTitle>
                <CardDescription>Overview of your children enrolled at Sankalp95</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {children.map((child) => (
                      <div key={child.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <h3 className="font-medium">{child.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {child.class} • Roll No: {child.rollNumber}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Upcoming Tests</CardTitle>
                <CardDescription>Tests scheduled in the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {children.map((child) =>
                      child.upcomingTests.map((test, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <h3 className="font-medium">{test.subject}</h3>
                            <p className="text-sm text-muted-foreground">
                              {test.date} • {test.topic}
                            </p>
                          </div>
                          <div className="text-sm text-muted-foreground">{child.name}</div>
                        </div>
                      )),
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-1">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Performance</CardTitle>
                <CardDescription>Subject-wise performance of your children</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {children.map((child) => (
                      <div key={child.id} className="space-y-2">
                        <h3 className="font-medium">{child.name}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {child.performance.subjects.map((subject, index) => (
                            <div key={index} className="flex items-center justify-between border-b pb-2">
                              <div>
                                <p className="text-sm font-medium">{subject.name}</p>
                                <p className="text-xs text-muted-foreground">Grade: {subject.grade}</p>
                              </div>
                              <div className="text-sm font-medium">{subject.percentage}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Details</CardTitle>
              <CardDescription>Monthly attendance records for your children</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {children.map((child) => (
                    <div key={child.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{child.name}</h3>
                        <div className="text-sm font-medium">{child.attendance}%</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${child.attendance}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>Detailed subject-wise performance</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {children.map((child) => (
                    <div key={child.id} className="space-y-2">
                      <h3 className="font-medium">{child.name}</h3>
                      <p className="text-sm text-muted-foreground">Overall: {child.performance.overall}</p>
                      <div className="space-y-2">
                        {child.performance.subjects.map((subject, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{subject.name}</p>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{subject.grade}</span>
                                <span className="text-sm text-muted-foreground">({subject.percentage}%)</span>
                              </div>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{ width: `${subject.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee Details</CardTitle>
              <CardDescription>Payment history and upcoming dues</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {children.map((child) => (
                    <div key={child.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{child.name}</h3>
                        <div
                          className={`rounded-full px-2 py-1 text-xs ${
                            child.fees.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {child.fees.status}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Last Paid</p>
                          <p className="font-medium">{child.fees.lastPaid}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Next Due</p>
                          <p className="font-medium">{child.fees.nextDue}</p>
                        </div>
                      </div>
                      <Button className="w-full" variant="outline">
                        View Payment History
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
