import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Student from "@/models/Student"
import User from "@/models/User"
import Payment from "@/models/Payment"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    console.log("Creating new student with data:", data)

    await connectToDatabase()

    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email })
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Check if roll number already exists in the same class
    const existingStudent = await Student.findOne({
      class: data.class,
      rollNumber: data.rollNumber,
    })

    if (existingStudent) {
      return NextResponse.json(
        {
          error: "Roll number already exists",
          message: `Roll number ${data.rollNumber} is already assigned to another student in class ${data.class}.`,
        },
        { status: 400 },
      )
    }

    // Process subjects if they come as a comma-separated string
    if (typeof data.subjects === "string") {
      data.subjects = data.subjects
        .split(",")
        .map((subject) => subject.trim())
        .filter(Boolean)
    }

    // If subjects is empty, set default subjects based on class
    if (!data.subjects || data.subjects.length === 0) {
      data.subjects = ["Mathematics", "English", "Science", "Social Studies"]
    }

    // Generate a unique student ID
    const classCode = data.class ? data.class.replace(/[^0-9]/g, "").padStart(2, "0") : "00"
    const studentId = `STU${classCode}${data.rollNumber.toString().padStart(3, "0")}`

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.password, salt)

    // Create user account
    const user = new User({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "student",
    })

    await user.save()

    // Create student record - Map parentPhone to parentContact
    const student = new Student({
      name: data.name,
      email: data.email,
      password: hashedPassword, // Add password explicitly
      class: data.class,
      rollNumber: data.rollNumber,
      studentId: studentId,
      subjects: data.subjects,
      parentName: data.parentName,
      parentContact: data.parentPhone, // Map parentPhone to parentContact
      address: data.address,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      userId: user._id,
      paymentStatus: "pending",
    })

    await student.save()

    // Create an initial payment record
    const payment = new Payment({
      studentId: student._id,
      amount: 0,
      status: "pending",
      month: new Date().toLocaleString("default", { month: "long" }),
      year: new Date().getFullYear(),
      paymentDate: null,
      paymentMethod: null,
    })

    await payment.save()

    console.log("Student created successfully:", student)
    return NextResponse.json({
      success: true,
      message: "Student added successfully",
      student: student,
    })
  } catch (error) {
    console.error("Error creating student:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to create student",
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
