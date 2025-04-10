import mongoose from "mongoose"

// Define the schema
const ClassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Class name is required"],
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

// Check if the model already exists to prevent overwriting
const Class = mongoose.models.Class || mongoose.model("Class", ClassSchema)

export default Class
