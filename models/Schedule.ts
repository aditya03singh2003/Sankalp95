import mongoose from "mongoose"

const ScheduleSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: [true, "Day is required"],
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },
    teacher: {
      type: String,
      required: [true, "Teacher is required"],
    },
    classGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    className: {
      type: String,
    },
    location: {
      type: String,
    },
    notes: {
      type: String,
    },
    assignType: {
      type: String,
      enum: ["class", "individual"],
      default: "class",
    },
    selectedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  { timestamps: true },
)

const Schedule = mongoose.models.Schedule || mongoose.model("Schedule", ScheduleSchema)

export default Schedule
