import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

// Get payment status for a student
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const db = await connectToDatabase()
    const studentCollection = db.collection("students")

    // Find the student by ID
    const student = await studentCollection.findOne({
      $or: [{ _id: new ObjectId(params.id) }, { studentId: params.id }],
    })

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({
      paymentStatus: student.paymentStatus || "pending",
      paymentHistory: student.paymentHistory || [],
    })
  } catch (error) {
    console.error("Error fetching payment status:", error)
    return NextResponse.json({ message: "Failed to fetch payment status" }, { status: 500 })
  }
}

// Update payment status (for admin)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized. Only admins can update payment status." }, { status: 401 })
    }

    const { paymentStatus, amount, notes } = await request.json()

    if (!paymentStatus || !["pending", "paid", "requested"].includes(paymentStatus)) {
      return NextResponse.json({ message: "Invalid payment status" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const studentCollection = db.collection("students")

    // Find the student
    const student = await studentCollection.findOne({
      $or: [{ _id: new ObjectId(params.id) }, { studentId: params.id }],
    })

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 })
    }

    // Create update object
    const updateData: any = {
      $set: { paymentStatus },
    }

    // Add to payment history if amount is provided
    if (amount) {
      const paymentRecord = {
        amount,
        status: paymentStatus,
        date: new Date(),
        notes: notes || `Payment ${paymentStatus === "paid" ? "approved" : "marked as " + paymentStatus} by admin`,
      }

      // Check if paymentHistory exists
      if (!student.paymentHistory) {
        updateData.$set.paymentHistory = [paymentRecord]
      } else {
        updateData.$push = { paymentHistory: paymentRecord }
      }
    }

    // Update the student document
    await studentCollection.updateOne({ _id: student._id }, updateData)

    return NextResponse.json({
      message: `Payment status updated to ${paymentStatus}`,
      paymentStatus,
    })
  } catch (error) {
    console.error("Error updating payment status:", error)
    return NextResponse.json({ message: "Failed to update payment status" }, { status: 500 })
  }
}

// Request payment approval (for student)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify the student is requesting for themselves
    if (session.user.role === "student" && session.user.id !== params.id) {
      return NextResponse.json(
        { message: "You can only request payment approval for your own account" },
        { status: 403 },
      )
    }

    const { amount, notes } = await request.json()

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ message: "Valid payment amount is required" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const studentCollection = db.collection("students")

    // Find the student
    const student = await studentCollection.findOne({
      $or: [{ _id: new ObjectId(params.id) }, { studentId: params.id }],
    })

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 })
    }

    // Create payment record
    const paymentRecord = {
      amount,
      status: "pending",
      date: new Date(),
      notes: notes || "Payment approval requested by student",
    }

    // Update the student document
    await studentCollection.updateOne(
      { _id: student._id },
      {
        $set: { paymentStatus: "requested" },
        $push: { paymentHistory: paymentRecord },
      },
    )

    return NextResponse.json({
      message: "Payment approval requested successfully",
      paymentStatus: "requested",
    })
  } catch (error) {
    console.error("Error requesting payment approval:", error)
    return NextResponse.json({ message: "Failed to request payment approval" }, { status: 500 })
  }
}
