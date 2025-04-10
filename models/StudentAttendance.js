import mongoose from "mongoose"

const StudentAttendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student ID is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      validate: {
        validator: (v) => !isNaN(v.getTime()),
        message: (props) => `${props.value} is not a valid date!`,
      },
    },
    class: {
      type: String,
      required: [true, "Class is required"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },
    status: {
      type: String,
      enum: ["present", "absent", "leave"],
      default: "absent",
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
)

// Create a compound index on studentId, date, class, and subject to ensure uniqueness
StudentAttendanceSchema.index({ studentId: 1, date: 1, class: 1, subject: 1 }, { unique: true })

// Check if the model exists before creating a new one
const StudentAttendance =
  mongoose.models.StudentAttendance || mongoose.model("StudentAttendance", StudentAttendanceSchema)

export default StudentAttendance
