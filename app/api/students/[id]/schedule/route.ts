import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

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

    // Get the student's class
    const db = await connectToDatabase()
    const studentsCollection = db.collection("students")

    const student = await studentsCollection.findOne({
      $or: [{ _id: new ObjectId(studentId) }, { studentId: studentId }],
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Get the schedule for the student's class
    const scheduleCollection = db.collection("schedules")
    const schedules = await scheduleCollection
      .find({
        class: student.class,
      })
      .toArray()

    // Format the schedules for the frontend
    const formattedSchedules = schedules.map((schedule) => ({
      id: schedule._id.toString(),
      day: schedule.day,
      subject: schedule.subject,
      teacher: schedule.teacherName,
      time: `${schedule.startTime} - ${schedule.endTime}`,
      location: schedule.location || "Main Building",
    }))

    return NextResponse.json(formattedSchedules)
  } catch (error) {
    console.error("Error fetching student schedule:", error)
    return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 })
  }
}
