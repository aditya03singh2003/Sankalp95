"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart,
  BookOpen,
  Calendar,
  CreditCard,
  Home,
  LogOut,
  Settings,
  User,
  Users,
  Video,
  Mail,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [userRole, setUserRole] = useState<string>("student")
  const [userData, setUserData] = useState({
    name: "",
    role: "",
    email: "",
  })

  // Determine user role based on URL path and session
  useEffect(() => {
    if (pathname.includes("/admin")) {
      setUserRole("admin")
    } else if (pathname.includes("/parent")) {
      setUserRole("parent")
    } else if (pathname.includes("/teacher")) {
      setUserRole("teacher")
    } else {
      setUserRole("student")
    }

    // Set user data from session
    if (session?.user) {
      setUserData({
        name: session.user.name || "",
        role: session.user.role || userRole,
        email: session.user.email || "",
      })
    }
  }, [pathname, session, userRole])

  // Define navigation based on user role from URL path
  const getNavigation = () => {
    // Default navigation for students
    let navigation = [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Live Classes", href: "/dashboard/live-classes", icon: Video },
      { name: "Recorded Lectures", href: "/dashboard/recorded-lectures", icon: BookOpen },
      { name: "Schedule", href: "/dashboard/schedule", icon: Calendar },
      { name: "Attendance", href: "/dashboard/attendance", icon: Users },
      { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
      { name: "Reports", href: "/dashboard/reports", icon: BarChart },
      { name: "Profile", href: "/dashboard/profile", icon: User },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ]

    // Admin navigation
    if (userRole === "admin") {
      navigation = [
        { name: "Dashboard", href: "/dashboard/admin", icon: Home },
        { name: "Students", href: "/dashboard/admin/students", icon: Users },
        { name: "Teachers", href: "/dashboard/admin/teachers", icon: Users },
        { name: "Attendance", href: "/dashboard/admin/attendance", icon: Calendar },
        { name: "Lectures", href: "/dashboard/admin/lectures", icon: Video },
        { name: "YouTube", href: "/dashboard/admin/youtube", icon: Video },
        { name: "Payments", href: "/dashboard/admin/payments", icon: CreditCard },
        { name: "Email", href: "/dashboard/admin/email", icon: Mail },
        { name: "Reports", href: "/dashboard/admin/reports", icon: BarChart },
        { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
      ]
    }
    // Teacher navigation
    else if (userRole === "teacher") {
      navigation = [
        { name: "Dashboard", href: "/dashboard/teacher", icon: Home },
        { name: "Students", href: "/dashboard/teacher/students", icon: Users },
        { name: "Attendance", href: "/dashboard/teacher/attendance", icon: Calendar },
        { name: "Marks", href: "/dashboard/teacher/marks", icon: BarChart },
        { name: "Schedule", href: "/dashboard/teacher/schedule", icon: Calendar },
        { name: "Profile", href: "/dashboard/teacher/profile", icon: User },
        { name: "Settings", href: "/dashboard/teacher/settings", icon: Settings },
      ]
    }
    // Parent navigation
    else if (userRole === "parent") {
      navigation = [
        { name: "Dashboard", href: "/dashboard/parent", icon: Home },
        { name: "Children", href: "/dashboard/parent/children", icon: Users },
        { name: "Attendance", href: "/dashboard/parent/attendance", icon: Calendar },
        { name: "Performance", href: "/dashboard/parent/performance", icon: BarChart },
        { name: "Payments", href: "/dashboard/parent/payments", icon: CreditCard },
        { name: "Notifications", href: "/dashboard/parent/notifications", icon: Bell },
        { name: "Settings", href: "/dashboard/parent/settings", icon: Settings },
      ]
    }

    return navigation
  }

  const navigation = getNavigation()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 z-50 flex flex-col bg-background border-r transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {isSidebarOpen ? (
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Sankalp95 Logo" width={32} height={32} className="rounded-full" />
              <span className="text-lg font-bold">Sankalp95</span>
            </Link>
          ) : (
            <Link href="/" className="mx-auto">
              <Image src="/logo.png" alt="Sankalp95 Logo" width={24} height={24} className="rounded-full" />
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="ml-auto">
            {isSidebarOpen ? (
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
                <path d="m15 18-6-6 6-6" />
              </svg>
            ) : (
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
                <path d="m9 18 6-6-6-6" />
              </svg>
            )}
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                } ${!isSidebarOpen ? "justify-center" : ""}`}
              >
                <item.icon className="h-4 w-4" />
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t p-4">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback>
                        {userData.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "US"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/")}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userData.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{userData.role}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>
                  {userData.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "US"}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
      {/* Main content */}
      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {navigation.find((item) => pathname.startsWith(item.href))?.name || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Help
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>
                      {userData.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "US"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/")}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
