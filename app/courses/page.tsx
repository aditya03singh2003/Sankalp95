import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const courses = [
  {
    id: 1,
    title: "JEE Mains Preparation",
    description: "Comprehensive course for JEE Mains preparation covering Physics, Chemistry, and Mathematics.",
    duration: "12 months",
    price: "₹45,000",
    features: ["Live Classes", "Study Material", "Mock Tests", "Doubt Clearing Sessions"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "NEET Preparation",
    description: "Complete preparation for NEET covering Physics, Chemistry, and Biology with specialized faculty.",
    duration: "12 months",
    price: "₹48,000",
    features: ["Live Classes", "Study Material", "Mock Tests", "Doubt Clearing Sessions"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Class 12 Board Exam",
    description: "Focused preparation for Class 12 Board exams with comprehensive coverage of all subjects.",
    duration: "9 months",
    price: "₹35,000",
    features: ["Live Classes", "Study Material", "Mock Tests", "Doubt Clearing Sessions"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Class 11 Foundation",
    description: "Strong foundation course for Class 11 students preparing for competitive exams.",
    duration: "9 months",
    price: "₹32,000",
    features: ["Live Classes", "Study Material", "Mock Tests", "Doubt Clearing Sessions"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Class 10 Board Exam",
    description: "Comprehensive preparation for Class 10 Board exams with focus on all subjects.",
    duration: "9 months",
    price: "₹28,000",
    features: ["Live Classes", "Study Material", "Mock Tests", "Doubt Clearing Sessions"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Class 9 Foundation",
    description: "Foundation course for Class 9 students to build strong concepts for future competitive exams.",
    duration: "9 months",
    price: "₹25,000",
    features: ["Live Classes", "Study Material", "Mock Tests", "Doubt Clearing Sessions"],
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Courses</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive range of courses designed to help students excel in their academic journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Duration:</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Fee:</span>
                    <span className="font-bold text-primary">{course.price}</span>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Features:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {course.features.map((feature, index) => (
                        <li key={index} className="text-gray-700">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Enroll Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
