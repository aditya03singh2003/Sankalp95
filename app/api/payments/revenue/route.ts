import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Student from "@/models/Student"

export async function GET() {
  try {
    await dbConnect()

    // Get current month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Aggregate payments for current month
    const result = await Student.aggregate([
      {
        $unwind: "$fees",
      },
      {
        $match: {
          "fees.status": "Paid",
          "fees.paymentDate": {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$fees.amount" },
        },
      },
    ])

    const total = result.length > 0 ? `₹${result[0].total.toLocaleString()}` : "₹0"

    return NextResponse.json({ total })
  } catch (error) {
    console.error("Error calculating revenue:", error)
    return NextResponse.json({ error: "Failed to calculate revenue" }, { status: 500 })
  }
}
