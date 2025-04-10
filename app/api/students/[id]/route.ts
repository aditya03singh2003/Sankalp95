import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import Student from "@/models/Student"
import Payment from "@/models/Payment"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const studentId = params?.id

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    await connectToDatabase()

    const student = await Student.findById(studentId)

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Get payment history
    const payments = await Payment.find({ studentId: student._id }).sort({ createdAt: -1 })

    // Add payment history to student object
    const studentWithPayments = {
      ...student.toObject(),
      paymentHistory: payments,
      paymentStatus: payments.length > 0 ? payments[0].status : "pending",
    }

    return NextResponse.json(studentWithPayments)
  } catch (error) {
    console.error("Error fetching student:", error)
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const studentId = params?.id

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    const data = await request.json()

    await connectToDatabase()

    const student = await Student.findByIdAndUpdate(studentId, { $set: data }, { new: true })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error("Error updating student:", error)
    return NextResponse.json({ error: error.message || "Failed to update student" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const studentId = params?.id

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Delete student
    const student = await Student.findByIdAndDelete(studentId)

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Delete associated payments
    await Payment.deleteMany({ studentId })

    return NextResponse.json({
      message: "Student deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting student:", error)
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 })
  }
}
