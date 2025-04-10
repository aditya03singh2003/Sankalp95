import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

export function PricingSection() {
  const plans = [
    {
      name: "Classes 1-5",
      price: "₹1,000",
      duration: "per month",
      description: "Perfect for primary school students",
      features: [
        "All subjects covered",
        "Regular tests and assessments",
        "Basic study materials",
        "Monthly progress reports",
        "Parent-teacher meetings",
      ],
    },
    {
      name: "Classes 6-8",
      price: "₹1,500",
      duration: "per month",
      description: "Ideal for middle school students",
      features: [
        "All subjects covered",
        "Regular tests and assessments",
        "Comprehensive study materials",
        "Monthly progress reports",
        "Parent-teacher meetings",
        "Special doubt clearing sessions",
      ],
      highlighted: true,
    },
    {
      name: "Classes 9-10",
      price: "₹2,000",
      duration: "per month",
      description: "For high school students",
      features: [
        "All subjects covered",
        "Regular tests and assessments",
        "Comprehensive study materials",
        "Weekly progress reports",
        "Parent-teacher meetings",
        "Special doubt clearing sessions",
        "Board exam preparation",
      ],
    },
    {
      name: "Classes 11-12",
      price: "₹3,000",
      duration: "per month",
      description: "For senior secondary students",
      features: [
        "PCM and PCB streams",
        "Regular tests and assessments",
        "Advanced study materials",
        "Weekly progress reports",
        "Parent-teacher meetings",
        "Special doubt clearing sessions",
        "Board exam preparation",
        "Competitive exam guidance",
      ],
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-sankalp-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Fee Structure</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Affordable education for all classes and boards
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col justify-between rounded-lg border p-6 bg-background shadow-sm ${
                plan.highlighted ? "border-sankalp-500 ring-1 ring-sankalp-500" : ""
              }`}
            >
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="ml-1 text-muted-foreground">{plan.duration}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-sankalp-600" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/register">
                <Button
                  className={`mt-6 w-full ${plan.highlighted ? "bg-sankalp-600 hover:bg-sankalp-700 text-black" : ""}`}
                >
                  Enroll Now
                </Button>
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/fee-details">
            <Button variant="outline" className="border-sankalp-500 text-sankalp-900">
              View Detailed Fee Structure
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
