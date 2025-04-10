import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { endOfMonth } from "date-fns"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fix: Properly handle params as an async object
    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    // Get month parameter from query string
    const url = new URL(request.url)
    const monthParam = url.searchParams.get("month")

    console.log(`Fetching attendance for student ID: ${id}, month: ${monthParam}`)

    const db = await connectToDatabase()
    const studentCollection = db.collection("students")
    const attendanceCollection = db.collection("studentAttendances")

    // Find the student
    let student
    try {
      // Try to find by ObjectId first
      student = await studentCollection.findOne({ _id: new ObjectId(id) })
    } catch (error) {
      // If that fails, try to find by studentId string
      student = await studentCollection.findOne({ studentId: id })
    }

    // If still not found, try to find by user ID
    if (!student) {
      try {
        const userCollection = db.collection("users")
        const user = await userCollection.findOne({ _id: new ObjectId(id) })
        if (user && user.studentId) {
          student = await studentCollection.findOne({
            $or: [{ _id: new ObjectId(user.studentId) }, { studentId: user.studentId }],
          })
        }
      } catch (error) {
        console.error("Error finding student by user ID:", error)
      }
    }

    if (!student) {
      console.error(`Student not found with ID: ${id}`)
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    console.log(`Found student: ${student.name}, ID: ${student._id}`)

    // Prepare date filter if month parameter is provided
    let dateFilter = {}
    if (monthParam) {
      try {
        // Parse the month parameter (format: "yyyy-MM")
        const [year, month] = monthParam.split("-").map(Number)
        const startDate = new Date(year, month - 1, 1) // Month is 0-indexed in JS Date
        const endDate = endOfMonth(startDate)

        dateFilter = {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        }

        console.log("Date filter:", { startDate, endDate })
      } catch (error) {
        console.error("Error parsing month parameter:", error)
      }
    }

    // Get attendance records from the dedicated collection
    const query = {
      studentId: student._id.toString(),
      ...dateFilter,
    }

    console.log("Attendance query:", query)

    const attendanceRecords = await attendanceCollection.find(query).sort({ date: -1 }).toArray()

    console.log(`Found ${attendanceRecords.length} attendance records in collection`)

    // If no records in the dedicated collection, try to get from the student document
    let records = attendanceRecords
    if (!records || records.length === 0) {
      // Fallback to attendance field in student document if it exists
      if (student.attendance && Array.isArray(student.attendance)) {
        records = student.attendance
          .filter((record) => {
            if (!monthParam) return true

            try {
              const recordDate = new Date(record.date)
              const [year, month] = monthParam.split("-").map(Number)
              const startDate = new Date(year, month - 1, 1)
              const endDate = endOfMonth(startDate)

              return recordDate >= startDate && recordDate <= endDate
            } catch (error) {
              return false
            }
          })
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        console.log(`Found ${records.length} attendance records in student document`)
      } else {
        records = []
      }
    }

    // Calculate statistics
    const totalCount = records.length
    const presentCount = records.filter((record) => record.status === "present").length
    const absentCount = records.filter((record) => record.status === "absent").length
    const leaveCount = records.filter((record) => record.status === "leave").length

    // Calculate percentages
    const presentPercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0
    const absentPercentage = totalCount > 0 ? Math.round((absentCount / totalCount) * 100) : 0
    const leavePercentage = totalCount > 0 ? Math.round((leaveCount / totalCount) * 100) : 0

    return NextResponse.json({
      records,
      totalCount,
      presentCount,
      absentCount,
      leaveCount,
      presentPercentage,
      absentPercentage,
      leavePercentage,
      recentRecords: records.slice(0, 10), // Add recent records for dashboard
    })
  } catch (error) {
    console.error("Error fetching student attendance:", error)
    return NextResponse.json({ error: "Failed to fetch attendance data" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !["admin", "teacher"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fix: Properly handle params as an async object
    const { id } = params
    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    const data = await request.json()
    if (!data.date || !data.subject || !data.status) {
      return NextResponse.json({ error: "Date, subject, and status are required" }, { status: 400 })
    }

    console.log(`Marking attendance for student ID: ${id}`, data)

    const db = await connectToDatabase()
    const studentCollection = db.collection("students")
    const attendanceCollection = db.collection("studentAttendances")

    // Find the student
    let student
    try {
      // Try to find by ObjectId first
      student = await studentCollection.findOne({ _id: new ObjectId(id) })
    } catch (error) {
      // If that fails, try to find by studentId string
      student = await studentCollection.findOne({ studentId: id })
    }

    if (!student) {
      console.error(`Student not found with ID: ${id}`)
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    console.log(`Found student: ${student.name}, ID: ${student._id}`)

    // Create attendance record
    const attendanceRecord = {
      studentId: student._id.toString(),
      date: new Date(data.date),
      subject: data.subject,
      status: data.status,
      markedBy: session.user.name || session.user.email,
      markedAt: new Date(),
      notes: data.notes || "",
      class: student.class || "",
    }

    // Insert into dedicated attendance collection
    await attendanceCollection.insertOne(attendanceRecord)

    // Also update student document for backward compatibility
    await studentCollection.updateOne(
      { _id: student._id },
      {
        $push: {
          attendance: {
            date: new Date(data.date),
            subject: data.subject,
            status: data.status,
            markedBy: session.user.name || session.user.email,
            markedAt: new Date(),
            notes: data.notes || "",
          },
        },
      },
    )

    console.log(`Attendance marked successfully for ${student.name}`)

    // Send success notification
    return NextResponse.json({
      success: true,
      message: "Attendance marked successfully",
      record: attendanceRecord,
    })
  } catch (error) {
    console.error("Error marking attendance:", error)
    return NextResponse.json({ error: "Failed to mark attendance" }, { status: 500 })
  }
}
