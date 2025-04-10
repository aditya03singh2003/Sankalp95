import mongoose from "mongoose"

const ParentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Please provide parent name"],
  },
  relation: {
    type: String,
    enum: ["Father", "Mother", "Guardian"],
    required: [true, "Please specify relation"],
  },
  contactNumber: {
    type: String,
    required: [true, "Please provide contact number"],
  },
  alternateNumber: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "Please provide address"],
  },
  occupation: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  notifications: [
    {
      title: String,
      message: String,
      date: {
        type: Date,
        default: Date.now,
      },
      read: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        enum: ["Attendance", "Fee", "Academic", "General"],
        default: "General",
      },
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
})

export default mongoose.models.Parent || mongoose.model("Parent", ParentSchema)
