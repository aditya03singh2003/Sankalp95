import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Teacher from "@/models/Teacher"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Get all teachers
    const teachers = await Teacher.find()

    // Update count
    let updatedCount = 0

    // Update each teacher's employeeId to match teacherId format
    for (const teacher of teachers) {
      if (!teacher.employeeId || teacher.employeeId !== teacher.teacherId) {
        // If teacherId exists, use it
        if (teacher.teacherId) {
          teacher.employeeId = teacher.teacherId
        }
        // Otherwise generate from phone number
        else if (teacher.contactNumber) {
          const last5Digits = teacher.contactNumber.replace(/\D/g, "").slice(-5)
          const newId = `TEACH${last5Digits}`
          teacher.teacherId = newId
          teacher.employeeId = newId
        }

        await teacher.save()
        updatedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} teacher records with correct employee IDs`,
    })
  } catch (error) {
    console.error("Error updating teacher employee IDs:", error)
    return NextResponse.json({ error: "Failed to update teacher employee IDs" }, { status: 500 })
  }
}
