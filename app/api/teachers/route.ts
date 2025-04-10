import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Teacher from "@/models/Teacher"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const teachers = await Teacher.find().sort({ name: 1 })

    return NextResponse.json(teachers)
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    console.log("Creating new teacher with data:", data)

    await connectToDatabase()

    // Format classes as objects with name property
    if (Array.isArray(data.classes)) {
      data.classes = data.classes.map((className) => ({ name: className }))
    } else if (typeof data.classes === "string") {
      data.classes = data.classes
        .split(",")
        .map((cls) => ({ name: cls.trim() }))
        .filter(Boolean)
    }

    // Generate a default password if not provided
    if (!data.password) {
      data.password = "password123" // Default password
    }

    // Process subjects if they come as a comma-separated string
    if (typeof data.subjects === "string") {
      data.subjects = data.subjects
        .split(",")
        .map((subject) => subject.trim())
        .filter(Boolean)
    }

    // Generate a unique teacher ID if not provided
    if (!data.teacherId) {
      // Get the phone number and use last 5 digits
      const phoneNumber = data.phone || ""
      const last5Digits = phoneNumber.replace(/\D/g, "").slice(-5)
      data.teacherId = `TEACH${last5Digits}`
    }

    // Map phone to contactNumber
    data.contactNumber = data.phone

    // Create the teacher
    const teacher = new Teacher(data)
    await teacher.save()

    console.log("Teacher created successfully:", teacher)
    return NextResponse.json(teacher)
  } catch (error) {
    console.error("Error creating teacher:", error)
    return NextResponse.json({ error: error.message || "Failed to create teacher" }, { status: 500 })
  }
}
