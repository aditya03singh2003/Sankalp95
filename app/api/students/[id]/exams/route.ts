import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const studentId = params.id

    // Verify the user has permission to access this data
    if (session.user.role !== "admin" && session.user.role !== "teacher" && session.user.id !== studentId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await connectToDatabase()

    // Get the student's class
    const db = await connectToDatabase()
    const studentsCollection = db.collection("students")

    const student = await studentsCollection.findOne({
      $or: [{ _id: new ObjectId(studentId) }, { studentId: studentId }],
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Get upcoming exams for the student's class
    const examsCollection = db.collection("exams")

    // Get exams that are upcoming (date is greater than or equal to today)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const exams = await examsCollection
      .find({
        class: student.class,
        date: { $gte: today },
      })
      .sort({ date: 1 })
      .toArray()

    // Format the exams for the frontend
    const formattedExams = exams.map((exam) => ({
      id: exam._id.toString(),
      subject: exam.subject,
      type: exam.examType || "Regular",
      date: exam.date.toISOString(),
      time: exam.time || "9:00 AM",
      location: exam.location || "Examination Hall",
      totalMarks: exam.totalMarks || 100,
    }))

    return NextResponse.json(formattedExams)
  } catch (error) {
    console.error("Error fetching student exams:", error)
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 })
  }
}
