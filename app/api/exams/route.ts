import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Exam from "@/models/Exam"
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
    const subject = searchParams.get("subject")
    const upcoming = searchParams.get("upcoming") === "true"

    const query: any = {}

    if (classId) {
      query.classGroup = classId
    }

    if (subject) {
      query.subject = subject
    }

    if (upcoming) {
      query.date = { $gte: new Date() }
    }

    const exams = await Exam.find(query).sort({ date: 1 }).lean()
    console.log(`Found ${exams.length} exams matching query:`, query)

    // Get class names for each exam
    const classIds = [...new Set(exams.filter((exam) => exam.classGroup).map((exam) => exam.classGroup))]
    const classes = await Class.find({ _id: { $in: classIds } }).lean()

    const populatedExams = exams.map((exam) => {
      const classInfo = classes.find((c) => c._id.toString() === exam.classGroup?.toString())
      return {
        ...exam,
        _id: exam._id.toString(),
        className: classInfo?.name || exam.className || "Unknown Class",
        date: exam.date.toISOString(),
      }
    })

    return NextResponse.json(populatedExams)
  } catch (error) {
    console.error("Error fetching exams:", error)
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 })
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

    if (!data.subject) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 })
    }

    if (!data.date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }

    if (!data.startTime) {
      return NextResponse.json({ error: "Start time is required" }, { status: 400 })
    }

    if (!data.duration) {
      return NextResponse.json({ error: "Duration is required" }, { status: 400 })
    }

    // Get class name if classGroup is provided
    let className = ""
    if (data.classGroup) {
      const classInfo = await Class.findById(data.classGroup)
      if (classInfo) {
        className = classInfo.name
      }
    }

    // Create exam
    const exam = new Exam({
      title: data.title,
      subject: data.subject,
      date: new Date(data.date),
      startTime: data.startTime,
      duration: data.duration,
      classGroup: data.classGroup || null,
      className: className,
      location: data.location || "",
      description: data.description || "",
      assignType: data.assignType || "class",
      selectedStudents: data.selectedStudents || [],
      createdBy: session.user.id,
      createdAt: new Date(),
    })

    await exam.save()
    console.log("Created new exam:", exam._id.toString())

    return NextResponse.json({
      ...exam.toObject(),
      _id: exam._id.toString(),
      className,
      date: exam.date.toISOString(),
    })
  } catch (error) {
    console.error("Error creating exam:", error)
    return NextResponse.json({ error: "Failed to create exam" }, { status: 500 })
  }
}
