import mongoose from "mongoose"

// Define the schema
const TeacherAttendanceSchema = new mongoose.Schema({
  teacherId: {
    type: String,
    required: true,
    ref: "Teacher",
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent", "leave"],
    required: true,
  },
  notes: {
    type: String,
  },
  markedBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create a compound index on teacherId and date to ensure uniqueness
TeacherAttendanceSchema.index({ teacherId: 1, date: 1 }, { unique: true })

// Create the model if it doesn't exist
let TeacherAttendance
try {
  TeacherAttendance = mongoose.model("TeacherAttendance")
} catch (error) {
  TeacherAttendance = mongoose.model("TeacherAttendance", TeacherAttendanceSchema)
}

export default TeacherAttendance
