import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const studentId = params.id

    // Verify the user has permission to access this data
    if (session.user.role !== "admin" && session.user.role !== "teacher" && session.user.id !== studentId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await connectToDatabase()

    // Get upcoming events
    const db = await connectToDatabase()
    const eventsCollection = db.collection("events")

    // Get events that are upcoming (date is greater than or equal to today)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const events = await eventsCollection
      .find({
        date: { $gte: today },
      })
      .sort({ date: 1 })
      .toArray()

    // Format the events for the frontend
    const formattedEvents = events.map((event) => ({
      id: event._id.toString(),
      title: event.title,
      description: event.description,
      date: event.date.toISOString(),
      location: event.location || "Main Hall",
      type: event.type || "General",
    }))

    return NextResponse.json(formattedEvents)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
