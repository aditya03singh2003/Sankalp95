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

    const { searchParams } = new URL(request.url)
    const classParam = searchParams.get("class")
    const subject = searchParams.get("subject")
    const exam = searchParams.get("exam")

    if (!classParam || !subject || !exam) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Connect to database
    await dbConnect()

    // Find all students in the specified class
    const students = await Student.find({ grade: classParam, isActive: true })

    // Extract marks for the specified exam and subject
    const marks = []

    for (const student of students) {
      const examRecord = student.marks.find((mark) => mark.examName === exam && mark.subject === subject)

      if (examRecord) {
        marks.push({
          studentId: student._id,
          marksObtained: examRecord.marksObtained,
          totalMarks: examRecord.totalMarks,
          grade: examRecord.grade,
          remarks: examRecord.remarks,
        })
      }
    }

    return NextResponse.json({ marks })
  } catch (error) {
    console.error("Error fetching marks:", error)
    return NextResponse.json({ error: "Failed to fetch marks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin or teacher
    if (!session || (session.user.role !== "admin" && session.user.role !== "teacher")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { class: className, subject, examName, date, marks } = data

    if (!className || !subject || !examName || !marks) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Connect to database
    await dbConnect()

    // Update marks for each student
    for (const mark of marks) {
      if (mark.marksObtained === null) continue // Skip students with no marks

      const student = await Student.findById(mark.studentId)

      if (!student) continue

      // Check if marks already exist for this exam and subject
      const existingMarkIndex = student.marks.findIndex((m) => m.examName === examName && m.subject === subject)

      if (existingMarkIndex >= 0) {
        // Update existing mark
        student.marks[existingMarkIndex] = {
          examName,
          subject,
          marksObtained: mark.marksObtained,
          totalMarks: mark.totalMarks,
          grade: mark.grade,
          remarks: mark.remarks,
          date: date,
        }
      } else {
        // Add new mark
        student.marks.push({
          examName,
          subject,
          marksObtained: mark.marksObtained,
          totalMarks: mark.totalMarks,
          grade: mark.grade,
          remarks: mark.remarks,
          date: date,
        })
      }

      await student.save()
    }

    return NextResponse.json({
      success: true,
      message: "Marks saved successfully",
    })
  } catch (error) {
    console.error("Error saving marks:", error)
    return NextResponse.json({ error: "Failed to save marks" }, { status: 500 })
  }
}
