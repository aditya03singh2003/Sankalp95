import Link from "next/link"
import { HeroSection } from "@/components/hero-section"
import { FeatureSection } from "@/components/feature-section"
import { TestimonialSection } from "@/components/testimonial-section"
import { PricingSection } from "@/components/pricing-section"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, BookOpen, Users, Video } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />

        {/* Dashboard Preview Section */}
        <section className="py-12 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Comprehensive Dashboard</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Track your progress, attend classes, and manage your academic journey with our intuitive dashboard
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Video className="mr-2 h-4 w-4" />
                    Live Classes
                  </CardTitle>
                  <CardDescription>Attend interactive live classes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Physics - Laws of Motion</span>
                      <Badge>Today, 4 PM</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mathematics - Calculus</span>
                      <Badge>Tomorrow, 10 AM</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Chemistry - Periodic Table</span>
                      <Badge>Tomorrow, 2 PM</Badge>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href="/login">
                      <Button className="w-full">Join Classes</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Recorded Lectures
                  </CardTitle>
                  <CardDescription>Access recorded lectures anytime</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Physics - Electromagnetism</span>
                      <Badge variant="outline">45 min</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Chemistry - Chemical Bonding</span>
                      <Badge variant="outline">60 min</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Biology - Cell Structure</span>
                      <Badge variant="outline">50 min</Badge>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href="/login">
                      <Button className="w-full">Watch Lectures</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <BarChart className="mr-2 h-4 w-4" />
                    Performance
                  </CardTitle>
                  <CardDescription>Track your academic progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mathematics</span>
                      <Badge className="bg-green-500">92%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Physics</span>
                      <Badge className="bg-green-500">88%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Chemistry</span>
                      <Badge>75%</Badge>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href="/login">
                      <Button className="w-full">View Reports</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  <Users className="h-4 w-4" />
                  Login to Access Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <FeatureSection />
        <TestimonialSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}
