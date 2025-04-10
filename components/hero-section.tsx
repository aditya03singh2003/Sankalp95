import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, GraduationCap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-yellow-50 to-yellow-200 animated-bg">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <Badge className="mb-2 bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30 transition-colors">
                Admissions Open for 2023-24
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-yellow-600 to-amber-700 bg-clip-text text-transparent">
                Sankalp95 Coaching
              </h1>
              <p className="text-xl font-semibold text-sankalp-900">By Pankaj Chauhan</p>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Empowering students with quality education for ICSE, CBSE, and UP Board examinations.
              </p>
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">Coaching Hours: 3:00 PM to 8:30 PM</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                <MapPin className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">554Kha/493 Visheshwar Nagar, Alambagh, Lucknow - 226005</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                <GraduationCap className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">Classes 1st to 12th (ICSE, CBSE, UP Board)</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6">
              <Link href="/register">
                <Button size="lg" className="bg-sankalp-600 hover:bg-sankalp-700 text-black btn-primary">
                  Get Started
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="lg" className="border-sankalp-600 text-sankalp-900 btn-outline-primary">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[450px] w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg opacity-20 shadow-xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="space-y-4 text-center bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-yellow-200 transform hover:scale-105 transition-transform duration-300">
                  <div className="inline-block rounded-lg bg-sankalp-500 px-3 py-1 text-sm font-medium text-black">
                    Live Classes Starting Soon
                  </div>
                  <h2 className="text-2xl font-bold">Mathematics - Class X</h2>
                  <p className="text-muted-foreground">Today at 4:00 PM</p>
                  <div className="flex justify-center gap-2">
                    <Badge variant="outline" className="bg-yellow-100">
                      Quadratic Equations
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-100">
                      30 Students
                    </Badge>
                  </div>
                  <Button className="mt-4 bg-sankalp-600 hover:bg-sankalp-700 text-black pulse">Join Now</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
