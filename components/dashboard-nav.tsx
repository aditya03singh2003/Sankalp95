"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  Settings,
  User,
  Users,
} from "lucide-react"

interface NavProps {
  isCollapsed?: boolean
  links: {
    title: string
    label?: string
    icon: string
    variant: "default" | "ghost"
    href: string
  }[]
}

export function Nav({ links, isCollapsed = false }: NavProps) {
  const pathname = usePathname()

  const getIcon = (icon: string): LucideIcon | null => {
    switch (icon) {
      case "dashboard":
        return LayoutDashboard
      case "home":
        return Home
      case "calendar":
        return Calendar
      case "user":
        return User
      case "creditCard":
        return CreditCard
      case "settings":
        return Settings
      case "users":
        return Users
      case "fileText":
        return FileText
      case "bookOpen":
        return BookOpen
      case "graduationCap":
        return GraduationCap
      default:
        return null
    }
  }

  return (
    <div data-collapsed={isCollapsed} className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          const Icon = getIcon(link.icon)
          return isCollapsed ? (
            <TooltipProvider key={index}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      buttonVariants({ variant: link.variant, size: "icon" }),
                      "h-9 w-9",
                      link.variant === "default" &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                      pathname === link.href &&
                        "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground",
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-4">
                  {link.title}
                  {link.label && <span className="ml-auto text-muted-foreground">{link.label}</span>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              key={index}
              href={link.href}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" && "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start",
                pathname === link.href &&
                  "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground",
              )}
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {link.title}
              {link.label && (
                <span className={cn("ml-auto", link.variant === "default" && "text-background dark:text-white")}>
                  {link.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

interface DashboardNavProps {
  items: {
    title: string
    href: string
    icon: string
    label?: string
  }[]
}

export function DashboardNav({ items }: DashboardNavProps) {
  const path = usePathname()

  if (!items?.length) {
    return null
  }

  return (
    <div className="grid gap-2 p-2">
      {items.map((item, index) => {
        const Icon = getIcon(item.icon)
        return (
          <Link
            key={index}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              path === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
              "justify-start",
            )}
          >
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            <span>{item.title}</span>
          </Link>
        )
      })}
    </div>
  )
}

function getIcon(icon: string): LucideIcon | null {
  switch (icon) {
    case "dashboard":
      return LayoutDashboard
    case "home":
      return Home
    case "calendar":
      return Calendar
    case "user":
      return User
    case "creditCard":
      return CreditCard
    case "settings":
      return Settings
    case "users":
      return Users
    case "fileText":
      return FileText
    case "bookOpen":
      return BookOpen
    case "graduationCap":
      return GraduationCap
    default:
      return null
  }
}
