import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/db"
import User from "@/models/User"
import Student from "@/models/Student"
import Teacher from "@/models/Teacher"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { role, email, password } = data

    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user based on role
    if (role === "student") {
      // Check if student was pre-added by admin
      const existingStudent = await Student.findOne({ email })

      if (existingStudent) {
        // Update the existing student record
        existingStudent.password = hashedPassword
        await existingStudent.save()

        // Create user account
        const user = new User({
          name: existingStudent.name,
          email,
          password: hashedPassword,
          role: "student",
          studentId: existingStudent.studentId,
        })

        await user.save()

        // Return user info for auto-login
        return NextResponse.json({
          message: "Student registered successfully",
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            studentId: existingStudent.studentId,
          },
        })
      } else {
        // Create new student
        const { name, class: className, rollNumber, subjects, parentName, parentContact } = data

        if (!name || !className || !subjects || !parentName || !parentContact || !rollNumber) {
          return NextResponse.json({ message: "Missing required student information" }, { status: 400 })
        }

        // Generate student ID using class and roll number
        const studentId = `STU-${className}-${rollNumber}`

        const student = new Student({
          name,
          email,
          password: hashedPassword,
          class: className,
          rollNumber,
          studentId,
          subjects,
          parentName,
          parentContact,
          createdBy: "self",
        })

        await student.save()

        // Create user account
        const user = new User({
          name,
          email,
          password: hashedPassword,
          role: "student",
          studentId: student.studentId,
        })

        await user.save()

        // Return user info for auto-login
        return NextResponse.json({
          message: "Student registered successfully",
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            studentId: student.studentId,
          },
        })
      }
    } else if (role === "teacher") {
      try {
        // Create new teacher
        const { name, classes, specialization, experience, phone, contactNumber } = data

        // Log the received data for debugging
        console.log("Teacher registration data:", { name, classes, specialization, experience, phone, contactNumber })

        if (!name || !classes || !specialization || !experience) {
          return NextResponse.json({ message: "Missing required teacher information" }, { status: 400 })
        }

        // Use either contactNumber or phone, ensuring at least one is present
        const teacherPhone = contactNumber || phone || ""
        if (!teacherPhone) {
          return NextResponse.json({ message: "Contact number is required" }, { status: 400 })
        }

        // Generate teacherId from phone number
        const last5Digits = teacherPhone.replace(/\D/g, "").slice(-5)
        const teacherId = `TEACH${last5Digits}`

        const teacher = new Teacher({
          name,
          email,
          password: hashedPassword,
          classes: Array.isArray(classes) ? classes : [classes],
          specialization,
          experience,
          contactNumber: teacherPhone,
          phone: teacherPhone,
          teacherId,
        })

        await teacher.save()

        // Create user account
        const user = new User({
          name,
          email,
          password: hashedPassword,
          role: "teacher",
          teacherId: teacher.teacherId,
        })

        await user.save()

        // Return user info for auto-login
        return NextResponse.json({
          message: "Teacher registered successfully",
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            teacherId: teacher.teacherId,
          },
        })
      } catch (teacherError) {
        console.error("Teacher creation error:", teacherError)
        return NextResponse.json(
          {
            message: "Failed to create teacher account",
            error: teacherError.message,
            stack: process.env.NODE_ENV === "development" ? teacherError.stack : undefined,
          },
          { status: 500 },
        )
      }
    } else {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 })
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        message: "Registration failed",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
