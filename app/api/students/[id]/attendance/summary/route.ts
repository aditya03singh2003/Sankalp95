import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

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

    // Get the student's attendance records
    const db = await connectToDatabase()
    const attendanceCollection = db.collection("studentAttendance")

    const attendanceRecords = await attendanceCollection
      .find({
        studentId: studentId,
      })
      .sort({ date: -1 })
      .toArray()

    // Calculate attendance statistics
    const totalRecords = attendanceRecords.length
    const presentRecords = attendanceRecords.filter((record) => record.status === "present").length
    const absentRecords = totalRecords - presentRecords

    // Calculate attendance percentage
    const attendancePercentage = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0

    // Get the 5 most recent attendance records
    const recentRecords = attendanceRecords.slice(0, 5).map((record) => ({
      date: record.date.toISOString(),
      status: record.status,
      notes: record.notes || "",
    }))

    return NextResponse.json({
      present: presentRecords,
      absent: absentRecords,
      total: totalRecords,
      percentage: attendancePercentage,
      recentRecords: recentRecords,
    })
  } catch (error) {
    console.error("Error fetching student attendance summary:", error)
    return NextResponse.json({ error: "Failed to fetch attendance summary" }, { status: 500 })
  }
}
