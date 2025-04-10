import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Payment from "@/models/Payment"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Validate the payment ID
    const paymentId = params.id
    if (!ObjectId.isValid(paymentId)) {
      return NextResponse.json({ error: "Invalid payment ID format" }, { status: 400 })
    }

    const payment = await Payment.findById(paymentId)
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error("Error fetching payment:", error)
    return NextResponse.json({ error: "Failed to fetch payment" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    console.log("Updating payment with data:", data)

    await connectToDatabase()

    // Validate the payment ID
    const paymentId = params.id
    if (!ObjectId.isValid(paymentId)) {
      return NextResponse.json({ error: "Invalid payment ID format" }, { status: 400 })
    }

    // Find the payment
    const payment = await Payment.findById(paymentId)
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Update the payment
    if (data.status) payment.status = data.status
    if (data.amount !== undefined) payment.amount = Number(data.amount)
    if (data.paymentMethod) payment.paymentMethod = data.paymentMethod
    if (data.paymentDate) payment.paymentDate = new Date(data.paymentDate)
    if (data.notes !== undefined) payment.notes = data.notes

    await payment.save()
    console.log("Payment updated successfully:", payment)

    return NextResponse.json(payment)
  } catch (error) {
    console.error("Error updating payment:", error)
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Validate the payment ID
    const paymentId = params.id
    if (!ObjectId.isValid(paymentId)) {
      return NextResponse.json({ error: "Invalid payment ID format" }, { status: 400 })
    }

    const result = await Payment.findByIdAndDelete(paymentId)
    if (!result) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Payment deleted successfully" })
  } catch (error) {
    console.error("Error deleting payment:", error)
    return NextResponse.json({ error: "Failed to delete payment" }, { status: 500 })
  }
}
