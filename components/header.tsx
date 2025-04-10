"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useSession } from "next-auth/react"
import { UserNav } from "@/components/user-nav"

export function Header() {
  const { data: session } = useSession()
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Sankalp95 Logo" width={40} height={40} className="rounded-full" />
          <span className="font-bold text-xl">Sankalp95</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/courses" className="font-medium transition-colors hover:text-primary">
              Courses
            </Link>
            <Link href="/about" className="font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {session?.user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <UserNav />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
