import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import mongoose from "mongoose"
import Teacher from "@/models/Teacher"

// Define a schema for teacher salaries if it doesn't exist
let TeacherSalary
try {
  TeacherSalary = mongoose.model("TeacherSalary")
} catch {
  const TeacherSalarySchema = new mongoose.Schema({
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank", "upi", null],
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  })

  TeacherSalary = mongoose.model("TeacherSalary", TeacherSalarySchema)
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "admin" && session.user.role !== "teacher")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")
    const month = searchParams.get("month")
    const year = searchParams.get("year")
    const status = searchParams.get("status")

    const query: any = {}

    if (teacherId) {
      query.teacherId = teacherId
    }

    if (month) {
      query.month = Number.parseInt(month)
    }

    if (year) {
      query.year = Number.parseInt(year)
    }

    if (status) {
      query.status = status
    }

    // If teacher is requesting, only show their own salaries
    if (session.user.role === "teacher") {
      const teacher = await Teacher.findOne({ email: session.user.email })
      if (!teacher) {
        return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
      }
      query.teacherId = teacher._id
    }

    const salaries = await TeacherSalary.find(query).sort({ year: -1, month: -1 })

    return NextResponse.json(salaries)
  } catch (error) {
    console.error("Error fetching teacher salaries:", error)
    return NextResponse.json({ error: "Failed to fetch teacher salaries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    console.log("Creating new teacher salary record:", data)

    await connectToDatabase()

    // Validate required fields
    if (!data.teacherId || !data.month || !data.year) {
      return NextResponse.json({ error: "Teacher ID, month, and year are required" }, { status: 400 })
    }

    // Check if a salary record already exists for this teacher, month, and year
    const existingSalary = await TeacherSalary.findOne({
      teacherId: data.teacherId,
      month: data.month,
      year: data.year,
    })

    if (existingSalary) {
      return NextResponse.json(
        { error: "A salary record already exists for this teacher in the specified month and year" },
        { status: 400 },
      )
    }

    // Create the salary record
    const salary = new TeacherSalary(data)
    await salary.save()

    console.log("Teacher salary record created successfully:", salary)
    return NextResponse.json(salary)
  } catch (error) {
    console.error("Error creating teacher salary record:", error)
    return NextResponse.json({ error: error.message || "Failed to create teacher salary record" }, { status: 500 })
  }
}
