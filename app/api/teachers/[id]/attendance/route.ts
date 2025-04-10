import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import type { NextRequest } from "next/server"
import TeacherAttendance from "@/models/TeacherAttendance"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teacherId = params.id
    if (!teacherId) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Get all attendance records for this teacher
    const attendanceRecords = await TeacherAttendance.find({ teacherId }).sort({ date: -1 }).lean()

    console.log(`Found ${attendanceRecords.length} attendance records for teacher ${teacherId}`)

    // Calculate summary statistics
    let present = 0
    let absent = 0
    let leave = 0

    attendanceRecords.forEach((record) => {
      if (record.status === "present") present++
      else if (record.status === "absent") absent++
      else if (record.status === "leave") leave++
    })

    const total = present + absent + leave
    const percentage = total > 0 ? (present / total) * 100 : 0

    // Format the records for display
    const formattedRecords = attendanceRecords.map((record) => ({
      _id: record._id.toString(),
      date: record.date.toISOString(),
      status: record.status,
      notes: record.notes || "",
    }))

    return NextResponse.json({
      present,
      absent,
      leave,
      total,
      percentage,
      records: formattedRecords,
    })
  } catch (error) {
    console.error("Error fetching teacher attendance:", error)
    return NextResponse.json({ error: "Failed to fetch attendance records" }, { status: 500 })
  }
}
