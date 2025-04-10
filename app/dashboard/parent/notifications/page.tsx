"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, CreditCard, FileText, Users, BarChart } from "lucide-react"

// Generate dummy notifications
const generateNotifications = () => {
  const types = ["attendance", "payment", "exam", "general", "performance"]
  const titles = {
    attendance: ["Attendance Alert", "Absence Notification", "Attendance Update"],
    payment: ["Payment Reminder", "Payment Confirmation", "Fee Due Notification"],
    exam: ["Upcoming Test", "Exam Schedule", "Test Results"],
    general: ["Parent-Teacher Meeting", "Holiday Announcement", "School Event"],
    performance: ["Performance Update", "Progress Report", "Achievement Notification"],
  }

  const children = ["Rahul Sharma", "Priya Sharma"]
  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "Science", "Social Studies"]

  const notifications = []

  // Generate 20 random notifications
  for (let i = 1; i <= 20; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const titleOptions = titles[type as keyof typeof titles]
    const title = titleOptions[Math.floor(Math.random() * titleOptions.length)]
    const child = children[Math.floor(Math.random() * children.length)]
    const subject = subjects[Math.floor(Math.random() * subjects.length)]

    let message = ""
    if (type === "attendance") {
      message =
        Math.random() > 0.3
          ? `${child} was present in today's ${subject} class`
          : `${child} was absent in today's ${subject} class`
    } else if (type === "payment") {
      message = `Monthly fee for ${["April", "May", "June"][Math.floor(Math.random() * 3)]} is due on 15th`
    } else if (type === "exam") {
      message = `${subject} ${["unit test", "final exam", "quiz"][Math.floor(Math.random() * 3)]} scheduled for next ${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][Math.floor(Math.random() * 5)]}`
    } else if (type === "general") {
      message = `${["PTM scheduled for this Saturday", "School will remain closed on", "Annual function on"][Math.floor(Math.random() * 3)]} ${Math.floor(Math.random() * 28) + 1} ${["Jan", "Feb", "Mar", "Apr", "May"][Math.floor(Math.random() * 5)]}`
    } else if (type === "performance") {
      message = `${child} ${["scored well in", "needs improvement in", "has shown progress in"][Math.floor(Math.random() * 3)]} ${subject}`
    }

    // Generate a random date within the last 30 days
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    const daysAgo = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    let dateText = ""

    if (daysAgo === 0) {
      dateText = "Today"
    } else if (daysAgo === 1) {
      dateText = "Yesterday"
    } else if (daysAgo < 7) {
      dateText = `${daysAgo} days ago`
    } else {
      dateText = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    }

    const hours = Math.floor(Math.random() * 12) + 1
    const minutes = Math.floor(Math.random() * 60)
    const ampm = Math.random() > 0.5 ? "AM" : "PM"
    const time = `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`

    notifications.push({
      id: i,
      type,
      title,
      message,
      date: dateText,
      time,
      read: daysAgo > 2 || Math.random() > 0.7,
      child,
    })
  }

  // Sort by date (Today, Yesterday, etc.)
  return notifications.sort((a, b) => {
    if (a.date === "Today" && b.date !== "Today") return -1
    if (a.date !== "Today" && b.date === "Today") return 1
    if (a.date === "Yesterday" && b.date !== "Yesterday" && b.date !== "Today") return -1
    if (a.date !== "Yesterday" && a.date !== "Today" && b.date === "Yesterday") return 1
    return 0
  })
}

const dummyNotifications = generateNotifications()

export default function ParentNotificationsPage() {
  const [notifications, setNotifications] = useState(dummyNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  // Count unread notifications
  const unreadCount = notifications.filter((notification) => !notification.read).length

  // Group notifications by date
  const groupedNotifications: Record<string, typeof notifications> = {}

  filteredNotifications.forEach((notification) => {
    if (!groupedNotifications[notification.date]) {
      groupedNotifications[notification.date] = []
    }
    groupedNotifications[notification.date].push(notification)
  })

  // Sort dates to ensure Today and Yesterday come first
  const sortedDates = Object.keys(groupedNotifications).sort((a, b) => {
    if (a === "Today") return -1
    if (b === "Today") return 1
    if (a === "Yesterday") return -1
    if (b === "Yesterday") return 1
    return 0
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">Stay updated with your children's activities and announcements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-sankalp-100 text-black">
          <TabsTrigger value="all" className="data-[state=active]:bg-sankalp-500">
            All
            {unreadCount > 0 && <Badge className="ml-2 bg-red-500">{unreadCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="unread" className="data-[state=active]:bg-sankalp-500">
            Unread
          </TabsTrigger>
          <TabsTrigger value="attendance" className="data-[state=active]:bg-sankalp-500">
            Attendance
          </TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-sankalp-500">
            Payments
          </TabsTrigger>
          <TabsTrigger value="exam" className="data-[state=active]:bg-sankalp-500">
            Exams
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-sankalp-500">
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "all"
                  ? "All Notifications"
                  : activeTab === "unread"
                    ? "Unread Notifications"
                    : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notifications`}
              </CardTitle>
              <CardDescription>
                {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No notifications</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeTab === "all"
                      ? "You don't have any notifications yet"
                      : activeTab === "unread"
                        ? "You've read all your notifications"
                        : `You don't have any ${activeTab} notifications`}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedDates.map((date) => (
                    <div key={date}>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">{date}</h3>
                      <div className="space-y-4">
                        {groupedNotifications[date].map((notification) => (
                          <div
                            key={notification.id}
                            className={`flex items-start space-x-4 p-4 rounded-lg border ${!notification.read ? "bg-muted/50" : ""}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                notification.type === "attendance"
                                  ? "bg-blue-100 text-blue-600"
                                  : notification.type === "payment"
                                    ? "bg-green-100 text-green-600"
                                    : notification.type === "exam"
                                      ? "bg-purple-100 text-purple-600"
                                      : notification.type === "performance"
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {notification.type === "attendance" ? (
                                <Users className="h-5 w-5" />
                              ) : notification.type === "payment" ? (
                                <CreditCard className="h-5 w-5" />
                              ) : notification.type === "exam" ? (
                                <FileText className="h-5 w-5" />
                              ) : notification.type === "performance" ? (
                                <BarChart className="h-5 w-5" />
                              ) : (
                                <Bell className="h-5 w-5" />
                              )}
                            </div>
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium leading-none">
                                  {notification.title}
                                  {!notification.read && (
                                    <span className="ml-2 h-2 w-2 rounded-full bg-red-500 inline-block"></span>
                                  )}
                                </p>
                                <span className="text-xs text-muted-foreground">{notification.time}</span>
                              </div>
                              <p className="text-sm">{notification.message}</p>
                              <p className="text-xs text-muted-foreground">Child: {notification.child}</p>
                            </div>
                            <div className="flex gap-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    markAsRead(notification.id)
                                  }}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                              >
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
                                  className="h-4 w-4"
                                >
                                  <path d="M3 6h18"></path>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                              </Button>
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
      </Tabs>
    </div>
  )
}
