import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import TeacherAttendance from "@/models/TeacherAttendance"

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { teacherId, status, date, notes, markedBy } = await request.json()

    if (!teacherId || !status || !date) {
      return NextResponse.json({ error: "Teacher ID, status, and date are required" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if attendance already exists for this date and teacher
    const existingAttendance = await TeacherAttendance.findOne({
      teacherId,
      date: new Date(date),
    })

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status
      existingAttendance.notes = notes
      existingAttendance.markedBy = markedBy
      await existingAttendance.save()

      return NextResponse.json({
        message: "Attendance updated successfully",
        attendance: existingAttendance,
      })
    } else {
      // Create new attendance record
      const newAttendance = new TeacherAttendance({
        teacherId,
        date: new Date(date),
        status,
        notes,
        markedBy,
      })

      await newAttendance.save()

      return NextResponse.json({
        message: "Attendance marked successfully",
        attendance: newAttendance,
      })
    }
  } catch (error) {
    console.error("Error marking teacher attendance:", error)
    return NextResponse.json({ error: "Failed to mark attendance" }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    await connectToDatabase()

    const query = {}
    if (date) {
      // Create date range for the selected date (start of day to end of day)
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)

      query.date = { $gte: startDate, $lte: endDate }
    }

    const attendanceRecords = await TeacherAttendance.find(query).sort({ date: -1 }).lean()

    return NextResponse.json(attendanceRecords)
  } catch (error) {
    console.error("Error fetching teacher attendance:", error)
    return NextResponse.json({ error: "Failed to fetch attendance records" }, { status: 500 })
  }
}
