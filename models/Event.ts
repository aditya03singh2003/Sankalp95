import mongoose, { Schema, type Document } from "mongoose"

export interface IEvent extends Document {
  title: string
  date: Date
  startTime: string
  endTime: string
  location: string
  description: string
  type: string
  assignType: "all" | "class" | "individual"
  classGroup: mongoose.Types.ObjectId | string | null
  className: string
  selectedStudents: string[]
  createdBy: string
  createdAt: Date
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String, default: "" },
  description: { type: String, default: "" },
  type: { type: String, default: "Special Event" },
  assignType: { type: String, enum: ["all", "class", "individual"], default: "all" },
  classGroup: { type: Schema.Types.ObjectId, ref: "Class", default: null },
  className: { type: String, default: "" },
  selectedStudents: [{ type: String }],
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

// Create the model if it doesn't exist
const Event = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema)

export default Event
