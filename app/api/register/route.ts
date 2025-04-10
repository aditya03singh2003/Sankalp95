import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/db" // Changed from dbConnect to connectToDatabase
import User from "@/models/User"
import Student from "@/models/Student"
import Teacher from "@/models/Teacher"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { role, email, password } = data

    await connectToDatabase() // Changed from dbConnect() to connectToDatabase()

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
      // Create new teacher
      const { name, classes, specialization, experience, phone } = data

      if (!name || !classes || !specialization || !experience) {
        return NextResponse.json({ message: "Missing required teacher information" }, { status: 400 })
      }

      const teacher = new Teacher({
        name,
        email,
        password: hashedPassword,
        classes,
        specialization,
        experience,
        phone: phone || "",
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
    } else {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 })
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: error.message || "Registration failed" }, { status: 500 })
  }
}
