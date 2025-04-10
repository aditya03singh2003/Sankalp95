import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { dbConnect } from "@/lib/db"
import User from "@/models/User"
import Student from "@/models/Student"
import Teacher from "@/models/Teacher"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Current password and new password are required" }, { status: 400 })
    }

    await dbConnect()

    // Find the user
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user password
    user.password = hashedPassword
    await user.save()

    // Update password in Student or Teacher collection if applicable
    if (session.user.role === "student") {
      await Student.findOneAndUpdate({ email: session.user.email }, { password: hashedPassword })
    } else if (session.user.role === "teacher") {
      await Teacher.findOneAndUpdate({ email: session.user.email }, { password: hashedPassword })
    }

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json({ message: "Failed to change password" }, { status: 500 })
  }
}
