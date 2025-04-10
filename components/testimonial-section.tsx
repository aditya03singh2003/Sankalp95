export function TestimonialSection() {
  const testimonials = [
    {
      quote:
        "Sankalp95 Coaching has transformed my learning experience. The teachers are excellent and the study material is comprehensive.",
      author: "Rahul Sharma",
      role: "Student, Class X",
    },
    {
      quote:
        "As a parent, I appreciate the regular updates about my child's progress and the affordable fee structure.",
      author: "Priya Patel",
      role: "Parent",
    },
    {
      quote:
        "The coaching center provides quality education for all boards. My child's performance has improved significantly.",
      author: "Amit Kumar",
      role: "Parent",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Students Say</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from our students and parents about their experience with Sankalp95 Coaching
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col justify-between space-y-4 rounded-lg border p-6 bg-sankalp-50 shadow-sm"
            >
              <div>
                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
              </div>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
