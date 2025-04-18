import mongoose from "mongoose"

const PaymentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      default: "pending",
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "bank", "cheque", null],
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
    isRecurring: {
      type: Boolean,
      default: true,
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
  },
  { timestamps: true },
)

// Pre-save middleware to set the next payment due date when a payment is marked as paid
PaymentSchema.pre("save", function (next) {
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
    if (this.isRecurring) {
      const nextDueDate = new Date(this.paymentDate)
      nextDueDate.setMonth(nextDueDate.getMonth() + 1)
      this.nextPaymentDue = nextDueDate
    }
  }
  next()
})

// Check if the model already exists to prevent overwriting during hot reloads
const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema)

export default Payment
