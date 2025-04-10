import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only allow admins to update salary status
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()
    const { teacherId, status, date, amount, method, updatedBy } = data

    if (!teacherId || !status) {
      return NextResponse.json({ error: "Teacher ID and status are required" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const teacherCollection = db.collection("teachers")
    const salaryCollection = db.collection("teacherSalary")

    // Find the teacher
    const teacher = await teacherCollection.findOne({
      $or: [{ _id: new ObjectId(teacherId) }, { teacherId: teacherId }],
    })

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    // Create a new salary record
    const salaryRecord = {
      teacherId: teacher._id.toString(),
      status,
      date: date || new Date().toISOString(),
      amount: amount || teacher.salary || 0,
      method: method || "Bank Transfer",
      updatedBy: updatedBy || session.user.name || "Admin",
      createdAt: new Date().toISOString(),
    }

    // Insert the new record
    await salaryCollection.insertOne(salaryRecord)

    return NextResponse.json({
      success: true,
      message: "Salary status updated successfully",
    })
  } catch (error) {
    console.error("Error updating teacher salary status:", error)
    return NextResponse.json({ error: "Failed to update salary status" }, { status: 500 })
  }
}
