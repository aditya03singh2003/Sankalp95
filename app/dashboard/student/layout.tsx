import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DashboardNav } from "@/components/dashboard-nav"

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "Student dashboard for the coaching platform",
}

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard/student/dashboard",
    icon: "dashboard",
  },
  {
    title: "Attendance",
    href: "/dashboard/student/attendance",
    icon: "calendar",
  },
  {
    title: "Payment",
    href: "/dashboard/student/payment",
    icon: "creditCard",
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: "user",
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (session.user.role !== "student") {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <DashboardNav items={navItems} />
        </aside>
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
