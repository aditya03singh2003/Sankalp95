import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import TeacherAttendance from "@/models/TeacherAttendance"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import mongoose from "mongoose"
import Teacher from "@/models/Teacher"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const data = await request.json()
    console.log("Received data:", data)

    const { attendance } = data

    if (!attendance || !Array.isArray(attendance)) {
      return NextResponse.json({ error: "Missing or invalid attendance data" }, { status: 400 })
    }

    console.log("Processing teacher attendance:", attendance)

    // Process each attendance record
    const results = []
    const errors = []

    for (const record of attendance) {
      const { teacherId, date, status } = record

      if (!teacherId || !date) {
        console.warn("Skipping record with missing teacherId or date:", record)
        errors.push(`Missing teacherId or date for record: ${JSON.stringify(record)}`)
        continue
      }

      try {
        // Validate teacherId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
          console.error(`Invalid teacherId format: ${teacherId}`)
          errors.push(`Invalid teacherId format: ${teacherId}`)
          continue
        }

        // Parse date to ensure it's a valid Date object
        const attendanceDate = new Date(date)
        if (isNaN(attendanceDate.getTime())) {
          console.error(`Invalid date format: ${date}`)
          errors.push(`Invalid date format: ${date}`)
          continue
        }

        // Check if teacher exists
        const teacher = await Teacher.findById(teacherId)
        if (!teacher) {
          console.error(`Teacher not found with ID: ${teacherId}`)
          errors.push(`Teacher not found with ID: ${teacherId}`)
          continue
        }

        // Set time to midnight for consistent date comparison
        const startOfDay = new Date(attendanceDate)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(attendanceDate)
        endOfDay.setHours(23, 59, 59, 999)

        try {
          // First check if a record already exists for this teacher and date
          const existingRecord = await TeacherAttendance.findOne({
            teacherId,
            date: {
              $gte: startOfDay,
              $lt: endOfDay,
            },
          })

          if (existingRecord) {
            // Update existing record
            existingRecord.status = status || "absent"
            existingRecord.markedBy = session.user.id || null
            await existingRecord.save()
            results.push(existingRecord)
          } else {
            // Create new record
            const newRecord = new TeacherAttendance({
              teacherId,
              date: startOfDay,
              status: status || "absent",
              markedBy: session.user.id || null,
            })
            await newRecord.save()
            results.push(newRecord)
          }

          console.log(`Successfully processed attendance for teacher ${teacherId}`)
        } catch (dbError) {
          console.error(`Database error for teacher ${teacherId}:`, dbError)
          errors.push(`Database error for teacher ${teacherId}: ${dbError.message}`)
        }
      } catch (error) {
        console.error(`Error processing attendance for teacher ${teacherId}:`, error)
        errors.push(`Error processing attendance for teacher ${teacherId}: ${error.message}`)
      }
    }

    if (results.length === 0 && errors.length > 0) {
      return NextResponse.json(
        {
          error: "Failed to save any attendance records",
          details: errors,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      message: "Teacher attendance saved successfully",
      data: results,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("Error saving teacher attendance:", error)
    return NextResponse.json(
      {
        error: "Failed to save teacher attendance",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date")
    const teacherId = searchParams.get("teacherId")

    if (!dateParam) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }

    await connectToDatabase()

    const date = new Date(dateParam)
    const query: any = {
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      },
    }

    if (teacherId) {
      query.teacherId = teacherId
    }

    const attendanceRecords = await TeacherAttendance.find(query)

    return NextResponse.json(attendanceRecords)
  } catch (error) {
    console.error("Error fetching teacher attendance:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch teacher attendance",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
