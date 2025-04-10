import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    if (!id) {
      return NextResponse.json({ error: "Schedule ID is required" }, { status: 400 })
    }

    const db = await connectToDatabase()
    const scheduleCollection = db.collection("schedules")

    const result = await scheduleCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Schedule item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting schedule item:", error)
    return NextResponse.json({ error: "Failed to delete schedule item" }, { status: 500 })
  }
}
