import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import StudentAttendance from "@/models/StudentAttendance"
import Student from "@/models/Student"

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    console.log("Saving attendance data:", data)

    // Validate required fields
    if (!data.date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }
    if (!data.class) {
      return NextResponse.json({ error: "Class is required" }, { status: 400 })
    }
    if (!data.subject) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 })
    }
    if (!data.attendance || !Array.isArray(data.attendance) || data.attendance.length === 0) {
      return NextResponse.json({ error: "Attendance data is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Process each student's attendance
    const attendancePromises = data.attendance.map(async (record) => {
      if (!record.studentId) {
        console.error("Missing studentId in attendance record:", record)
        throw new Error("Student ID is required for attendance records")
      }

      try {
        // Find the student to update their attendance array
        const student = await Student.findById(record.studentId)

        if (!student) {
          console.error(`Student not found with ID: ${record.studentId}`)
          return null
        }

        // Create a new attendance record in the dedicated collection
        const attendanceRecord = new StudentAttendance({
          date: new Date(data.date),
          class: data.class,
          subject: data.subject,
          studentId: record.studentId,
          studentName: student.name,
          status: record.status,
          markedBy: data.markedBy || session.user.id,
        })

        await attendanceRecord.save()

        // Also update the student's attendance array
        // Check if an entry for this date and subject already exists
        const existingEntryIndex = student.attendance.findIndex(
          (entry) =>
            entry.date.toISOString().split("T")[0] === new Date(data.date).toISOString().split("T")[0] &&
            entry.subject === data.subject,
        )

        if (existingEntryIndex >= 0) {
          // Update existing entry
          student.attendance[existingEntryIndex].status = record.status
          student.attendance[existingEntryIndex].markedBy = data.markedBy || session.user.id
        } else {
          // Add new entry
          student.attendance.push({
            date: new Date(data.date),
            subject: data.subject,
            status: record.status,
            markedBy: data.markedBy || session.user.id,
          })
        }

        await student.save()
        return attendanceRecord
      } catch (error) {
        console.error(`Error processing attendance for student ${record.studentId}:`, error)
        throw error
      }
    })

    // Wait for all attendance records to be processed
    const results = await Promise.all(attendancePromises)
    const validResults = results.filter(Boolean)

    return NextResponse.json({
      success: true,
      message: `Attendance saved for ${validResults.length} students`,
      records: validResults,
    })
  } catch (error) {
    console.error("Error saving attendance:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to save attendance",
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const classParam = searchParams.get("class")
    const subjectParam = searchParams.get("subject")
    const dateParam = searchParams.get("date")
    const studentIdParam = searchParams.get("studentId")

    await connectToDatabase()

    const query = {}

    if (classParam) {
      query.class = classParam
    }

    if (subjectParam) {
      query.subject = subjectParam
    }

    if (dateParam) {
      // Convert date string to Date object
      const dateParts = dateParam.split(" ")
      const months = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
      }

      const day = Number.parseInt(dateParts[0])
      const month = months[dateParts[1]]
      const year = Number.parseInt(dateParts[2])

      const startDate = new Date(year, month, day)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(year, month, day)
      endDate.setHours(23, 59, 59, 999)

      query.date = { $gte: startDate, $lte: endDate }
    }

    if (studentIdParam) {
      query.studentId = studentIdParam
    }

    const attendanceRecords = await StudentAttendance.find(query).sort({ date: -1 })

    return NextResponse.json({
      success: true,
      records: attendanceRecords,
    })
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch attendance",
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
