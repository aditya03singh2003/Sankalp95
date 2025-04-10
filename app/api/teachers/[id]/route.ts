import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Teacher from "@/models/Teacher"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!params?.id) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 })
    }

    await connectToDatabase()

    const teacher = await Teacher.findById(params.id)

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    return NextResponse.json(teacher)
  } catch (error) {
    console.error("Error fetching teacher:", error)
    return NextResponse.json({ error: "Failed to fetch teacher" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!params?.id) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 })
    }

    const data = await request.json()
    console.log("Updating teacher with data:", data)

    await connectToDatabase()

    // Format classes to ensure they match the schema
    const formattedData = { ...data }

    // Ensure classes is an array of objects with name property
    if (formattedData.classes && Array.isArray(formattedData.classes)) {
      formattedData.classes = formattedData.classes
        .map((cls) => {
          if (typeof cls === "string") {
            return { name: cls }
          } else if (cls && typeof cls === "object" && cls.name) {
            return { name: cls.name }
          }
          return null
        })
        .filter(Boolean)
    }

    // Use findByIdAndUpdate with proper options
    const teacher = await Teacher.findByIdAndUpdate(
      params.id,
      { $set: formattedData },
      { new: true, runValidators: true },
    )

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    console.log("Teacher updated successfully:", teacher)
    return NextResponse.json(teacher)
  } catch (error) {
    console.error("Error updating teacher:", error)
    return NextResponse.json({ error: error.message || "Failed to update teacher" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!params?.id) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 })
    }

    await connectToDatabase()

    const teacher = await Teacher.findByIdAndDelete(params.id)

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Teacher deleted successfully" })
  } catch (error) {
    console.error("Error deleting teacher:", error)
    return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 })
  }
}
