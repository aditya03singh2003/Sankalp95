import mongoose, { Schema, type Document } from "mongoose"

export interface IExam extends Document {
  title: string
  subject: string
  date: Date
  startTime: string
  duration: number
  classGroup: mongoose.Types.ObjectId | string | null
  className: string
  location: string
  description: string
  assignType: "class" | "individual"
  selectedStudents: string[]
  createdBy: string
  createdAt: Date
}

const ExamSchema: Schema = new Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  duration: { type: Number, required: true },
  classGroup: { type: Schema.Types.ObjectId, ref: "Class", default: null },
  className: { type: String, default: "" },
  location: { type: String, default: "" },
  description: { type: String, default: "" },
  assignType: { type: String, enum: ["class", "individual"], default: "class" },
  selectedStudents: [{ type: String }],
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

// Create the model if it doesn't exist
const Exam = mongoose.models.Exam || mongoose.model<IExam>("Exam", ExamSchema)

export default Exam
