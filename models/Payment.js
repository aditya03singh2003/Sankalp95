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
  },
  { timestamps: true },
)

// Check if the model already exists to prevent overwriting during hot reloads
const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema)

export default Payment
