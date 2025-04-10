import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const TeacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    contactNumber: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    qualification: {
      type: String,
    },
    specialization: {
      type: String,
    },
    experience: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
    },
    joiningDate: {
      type: Date,
    },
    teacherId: {
      type: String,
      unique: true,
    },
    employeeId: {
      type: String,
    },
    salary: {
      type: Number,
    },
    classes: {
      type: Array,
    },
    subjects: {
      type: Array,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
)

// Pre-save hook to ensure employeeId matches teacherId format
TeacherSchema.pre("save", function (next) {
  // If employeeId is not set, use teacherId
  if (!this.employeeId && this.teacherId) {
    this.employeeId = this.teacherId
  }

  // If teacherId is not set but we have a phone number, generate one
  if (!this.teacherId && this.contactNumber) {
    const last5Digits = this.contactNumber.replace(/\D/g, "").slice(-5)
    this.teacherId = `TEACH${last5Digits}`

    // Also set employeeId if not already set
    if (!this.employeeId) {
      this.employeeId = this.teacherId
    }
  }

  next()
})

// Method to compare password
TeacherSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema)

export default Teacher
