import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Payment from "@/models/Payment"
import Student from "@/models/Student"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const status = searchParams.get("status")
    const month = searchParams.get("month")
    const year = searchParams.get("year")

    const query: any = {}

    if (studentId) {
      query.studentId = studentId
    }

    if (status) {
      query.status = status
    }

    if (month) {
      query.month = month
    }

    if (year) {
      query.year = Number.parseInt(year)
    }

    console.log("Fetching payments with query:", query)
    const payments = await Payment.find(query).sort({ createdAt: -1 })
    console.log(`Found ${payments.length} payments`)

    // Fetch student details for each payment
    const populatedPayments = await Promise.all(
      payments.map(async (payment) => {
        const student = await Student.findById(payment.studentId)
        return {
          ...payment.toObject(),
          student: student ? student.toObject() : null,
        }
      }),
    )

    return NextResponse.json(populatedPayments)
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    console.log("Creating payment with data:", data)

    await connectToDatabase()

    // Validate required fields
    if (!data.studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    if (data.amount === undefined || data.amount === null) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 })
    }

    if (!data.month) {
      return NextResponse.json({ error: "Month is required" }, { status: 400 })
    }

    if (!data.year) {
      return NextResponse.json({ error: "Year is required" }, { status: 400 })
    }

    // Check if student exists
    const student = await Student.findById(data.studentId)
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Create the payment
    const payment = new Payment({
      studentId: data.studentId,
      amount: Number(data.amount),
      month: data.month,
      year: Number(data.year),
      status: data.status || "pending",
      paymentDate: data.paymentDate || null,
      paymentMethod: data.paymentMethod || null,
      notes: data.notes || "",
    })

    await payment.save()
    console.log("Payment created successfully:", payment)

    // Return the payment with student details
    const result = {
      ...payment.toObject(),
      student: student.toObject(),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
