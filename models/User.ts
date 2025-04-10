import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "teacher", "student", "parent"],
    default: "student",
  },
  profileImage: {
    type: String,
    default: "/placeholder.svg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// IMPORTANT: Disable the pre-save hook as we're handling password hashing in the API routes
// This prevents double-hashing which could be causing the login issues

export default mongoose.models.User || mongoose.model("User", UserSchema)
