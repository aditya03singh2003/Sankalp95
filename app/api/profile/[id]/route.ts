import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import Student from "@/models/Student"
import Teacher from "@/models/Teacher"
import Parent from "@/models/Parent"
import Admin from "@/models/Admin"

export async function GET(request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fix: properly handle params as it's already resolved by Next.js
    const userId = params.id

    // Only allow users to access their own data unless they're an admin
    if (session.user.id !== userId && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await dbConnect()

    // Get basic user data
    const user = await User.findById(userId).lean()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password from response
    delete user.password

    let profileData = {
      ...user,
    }

    // Get role-specific data
    if (user.role === "student") {
      const student = await Student.findOne({ userId }).lean()
      if (student) {
        profileData = {
          ...profileData,
          ...student,
        }
      }
    } else if (user.role === "teacher") {
      const teacher = await Teacher.findOne({ userId }).lean()
      if (teacher) {
        profileData = {
          ...profileData,
          ...teacher,
        }
      }
    } else if (user.role === "parent") {
      const parent = await Parent.findOne({ userId }).lean()
      if (parent) {
        profileData = {
          ...profileData,
          ...parent,
        }
      }
    } else if (user.role === "admin") {
      const admin = await Admin.findOne({ userId }).lean()
      if (admin) {
        profileData = {
          ...profileData,
          ...admin,
        }
      }
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fix: properly handle params as it's already resolved by Next.js
    const userId = params.id

    // Only allow users to update their own data unless they're an admin
    if (session.user.id !== userId && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await dbConnect()

    const data = await request.json()

    // Update user data
    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update basic user fields
    user.name = data.name || user.name

    // Don't update email as it's used for authentication
    // user.email = data.email || user.email

    await user.save()

    // Update role-specific data
    if (user.role === "student") {
      let student = await Student.findOne({ userId })

      if (!student) {
        // Create new student record if it doesn't exist
        student = new Student({
          userId,
          name: data.name,
        })
      }

      // Update student fields
      student.name = data.name || student.name
      student.rollNumber = data.rollNumber || student.rollNumber
      student.grade = data.grade || student.grade
      student.section = data.section || student.section
      student.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : student.dateOfBirth
      student.gender = data.gender || student.gender
      student.contactNumber = data.phone || student.contactNumber
      student.address = data.address || student.address

      // Add city, state, pincode
      student.city = data.city || student.city
      student.state = data.state || student.state
      student.pincode = data.pincode || student.pincode

      await student.save()
    } else if (user.role === "teacher") {
      let teacher = await Teacher.findOne({ userId })

      if (!teacher) {
        // Create new teacher record if it doesn't exist
        teacher = new Teacher({
          userId,
          name: data.name,
        })
      }

      // Update teacher fields
      teacher.name = data.name || teacher.name
      teacher.qualification = data.qualification || teacher.qualification
      teacher.contactNumber = data.phone || teacher.contactNumber
      teacher.address = data.address || teacher.address

      // Add city, state, pincode
      teacher.city = data.city || teacher.city
      teacher.state = data.state || teacher.state
      teacher.pincode = data.pincode || teacher.pincode

      await teacher.save()
    } else if (user.role === "parent") {
      let parent = await Parent.findOne({ userId })

      if (!parent) {
        // Create new parent record if it doesn't exist
        parent = new Parent({
          userId,
          name: data.name,
          relation: "Guardian", // Default relation
        })
      }

      // Update parent fields
      parent.name = data.name || parent.name
      parent.contactNumber = data.phone || parent.contactNumber
      parent.alternateNumber = data.alternatePhone || parent.alternateNumber
      parent.address = data.address || parent.address
      parent.occupation = data.occupation || parent.occupation

      // Add city, state, pincode
      parent.city = data.city || parent.city
      parent.state = data.state || parent.state
      parent.pincode = data.pincode || parent.pincode

      await parent.save()
    } else if (user.role === "admin") {
      let admin = await Admin.findOne({ userId })

      if (!admin) {
        // Create new admin record if it doesn't exist
        admin = new Admin({
          userId,
          name: data.name,
          employeeId: `ADM${Math.floor(10000 + Math.random() * 90000)}`,
        })
      }

      // Update admin fields
      admin.name = data.name || admin.name
      admin.contactNumber = data.phone || admin.contactNumber
      admin.designation = data.designation || admin.designation

      await admin.save()
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
