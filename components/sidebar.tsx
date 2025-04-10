"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Book, Calendar, LayoutDashboard, Plus, Settings, Users } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      href: "/courses",
      label: "Courses",
      icon: Book,
      active: pathname?.startsWith("/courses"),
    },
    {
      href: "/teachers",
      label: "Teachers",
      icon: Users,
      active: pathname?.startsWith("/teachers"),
    },
    {
      href: "/schedule",
      label: "Schedule",
      icon: Calendar,
      active: pathname === "/schedule",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ]

  return (
    <div className={cn("flex h-full w-64 flex-col border-r", className)}>
      <div className="flex h-[60px] items-center border-b px-4">
        <Button variant="ghost" className="ml-auto h-8 w-8 p-0">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 space-y-2 p-4">
        <div className="space-y-1">
          {routes.map((route) => (
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                route.label === "Dashboard" && "text-yellow-500 hover:text-yellow-600",
              )}
              key={route.href}
              onClick={() => router.push(route.href)}
              active={route.active}
            >
              <route.icon className={cn("mr-2 h-4 w-4", route.label === "Dashboard" && "text-yellow-500")} />
              {route.label}
            </Button>
          ))}
        </div>
        <Separator />
      </ScrollArea>
      <div className="flex h-[60px] items-center border-t p-4">
        {session?.user ? (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt={session.user.name} />
              <AvatarFallback>
                {session.user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{session.user.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{session.user.role}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
