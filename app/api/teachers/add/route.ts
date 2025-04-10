import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Teacher from "@/models/Teacher"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Generate teacherId from phone number if not provided
    if (!data.teacherId) {
      const phoneNumber = data.contactNumber || data.phone || ""
      const last5Digits = phoneNumber.replace(/\D/g, "").slice(-5)
      data.teacherId = `TEACH${last5Digits}`
    }

    // Use teacherId as employeeId if employeeId is not provided
    if (!data.employeeId) {
      data.employeeId = data.teacherId
    }

    console.log("Creating new teacher with data:", data)

    await connectToDatabase()

    // Check if email already exists
    const existingTeacher = await Teacher.findOne({ email: data.email })
    if (existingTeacher) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Check if the provided teacherId already exists
    const teacherWithId = await Teacher.findOne({ teacherId: data.teacherId })
    if (teacherWithId) {
      return NextResponse.json(
        {
          error: "Teacher ID already exists",
          message: `The Teacher ID ${data.teacherId} is already assigned to another teacher.`,
        },
        { status: 400 },
      )
    }

    // Format classes as array if it's not already
    if (!Array.isArray(data.classes)) {
      if (typeof data.classes === "string") {
        data.classes = data.classes
          .split(",")
          .map((cls) => cls.trim())
          .filter(Boolean)
      } else if (data.class) {
        data.classes = [data.class]
      } else {
        data.classes = []
      }
    }

    // Process subjects if they come as a comma-separated string
    if (typeof data.subjects === "string") {
      data.subjects = data.subjects
        .split(",")
        .map((subject) => subject.trim())
        .filter(Boolean)
    }

    // Generate a default password if not provided
    if (!data.password) {
      data.password = "password123" // Default password
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.password, salt)
    data.password = hashedPassword

    // Create the teacher
    const teacher = new Teacher({
      name: data.name,
      email: data.email,
      password: data.password,
      contactNumber: data.contactNumber || data.phone,
      phone: data.contactNumber || data.phone, // Add this line to ensure phone is saved
      address: data.address,
      qualification: data.qualification,
      specialization: data.specialization,
      experience: data.experience,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      joiningDate: data.joiningDate,
      teacherId: data.teacherId,
      employeeId: data.employeeId,
      salary: data.salary,
      classes: data.classes,
      subjects: data.subjects,
      isActive: true,
    })

    await teacher.save()
    console.log("Teacher created successfully:", teacher)

    // Remove password from response
    const teacherResponse = teacher.toObject()
    delete teacherResponse.password

    return NextResponse.json({
      success: true,
      message: "Teacher added successfully",
      teacher: teacherResponse,
    })
  } catch (error) {
    console.error("Error creating teacher:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to create teacher",
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
