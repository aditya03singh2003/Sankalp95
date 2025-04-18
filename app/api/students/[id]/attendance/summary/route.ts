import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import mongoose from "mongoose"
import Student from "@/models/Student"
import { startOfMonth, endOfMonth, format, differenceInBusinessDays, isBefore, isWeekend } from "date-fns"

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const studentId = params.id
    const url = new URL(request.url)
    const monthParam = url.searchParams.get("month") || format(new Date(), "yyyy-MM")
    const [year, month] = monthParam.split("-").map(Number)

    // Verify the user has permission to access this data
    if (session.user.role !== "admin" && session.user.role !== "teacher" && session.user.id !== studentId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await connectToDatabase()

    // Find the student to get registration date
    let student
    if (mongoose.Types.ObjectId.isValid(studentId)) {
      student = await Student.findById(studentId)
    }

    if (!student) {
      student = await Student.findOne({ studentId: studentId })
    }

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Ensure we have a valid registration date
    const registrationDate = student.createdAt || new Date(2023, 0, 1) // Default to Jan 1, 2023 if no date

    // Calculate the start and end dates for the requested month
    const startDate = startOfMonth(new Date(year, month - 1))
    const endDate = endOfMonth(new Date(year, month - 1))
    const today = new Date()

    // Ensure we don't count future dates
    const effectiveEndDate = isBefore(endDate, today) ? endDate : today

    // Get the student's attendance records for the month
    const attendanceCollection = mongoose.connection.collection("studentAttendances")
    const attendanceRecords = await attendanceCollection
      .find({
        studentId: new mongoose.Types.ObjectId(student._id),
        date: {
          $gte: startDate,
          $lte: effectiveEndDate,
        },
      })
      .sort({ date: 1 })
      .toArray()

    // Group records by date to handle multiple subjects per day
    const recordsByDate = attendanceRecords.reduce((acc, record) => {
      const dateStr = format(new Date(record.date), "yyyy-MM-dd")
      if (!acc[dateStr]) {
        acc[dateStr] = []
      }
      acc[dateStr].push(record)
      return acc
    }, {})

    // Calculate attendance statistics
    let presentDays = 0
    let absentDays = 0
    let leaveDays = 0

    // Count unique days with their status
    Object.values(recordsByDate).forEach((dayRecords: any[]) => {
      // If any record for the day is "present", count the day as present
      if (dayRecords.some((record) => record.status === "present")) {
        presentDays++
      }
      // If no present but any leave, count as leave
      else if (dayRecords.some((record) => record.status === "leave")) {
        leaveDays++
      }
      // Otherwise count as absent
      else {
        absentDays++
      }
    })

    // Calculate total school days from registration to current date (excluding weekends)
    // Only count days within the selected month
    const startCountDate = new Date(Math.max(registrationDate.getTime(), startDate.getTime()))
    let totalSchoolDays = 0

    if (isBefore(startCountDate, effectiveEndDate)) {
      totalSchoolDays = differenceInBusinessDays(effectiveEndDate, startCountDate) + 1

      // Adjust for the first day if it's a weekend
      if (isWeekend(startCountDate)) {
        totalSchoolDays--
      }
    }

    // Calculate attendance percentage based on days student should have attended
    // Consider both present and leave days as "attended" for percentage calculation
    const attendedDays = presentDays + leaveDays
    const attendancePercentage = totalSchoolDays > 0 ? Math.round((attendedDays / totalSchoolDays) * 100) : 100

    // Get the attendance records with details for display
    const detailedRecords = attendanceRecords.map((record) => ({
      _id: record._id.toString(),
      date: record.date.toISOString(),
      subject: record.subject,
      status: record.status,
      notes: record.notes || "",
    }))

    // Return comprehensive data
    return NextResponse.json({
      present: presentDays,
      absent: absentDays,
      leave: leaveDays,
      total: totalSchoolDays,
      percentage: attendancePercentage,
      records: detailedRecords,
      registrationDate: registrationDate.toISOString(),
      attendedDays: attendedDays,
      // Include date ranges for debugging
      dateRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        effectiveEndDate: effectiveEndDate.toISOString(),
        startCountDate: startCountDate.toISOString(),
      },
    })
  } catch (error) {
    console.error("Error fetching student attendance summary:", error)
    return NextResponse.json({ error: "Failed to fetch attendance summary", details: error.message }, { status: 500 })
  }
}
