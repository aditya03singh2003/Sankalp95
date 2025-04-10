import mongoose from "mongoose"

const AdminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    designation: {
      type: String,
      default: "Administrator",
    },
    contactNumber: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    permissions: {
      type: [String],
      default: ["all"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema)
