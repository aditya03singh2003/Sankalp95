import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Payment from "@/models/Payment"
import mongoose from "mongoose"

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
      enum: ["cash", "bank", "upi", "cheque", null],
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    nextPaymentDue: {
      type: Date,
      default: null,
    },
    paymentHistory: [
      {
        status: String,
        date: Date,
        amount: Number,
        paymentMethod: String,
        notes: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  })

  // Pre-save middleware to set the next payment due date when a payment is marked as paid
  TeacherSalarySchema.pre("save", function (next) {
    // If the payment status is changing to paid and there's a payment date
    if (this.isModified("status") && this.status === "paid" && this.paymentDate) {
      // Add the payment to history
      if (!this.paymentHistory) {
        this.paymentHistory = []
      }

      this.paymentHistory.push({
        status: "paid",
        date: this.paymentDate,
        amount: this.amount,
        paymentMethod: this.paymentMethod,
        notes: this.notes,
      })

      // Set the next payment due date to one month after the current payment date
      const nextDueDate = new Date(this.paymentDate)
      nextDueDate.setMonth(nextDueDate.getMonth() + 1)
      this.nextPaymentDue = nextDueDate
    }
    next()
  })

  TeacherSalary = mongoose.model("TeacherSalary", TeacherSalarySchema)
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const now = new Date()

    // Reset student payments
    const studentPaymentsResult = await resetStudentPayments(now)

    // Reset teacher salaries
    const teacherSalariesResult = await resetTeacherSalaries(now)

    return NextResponse.json({
      success: true,
      studentPayments: studentPaymentsResult,
      teacherSalaries: teacherSalariesResult,
    })
  } catch (error) {
    console.error("Error resetting payment statuses:", error)
    return NextResponse.json({ error: "Failed to reset payment statuses" }, { status: 500 })
  }
}

// Function to reset student payments that are due
async function resetStudentPayments(now: Date) {
  // Find all paid payments where the next payment is due
  const paymentsToReset = await Payment.find({
    status: "paid",
    nextPaymentDue: { $lte: now },
    isRecurring: true,
  })

  console.log(`Found ${paymentsToReset.length} student payments to reset`)

  // Reset each payment
  const resetResults = []
  for (const payment of paymentsToReset) {
    // Create a new payment record for the next month
    const newPayment = new Payment({
      studentId: payment.studentId,
      amount: payment.amount,
      month: getMonthName(now.getMonth()),
      year: now.getFullYear(),
      status: "pending",
      isRecurring: payment.isRecurring,
    })

    await newPayment.save()

    resetResults.push({
      studentId: payment.studentId,
      previousPayment: {
        id: payment._id,
        month: payment.month,
        year: payment.year,
        amount: payment.amount,
      },
      newPayment: {
        id: newPayment._id,
        month: newPayment.month,
        year: newPayment.year,
        amount: newPayment.amount,
      },
    })
  }

  return {
    count: resetResults.length,
    details: resetResults,
  }
}

// Function to reset teacher salaries that are due
async function resetTeacherSalaries(now: Date) {
  // Find all paid salaries where the next payment is due
  const salariesToReset = await TeacherSalary.find({
    status: "paid",
    nextPaymentDue: { $lte: now },
  })

  console.log(`Found ${salariesToReset.length} teacher salaries to reset`)

  // Reset each salary
  const resetResults = []
  for (const salary of salariesToReset) {
    // Create a new salary record for the next month
    const currentMonth = now.getMonth() + 1 // 1-12
    const currentYear = now.getFullYear()

    // Check if a salary record already exists for this teacher, month, and year
    const existingSalary = await TeacherSalary.findOne({
      teacherId: salary.teacherId,
      month: currentMonth,
      year: currentYear,
    })

    if (!existingSalary) {
      const newSalary = new TeacherSalary({
        teacherId: salary.teacherId,
        amount: salary.amount,
        month: currentMonth,
        year: currentYear,
        status: "pending",
      })

      await newSalary.save()

      resetResults.push({
        teacherId: salary.teacherId,
        previousSalary: {
          id: salary._id,
          month: salary.month,
          year: salary.year,
          amount: salary.amount,
        },
        newSalary: {
          id: newSalary._id,
          month: newSalary.month,
          year: newSalary.year,
          amount: newSalary.amount,
        },
      })
    }
  }

  return {
    count: resetResults.length,
    details: resetResults,
  }
}

// Helper function to get month name
function getMonthName(monthIndex: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months[monthIndex]
}

// POST endpoint to manually trigger reset for specific payments
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { paymentIds, salaryIds } = data

    await connectToDatabase()
    const now = new Date()
    const results = { payments: [], salaries: [] }

    // Reset specific student payments
    if (paymentIds && Array.isArray(paymentIds)) {
      for (const id of paymentIds) {
        const payment = await Payment.findById(id)
        if (payment && payment.status === "paid") {
          // Create a new payment record for the next month
          const newPayment = new Payment({
            studentId: payment.studentId,
            amount: payment.amount,
            month: getMonthName(now.getMonth()),
            year: now.getFullYear(),
            status: "pending",
            isRecurring: payment.isRecurring,
          })

          await newPayment.save()
          results.payments.push({
            originalId: id,
            newId: newPayment._id,
          })
        }
      }
    }

    // Reset specific teacher salaries
    if (salaryIds && Array.isArray(salaryIds)) {
      for (const id of salaryIds) {
        const salary = await TeacherSalary.findById(id)
        if (salary && salary.status === "paid") {
          const currentMonth = now.getMonth() + 1 // 1-12
          const currentYear = now.getFullYear()

          // Check if a salary record already exists for this teacher, month, and year
          const existingSalary = await TeacherSalary.findOne({
            teacherId: salary.teacherId,
            month: currentMonth,
            year: currentYear,
          })

          if (!existingSalary) {
            const newSalary = new TeacherSalary({
              teacherId: salary.teacherId,
              amount: salary.amount,
              month: currentMonth,
              year: currentYear,
              status: "pending",
            })

            await newSalary.save()
            results.salaries.push({
              originalId: id,
              newId: newSalary._id,
            })
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error("Error manually resetting payment statuses:", error)
    return NextResponse.json({ error: "Failed to reset payment statuses" }, { status: 500 })
  }
}
