import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Student from "@/models/Student"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin or teacher
    if (session.user.role !== "admin" && session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const grade = searchParams.get("grade")

    if (!grade) {
      return NextResponse.json({ error: "Grade parameter is required" }, { status: 400 })
    }

    // Connect to database
    await dbConnect()

    // Find all active students in the specified grade/class
    const students = await Student.find({
      class: grade, // Using class field instead of grade
      isActive: { $ne: false },
    })
      .select("_id firstName lastName rollNumber")
      .sort({ rollNumber: 1 })

    // Format the student data
    const formattedStudents = students.map((student) => ({
      _id: student._id,
      name: `${student.firstName} ${student.lastName}`,
      rollNumber: student.rollNumber,
      studentId: student._id,
    }))

    return NextResponse.json({ students: formattedStudents })
  } catch (error) {
    console.error("Error fetching students by class:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}
