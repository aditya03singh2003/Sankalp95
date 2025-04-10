import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Teacher from "@/models/Teacher"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    const count = await Teacher.countDocuments({ isActive: true })

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error counting teachers:", error)
    return NextResponse.json({ error: "Failed to count teachers", count: 0 }, { status: 500 })
  }
}
