import mongoose from "mongoose"
import { generateStudentId } from "@/lib/utils"
import bcrypt from "bcryptjs"

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    class: {
      type: String,
      required: [true, "Please provide a class"],
    },
    rollNumber: {
      type: Number,
      required: [true, "Please provide a roll number"],
      // Removed unique constraint
    },
    studentId: {
      type: String,
      unique: true,
    },
    subjects: {
      type: [String],
      required: [true, "Please provide at least one subject"],
    },
    parentName: {
      type: String,
      required: [true, "Please provide parent name"],
    },
    parentContact: {
      type: String,
      required: [true, "Please provide parent contact"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "requested", "paid"],
      default: "pending",
    },
    paymentHistory: [
      {
        amount: Number,
        date: Date,
        status: String,
        notes: String,
      },
    ],
    attendance: [
      {
        date: {
          type: Date,
          required: true,
        },
        subject: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["present", "absent", "leave"],
          required: true,
        },
        markedBy: {
          type: String,
          default: "system",
        },
      },
    ],
    createdBy: {
      type: String,
      enum: ["admin", "self"],
      default: "self",
    },
  },
  {
    timestamps: true,
  },
)

// Pre-save hook to generate studentId if not provided
StudentSchema.pre("save", async function (next) {
  if (!this.studentId) {
    // Format: STU + 2-digit class + 3-digit roll number
    this.studentId = generateStudentId(this.class, this.rollNumber)

    // Check if this studentId already exists
    const Student = mongoose.models.Student
    const existingStudent = await Student.findOne({ studentId: this.studentId })

    // If exists, append a random number to make it unique
    if (existingStudent) {
      const randomSuffix = Math.floor(Math.random() * 100)
      this.studentId = `${this.studentId}${randomSuffix}`
    }
  }

  // Hash password if modified
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }

  next()
})

// Compare password method
StudentSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.Student || mongoose.model("Student", StudentSchema)
