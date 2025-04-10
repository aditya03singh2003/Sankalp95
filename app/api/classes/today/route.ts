import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Class from "@/models/Class"

export async function GET() {
  try {
    await dbConnect()

    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Count classes scheduled for today
    const count = await Class.countDocuments({
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error counting today's classes:", error)
    return NextResponse.json({ error: "Failed to count classes" }, { status: 500 })
  }
}
