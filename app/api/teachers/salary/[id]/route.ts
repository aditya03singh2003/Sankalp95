import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only allow admins to access salary data
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const id = params.id
    if (!id) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const teacherCollection = db.collection("teachers")
    const salaryCollection = db.collection("teacherSalary")

    // Find the teacher
    const teacher = await teacherCollection.findOne({
      $or: [{ _id: new ObjectId(id) }, { teacherId: id }],
    })

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    // Get salary records
    const salaryRecords = await salaryCollection
      .find({
        teacherId: teacher._id.toString(),
      })
      .sort({ date: -1 })
      .toArray()

    return NextResponse.json(salaryRecords)
  } catch (error) {
    console.error("Error fetching teacher salary data:", error)
    return NextResponse.json({ error: "Failed to fetch salary data" }, { status: 500 })
  }
}
