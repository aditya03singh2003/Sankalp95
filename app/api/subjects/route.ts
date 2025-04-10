import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const className = searchParams.get("class")

    await connectToDatabase()

    // For now, return a static list of subjects
    // In a real application, you would fetch this from the database based on the class

    const subjects = [
      { name: "Mathematics", _id: "math-101" },
      { name: "Science", _id: "science-101" },
      { name: "English", _id: "english-101" },
      { name: "History", _id: "history-101" },
      { name: "Geography", _id: "geography-101" },
      { name: "Computer Science", _id: "cs-101" },
      { name: "Physics", _id: "physics-101" },
      { name: "Chemistry", _id: "chemistry-101" },
      { name: "Biology", _id: "biology-101" },
    ]

    // Filter subjects based on class if needed
    // This is just a placeholder logic - in a real app, you'd have proper class-subject mappings
    let filteredSubjects = subjects

    if (className) {
      // Simple filtering logic - in a real app, this would be based on your database schema
      if (className.includes("11") || className.includes("12")) {
        filteredSubjects = subjects.filter((s) =>
          ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science"].includes(s.name),
        )
      } else if (className.includes("9") || className.includes("10")) {
        filteredSubjects = subjects.filter((s) =>
          ["Mathematics", "Science", "English", "History", "Geography"].includes(s.name),
        )
      }
    }

    return NextResponse.json(filteredSubjects)
  } catch (error) {
    console.error("Error fetching subjects:", error)
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 })
  }
}
