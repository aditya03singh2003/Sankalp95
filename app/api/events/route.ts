import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Event from "@/models/Event"
import Class from "@/models/Class"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const classId = searchParams.get("class")
    const type = searchParams.get("type")
    const upcoming = searchParams.get("upcoming") === "true"

    const query: any = {}

    if (classId) {
      query.classGroup = classId
    }

    if (type) {
      query.type = type
    }

    if (upcoming) {
      query.date = { $gte: new Date() }
    }

    const events = await Event.find(query).sort({ date: 1 }).lean()
    console.log(`Found ${events.length} events matching query:`, query)

    // Get class names for each event
    const classIds = [...new Set(events.filter((event) => event.classGroup).map((event) => event.classGroup))]
    const classes = await Class.find({ _id: { $in: classIds } }).lean()

    const populatedEvents = events.map((event) => {
      const classInfo = classes.find((c) => c._id.toString() === event.classGroup?.toString())
      return {
        ...event,
        _id: event._id.toString(),
        className: classInfo?.name || event.className || "Unknown Class",
        date: event.date.toISOString(),
      }
    })

    return NextResponse.json(populatedEvents)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
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

    // Validate required fields
    if (!data.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    if (!data.date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }

    if (!data.startTime) {
      return NextResponse.json({ error: "Start time is required" }, { status: 400 })
    }

    if (!data.endTime) {
      return NextResponse.json({ error: "End time is required" }, { status: 400 })
    }

    // Get class name if classGroup is provided
    let className = ""
    if (data.classGroup) {
      const classInfo = await Class.findById(data.classGroup)
      if (classInfo) {
        className = classInfo.name
      }
    }

    // Create event
    const event = new Event({
      title: data.title,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location || "",
      description: data.description || "",
      type: data.type || "Special Event",
      assignType: data.assignType || "all",
      classGroup: data.classGroup || null,
      className: className,
      selectedStudents: data.selectedStudents || [],
      createdBy: session.user.id,
      createdAt: new Date(),
    })

    await event.save()
    console.log("Created new event:", event._id.toString())

    return NextResponse.json({
      ...event.toObject(),
      _id: event._id.toString(),
      className,
      date: event.date.toISOString(),
    })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
