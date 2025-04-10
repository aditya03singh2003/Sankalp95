import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Student from "@/models/Student"
import StudentAttendance from "@/models/StudentAttendance"

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

    if (!classParam) {
      return NextResponse.json({ error: "Class parameter is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Find all students in the specified class
    const students = await Student.find({ class: classParam }).sort({ rollNumber: 1 })

    if (!students || students.length === 0) {
      return NextResponse.json({
        students: [],
        message: "No students found in this class",
      })
    }

    // If date and subject are provided, fetch attendance records for that date and subject
    let attendanceRecords = []
    if (dateParam && subjectParam) {
      // Parse the date string (format: "yyyy-MM-dd")
      let startDate, endDate

      try {
        // Try to parse the date in yyyy-MM-dd format
        const parsedDate = new Date(dateParam)

        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date format")
        }

        startDate = new Date(parsedDate)
        startDate.setHours(0, 0, 0, 0)

        endDate = new Date(parsedDate)
        endDate.setHours(23, 59, 59, 999)

        console.log("Parsed date range:", { startDate, endDate })
      } catch (error) {
        console.error("Error parsing date:", error)
        return NextResponse.json({ error: "Invalid date format. Expected yyyy-MM-dd" }, { status: 400 })
      }

      // Fetch attendance records for the specified date and subject
      attendanceRecords = await StudentAttendance.find({
        class: classParam,
        subject: subjectParam,
        date: { $gte: startDate, $lte: endDate },
      })
    }

    // Map students with their attendance status
    const studentsWithAttendance = students.map((student) => {
      // Find attendance record for this student
      const attendanceRecord = attendanceRecords.find(
        (record) => record.studentId.toString() === student._id.toString(),
      )

      // Get parent email for notifications
      const parentEmail = student.parentEmail || ""

      return {
        id: student._id.toString(),
        name: student.name,
        rollNumber: student.rollNumber,
        attendance: attendanceRecord ? attendanceRecord.status : "absent", // Default to absent
        parentEmail: parentEmail,
      }
    })

    return NextResponse.json({
      students: studentsWithAttendance,
    })
  } catch (error) {
    console.error("Error fetching students for attendance:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch students",
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    console.log("Received attendance data:", data)

    if (!data.attendance || !Array.isArray(data.attendance) || data.attendance.length === 0) {
      return NextResponse.json({ error: "Attendance data is required" }, { status: 400 })
    }

    if (!data.class) {
      return NextResponse.json({ error: "Class is required" }, { status: 400 })
    }

    if (!data.subject) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 })
    }

    if (!data.date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Parse the date
    let attendanceDate
    try {
      attendanceDate = new Date(data.date)
      if (isNaN(attendanceDate.getTime())) {
        throw new Error("Invalid date")
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 })
    }

    // Process each student's attendance
    const attendancePromises = data.attendance.map(async (record) => {
      if (!record.studentId) {
        console.error("Missing studentId in attendance record:", record)
        return null
      }

      try {
        // Find existing attendance record
        const existingRecord = await StudentAttendance.findOne({
          studentId: record.studentId,
          class: data.class,
          subject: data.subject,
          date: {
            $gte: new Date(attendanceDate.setHours(0, 0, 0, 0)),
            $lte: new Date(attendanceDate.setHours(23, 59, 59, 999)),
          },
        })

        if (existingRecord) {
          // Update existing record
          existingRecord.status = record.status
          existingRecord.markedBy = session.user.id
          await existingRecord.save()
          return existingRecord
        } else {
          // Create new record
          const newRecord = new StudentAttendance({
            studentId: record.studentId,
            date: attendanceDate,
            class: data.class,
            subject: data.subject,
            status: record.status,
            markedBy: session.user.id,
          })
          await newRecord.save()
          return newRecord
        }
      } catch (error) {
        console.error(`Error processing attendance for student ${record.studentId}:`, error)
        return null
      }
    })

    // Wait for all attendance records to be processed
    const results = await Promise.all(attendancePromises)
    const validResults = results.filter(Boolean)

    return NextResponse.json({
      success: true,
      message: `Attendance saved for ${validResults.length} students`,
      records: validResults.length,
    })
  } catch (error) {
    console.error("Error saving student attendance:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to save attendance",
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
