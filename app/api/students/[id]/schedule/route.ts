import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"
import Schedule from "@/models/Schedule"
import Class from "@/models/Class"
import Student from "@/models/Student"

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
    const student = await Student.findOne({
      $or: [{ _id: new ObjectId(studentId) }, { studentId: studentId }],
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Find the class ID for the student's class
    const classInfo = await Class.findOne({ name: student.class })

    // Build the query to find schedules for this student
    const query = {}

    // First check for class-based schedules
    if (classInfo) {
      query.$or = [{ classGroup: classInfo._id }, { className: student.class }]
    } else if (student.class) {
      query.$or = [{ className: student.class }]
    }

    // Also check for individually assigned schedules
    if (!query.$or) {
      query.$or = []
    }

    query.$or.push({
      assignType: "individual",
      selectedStudents: { $in: [new ObjectId(studentId)] },
    })

    // Get the schedules
    const schedules = await Schedule.find(query).sort({ day: 1, startTime: 1 })

    // Format the schedules for the frontend
    const formattedSchedules = schedules.map((schedule) => ({
      id: schedule._id.toString(),
      day: schedule.day,
      subject: schedule.subject,
      teacher: schedule.teacher,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      time: `${schedule.startTime} - ${schedule.endTime}`,
      location: schedule.location || "Main Building",
      className: schedule.className || student.class,
      notes: schedule.notes || "",
    }))

    return NextResponse.json(formattedSchedules)
  } catch (error) {
    console.error("Error fetching student schedule:", error)
    return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 })
  }
}
