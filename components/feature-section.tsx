import { BookOpen, Video, Users, Calendar, CreditCard, BarChart, MessageSquare, FileText } from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: <BookOpen className="feature-icon" />,
      title: "Multiple Boards",
      description: "Comprehensive education for ICSE, CBSE, and UP Board students from classes 1st to 12th.",
    },
    {
      icon: <Users className="feature-icon" />,
      title: "Expert Teachers",
      description: "Learn from qualified and experienced educators dedicated to your success.",
    },
    {
      icon: <Video className="feature-icon" />,
      title: "Live & Recorded Classes",
      description: "Access live interactive sessions and watch recorded lectures at your convenience.",
    },
    {
      icon: <Calendar className="feature-icon" />,
      title: "Flexible Timing",
      description: "Classes available from 3:00 PM to 8:30 PM to accommodate different schedules.",
    },
    {
      icon: <BarChart className="feature-icon" />,
      title: "Progress Tracking",
      description: "Monitor attendance, performance, and growth with detailed analytics.",
    },
    {
      icon: <CreditCard className="feature-icon" />,
      title: "Affordable Fees",
      description: "Quality education at reasonable rates with transparent fee structure.",
    },
    {
      icon: <MessageSquare className="feature-icon" />,
      title: "Interactive Learning",
      description: "Engage in discussions, ask questions, and collaborate with peers.",
    },
    {
      icon: <FileText className="feature-icon" />,
      title: "Parent Updates",
      description: "Regular updates to parents about their child's progress and attendance.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-yellow-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-yellow-600 to-amber-700 bg-clip-text text-transparent">
              Why Choose Sankalp95?
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We offer a comprehensive learning experience with these powerful features
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-4 rounded-lg border p-6 bg-background shadow-sm hover:border-sankalp-500 transition-colors card-hover"
            >
              <div className="rounded-full bg-yellow-100 p-3">{feature.icon}</div>
              <h3 className="text-xl font-bold text-center">{feature.title}</h3>
              <p className="text-sm text-muted-foreground text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
