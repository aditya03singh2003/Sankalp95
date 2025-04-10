import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Student from "@/models/Student"
import Payment from "@/models/Payment"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const className = searchParams.get("class")

    let query = {}

    if (className && className !== "all") {
      query = { class: className }
    }

    console.log("Fetching students with query:", query)

    const students = await Student.find(query).sort({ name: 1 })

    console.log(`Found ${students.length} students`)

    return NextResponse.json(students)
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    console.log("Creating new student with data:", data)

    await connectToDatabase()

    // Process subjects if they come as a comma-separated string
    if (typeof data.subjects === "string") {
      data.subjects = data.subjects
        .split(",")
        .map((subject) => subject.trim())
        .filter(Boolean)
    }

    // Ensure required fields are present
    if (!data.rollNumber) {
      return NextResponse.json({ error: "Roll number is required" }, { status: 400 })
    }

    if (!data.password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    // Generate a unique student ID if not provided
    if (!data.studentId) {
      // Get the count of students in this class to generate a roll number
      const classCode = data.class ? data.class.replace(/[^0-9]/g, "").padStart(2, "0") : "00"
      data.studentId = `STU${classCode}${data.rollNumber.toString().padStart(3, "0")}`
    }

    // Create the student
    const student = new Student(data)
    await student.save()

    // Create an initial payment record with "pending" status
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
    return NextResponse.json(student)
  } catch (error) {
    console.error("Error creating student:", error)
    return NextResponse.json({ error: error.message || "Failed to create student" }, { status: 500 })
  }
}
