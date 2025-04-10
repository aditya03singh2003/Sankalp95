import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await connectToDatabase()
    const teacherCollection = db.collection("teachers")
    const scheduleCollection = db.collection("schedules")

    console.log("Fetching classes for teacher ID:", params.id)

    // Find the teacher
    const teacher = await teacherCollection.findOne({
      $or: [{ _id: new ObjectId(params.id) }, { teacherId: params.id }],
    })

    if (!teacher) {
      console.log("Teacher not found:", params.id)
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    console.log("Found teacher:", teacher.name)

    // Get schedules for the teacher
    const teacherSchedules = await scheduleCollection
      .find({
        teacherId: teacher._id.toString(),
      })
      .toArray()

    console.log("Found schedules:", teacherSchedules.length)

    return NextResponse.json(teacherSchedules)
  } catch (error) {
    console.error("Error fetching teacher classes:", error)
    return NextResponse.json({ error: "Failed to fetch classes data" }, { status: 500 })
  }
}
