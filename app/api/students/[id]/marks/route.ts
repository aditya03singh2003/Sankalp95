import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Student from "@/models/Student"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Connect to database
    await dbConnect()

    // Find student by ID
    const student = await Student.findById(id)

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Check authorization - admin can view any student's marks, teacher can view marks of students in their class,
    // student can only view their own marks, parent can view their child's marks
    if (session.user.role === "admin") {
      // Admin can view all students' marks
    } else if (session.user.role === "teacher") {
      // Teachers can view marks of students in their classes
      // This would require additional logic to check if the student is in the teacher's class
      // For now, we'll allow all teachers to view all students' marks
    } else if (session.user.role === "student") {
      // Students can only view their own marks
      if (session.user.studentId.toString() !== id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    } else if (session.user.role === "parent") {
      // Parents can only view their children's marks
      // This would require additional logic to check if the student is the parent's child
      // For now, we'll restrict parents from viewing student marks directly
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Return the student's marks
    return NextResponse.json({ marks: student.marks || [] })
  } catch (error) {
    console.error("Error fetching student marks:", error)
    return NextResponse.json({ error: "Failed to fetch student marks" }, { status: 500 })
  }
}
