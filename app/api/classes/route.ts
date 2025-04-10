import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Class from "@/models/Class"
import mongoose from "mongoose"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Check if classes collection exists, if not create it with default classes
    const db = mongoose.connection.db

    // Check if Class model has any documents
    const classCount = await Class.countDocuments()

    if (classCount === 0) {
      // Create default classes
      const defaultClasses = [
        { name: "Class 1", description: "First grade" },
        { name: "Class 2", description: "Second grade" },
        { name: "Class 3", description: "Third grade" },
        { name: "Class 4", description: "Fourth grade" },
        { name: "Class 5", description: "Fifth grade" },
        { name: "Class 6", description: "Sixth grade" },
        { name: "Class 7", description: "Seventh grade" },
        { name: "Class 8", description: "Eighth grade" },
        { name: "Class 9", description: "Ninth grade" },
        { name: "Class 10", description: "Tenth grade" },
        { name: "Class 11", description: "Eleventh grade" },
        { name: "Class 12", description: "Twelfth grade" },
      ]

      await Class.insertMany(defaultClasses)
      console.log("Created default classes")
    }

    const classes = await Class.find().sort({ name: 1 })

    return NextResponse.json(classes)
  } catch (error) {
    console.error("Error fetching classes:", error)
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    await connectToDatabase()

    const newClass = new Class(data)
    await newClass.save()

    return NextResponse.json(newClass)
  } catch (error) {
    console.error("Error creating class:", error)
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 })
  }
}
