import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Student from "@/models/Student"
import Teacher from "@/models/Teacher"
import Class from "@/models/Class"
import Payment from "@/models/Payment"

export async function GET() {
  try {
    await connectToDatabase()

    // Get total students count
    const totalStudents = await Student.countDocuments()

    // Get total teachers count
    const totalTeachers = await Teacher.countDocuments()

    // Get classes scheduled for today
    const today = new Date()
    const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][today.getDay()]

    // Get classes for today from the schedule collection
    const classesToday = await Class.countDocuments({ day: dayOfWeek })

    // Calculate revenue for this month
    const currentMonth = today.getMonth() + 1
    const currentYear = today.getFullYear()

    const payments = await Payment.find({
      status: "paid",
      $or: [
        { month: currentMonth, year: currentYear },
        {
          paymentDate: {
            $gte: new Date(currentYear, currentMonth - 1, 1),
            $lt: new Date(currentYear, currentMonth, 1),
          },
        },
      ],
    })

    const revenueThisMonth = payments.reduce((total, payment) => total + (payment.amount || 0), 0)

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      classesToday,
      revenueThisMonth: `₹${revenueThisMonth.toLocaleString()}`,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 })
  }
}
