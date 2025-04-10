import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Schedule from "@/models/Schedule"
import Class from "@/models/Class"
import Student from "@/models/Student"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const day = searchParams.get("day")
    const classId = searchParams.get("class")
    const teacherId = searchParams.get("teacher")

    const query: any = {}

    if (day) {
      query.day = day
    }

    if (classId) {
      query.classGroup = classId
    }

    if (teacherId) {
      query.teacher = teacherId
    }

    // If the user is a student, only show schedules for their class
    if (session.user.role === "student") {
      // Get the student's class
      const student = await Student.findById(session.user.id)
      if (student && student.class) {
        // Find the class ID
        const classInfo = await Class.findOne({ name: student.class })
        if (classInfo) {
          query.classGroup = classInfo._id.toString()
        } else {
          // If we can't find the class ID, filter by class name
          query.className = student.class
        }
      }
    }

    const scheduleItems = await Schedule.find(query).sort({ day: 1, startTime: 1 })

    // Get class names for each schedule item
    const classIds = [...new Set(scheduleItems.filter((item) => item.classGroup).map((item) => item.classGroup))]
    const classes = await Class.find({ _id: { $in: classIds } })

    const populatedItems = scheduleItems.map((item) => {
      const classInfo = classes.find((c) => c._id.toString() === item.classGroup?.toString())
      return {
        ...item.toObject(),
        className: classInfo?.name || item.className || "Unknown Class",
      }
    })

    return NextResponse.json(populatedItems)
  } catch (error) {
    console.error("Error fetching schedule:", error)
    return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 })
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
    if (!data.day) {
      return NextResponse.json({ error: "Day is required" }, { status: 400 })
    }

    if (!data.startTime) {
      return NextResponse.json({ error: "Start time is required" }, { status: 400 })
    }

    if (!data.endTime) {
      return NextResponse.json({ error: "End time is required" }, { status: 400 })
    }

    if (!data.subject) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 })
    }

    if (!data.teacher) {
      return NextResponse.json({ error: "Teacher is required" }, { status: 400 })
    }

    // Get class name if classGroup is provided
    let className = ""
    if (data.classGroup) {
      const classInfo = await Class.findById(data.classGroup)
      if (classInfo) {
        className = classInfo.name
      }
    }

    // Create schedule item
    const scheduleItem = new Schedule({
      day: data.day,
      startTime: data.startTime,
      endTime: data.endTime,
      subject: data.subject,
      teacher: data.teacher,
      classGroup: data.classGroup || null,
      className: className,
      location: data.location || "",
      notes: data.notes || "",
      assignType: data.assignType || "class",
      selectedStudents: data.selectedStudents || [],
    })

    await scheduleItem.save()

    return NextResponse.json({
      ...scheduleItem.toObject(),
      className,
    })
  } catch (error) {
    console.error("Error creating schedule item:", error)
    return NextResponse.json({ error: "Failed to create schedule item" }, { status: 500 })
  }
}
