import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-sankalp-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-sankalp-900">About Sankalp95 Coaching</h1>
              <p className="text-lg md:text-xl text-sankalp-700 mb-8">
                Empowering students to achieve academic excellence and realize their full potential since 2010.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-sankalp-800">Our Mission</h2>
                <p className="text-lg mb-6 text-gray-700">
                  At Sankalp95 Coaching, our mission is to provide high-quality education and guidance to students,
                  helping them achieve their academic goals and realize their full potential.
                </p>
                <p className="text-lg text-gray-700">
                  We believe that every student has unique abilities and learning styles. Our personalized approach
                  ensures that each student receives the attention and support they need to excel.
                </p>
              </div>
              <div className="bg-sankalp-100 p-8 rounded-lg shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-sankalp-500 rounded-full flex items-center justify-center mr-4">
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
                      className="text-white"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-sankalp-800">Our Vision</h3>
                </div>
                <p className="text-gray-700">
                  To be the leading educational institution that transforms students into confident, knowledgeable
                  individuals ready to face the challenges of competitive exams and future careers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section className="py-16 bg-sankalp-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-sankalp-800">Our Approach</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md transition-transform duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-sankalp-500 rounded-full flex items-center justify-center mb-6 mx-auto">
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
                    className="text-white"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center text-sankalp-800">Personalized Learning</h3>
                <p className="text-gray-700 text-center">
                  We tailor our teaching methods to match each student's learning style and pace, ensuring optimal
                  understanding and retention.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md transition-transform duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-sankalp-500 rounded-full flex items-center justify-center mb-6 mx-auto">
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
                    className="text-white"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center text-sankalp-800">Expert Faculty</h3>
                <p className="text-gray-700 text-center">
                  Our teachers are experienced professionals with deep subject knowledge and proven teaching expertise
                  in their respective fields.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md transition-transform duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-sankalp-500 rounded-full flex items-center justify-center mb-6 mx-auto">
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
                    className="text-white"
                  >
                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center text-sankalp-800">Comprehensive Support</h3>
                <p className="text-gray-700 text-center">
                  Beyond academics, we provide mentoring, counseling, and guidance for the overall development of our
                  students.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center text-sankalp-800">Our History</h2>
              <div className="bg-sankalp-50 p-8 rounded-lg shadow-md">
                <p className="text-lg mb-6 text-gray-700">
                  Founded in 2010, Sankalp95 Coaching has grown from a small tutoring center to a comprehensive
                  educational institution serving hundreds of students each year.
                </p>
                <p className="text-lg mb-6 text-gray-700">
                  Over the years, we have maintained our commitment to educational excellence while continuously
                  evolving our methods and curriculum to meet the changing needs of students and the education
                  landscape.
                </p>
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-sankalp-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">10+</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sankalp-800">Years of Excellence</h4>
                      <p className="text-gray-600">Dedicated to student success</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
