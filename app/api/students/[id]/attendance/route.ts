import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Student from "@/models/Student"
import StudentAttendance from "@/models/StudentAttendance"
import { parse, isValid, format } from "date-fns"
import mongoose from "mongoose"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    console.log(`Fetching attendance for student ID: ${id}, month: ${request.nextUrl.searchParams.get("month")}`)
    await connectToDatabase()

    // Try to find the student by ID
    let student

    // Check if the ID is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      student = await Student.findById(id)
    }

    // If not found, try to find by studentId field
    if (!student) {
      student = await Student.findOne({ studentId: id })
    }

    // If still not found, try to find by user ID
    if (!student) {
      const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({}))
      const user = await User.findById(id)
      if (user) {
        student = await Student.findOne({ email: user.email })
      }
    }

    if (!student) {
      console.log(`Student not found with ID: ${id}`)
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Parse month parameter if provided
    let monthFilter = {}
    const monthParam = request.nextUrl.searchParams.get("month")

    if (monthParam) {
      try {
        // Try to parse the month parameter (format: YYYY-MM)
        const parsedDate = parse(monthParam, "yyyy-MM", new Date())

        if (isValid(parsedDate)) {
          const year = parsedDate.getFullYear()
          const month = parsedDate.getMonth() + 1 // JavaScript months are 0-indexed

          // Create date range for the month
          const startDate = new Date(year, month - 1, 1)
          const endDate = new Date(year, month, 0) // Last day of the month

          monthFilter = {
            date: {
              $gte: startDate,
              $lte: endDate,
            },
          }
        }
      } catch (error) {
        console.error("Error parsing month parameter:", error)
        // If parsing fails, don't apply month filter
      }
    }

    // Fetch attendance records
    const attendanceRecords = await StudentAttendance.find({
      studentId: student._id,
      ...monthFilter,
    }).sort({ date: -1 })

    return NextResponse.json(attendanceRecords)
  } catch (error) {
    console.error("Error fetching student attendance:", error)
    return NextResponse.json({ error: "Failed to fetch attendance records" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "admin" && session.user.role !== "teacher")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    const data = await request.json()
    if (!data.date || !data.status || !data.subject) {
      return NextResponse.json({ error: "Date, status, and subject are required" }, { status: 400 })
    }

    await connectToDatabase()

    // Find student
    let student
    if (mongoose.Types.ObjectId.isValid(id)) {
      student = await Student.findById(id)
    }

    if (!student) {
      student = await Student.findOne({ studentId: id })
    }

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Parse date
    let attendanceDate
    try {
      attendanceDate = new Date(data.date)
      if (!isValid(attendanceDate)) {
        throw new Error("Invalid date")
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 })
    }

    // Check if the date is in the future
    if (attendanceDate > new Date()) {
      return NextResponse.json({ error: "Cannot mark attendance for future dates" }, { status: 400 })
    }

    // Format date to remove time component for comparison
    const formattedDate = format(attendanceDate, "yyyy-MM-dd")

    // Check if attendance record already exists
    const existingRecord = await StudentAttendance.findOne({
      studentId: student._id,
      subject: data.subject,
      date: {
        $gte: new Date(`${formattedDate}T00:00:00.000Z`),
        $lt: new Date(`${formattedDate}T23:59:59.999Z`),
      },
    })

    let attendanceRecord

    if (existingRecord) {
      // Update existing record
      existingRecord.status = data.status
      existingRecord.notes = data.notes || existingRecord.notes || ""
      existingRecord.markedBy = session.user.id
      attendanceRecord = await existingRecord.save()
    } else {
      // Create new record
      attendanceRecord = await StudentAttendance.create({
        studentId: student._id,
        date: attendanceDate,
        class: student.class,
        subject: data.subject,
        status: data.status,
        notes: data.notes || "",
        markedBy: session.user.id,
      })
    }

    return NextResponse.json(attendanceRecord)
  } catch (error) {
    console.error("Error updating student attendance:", error)
    return NextResponse.json({ error: "Failed to update attendance record" }, { status: 500 })
  }
}
