import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"
import Student from "@/models/Student"
import Teacher from "@/models/Teacher"
import Parent from "@/models/Parent"
import Admin from "@/models/Admin"
import bcrypt from "bcryptjs"
import Class from "@/models/Class"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    console.log("Connected to MongoDB in seed route")

    // Check if admin user already exists
    const adminExists = await User.findOne({ email: "admin@sankalp95.com" })

    if (adminExists) {
      console.log("Admin user already exists:", adminExists._id)
      // Check if classes already exist
      const existingClasses = await Class.countDocuments()

      if (existingClasses === 0) {
        // Create classes from 1 to 12
        const classPromises = []

        for (let i = 1; i <= 12; i++) {
          classPromises.push(
            Class.create({
              name: `Class ${i}`,
              description: `Standard ${i}`,
            }),
          )
        }

        await Promise.all(classPromises)
      }
      return NextResponse.json({
        message: "Seed data already exists",
        adminId: adminExists._id,
      })
    }

    // Create admin user with explicit role
    const salt = await bcrypt.genSalt(10)
    const adminPassword = await bcrypt.hash("admin123", salt)

    const admin = await User.create({
      name: "Admin User",
      email: "admin@sankalp95.com",
      password: adminPassword,
      role: "admin",
    })

    console.log("Admin user created:", admin._id)

    // Create admin record
    await Admin.create({
      userId: admin._id,
      name: "Admin User",
      employeeId: "ADM10001",
      designation: "Super Administrator",
      contactNumber: "9876543200",
      email: "admin@sankalp95.com",
      isActive: true,
    })

    // Create student user
    const studentPassword = await bcrypt.hash("student123", salt)
    const student = await User.create({
      name: "Rahul Sharma",
      email: "student@sankalp95.com",
      password: studentPassword,
      role: "student",
    })

    // Create student record
    const studentRecord = await Student.create({
      userId: student._id,
      name: "Rahul Sharma",
      rollNumber: "STU12345",
      grade: "Class 10",
      section: "A",
      dateOfBirth: new Date("2005-05-15"),
      gender: "Male",
      contactNumber: "9876543210",
      address: "123 Student Lane, New Delhi",
      subjects: ["Mathematics", "Physics", "Chemistry", "English", "Biology"],
      attendance: [
        {
          date: new Date(),
          status: "Present",
          remarks: "On time",
        },
      ],
      fees: [
        {
          amount: 4999,
          dueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
          status: "Pending",
        },
      ],
      isActive: true,
    })

    // Create teacher user
    const teacherPassword = await bcrypt.hash("teacher123", salt)
    const teacher = await User.create({
      name: "Priya Singh",
      email: "teacher@sankalp95.com",
      password: teacherPassword,
      role: "teacher",
    })

    // Create teacher record
    const teacherRecord = await Teacher.create({
      userId: teacher._id,
      name: "Priya Singh",
      employeeId: "TCH12345",
      qualification: "M.Sc, B.Ed",
      dateOfBirth: new Date("1985-03-20"),
      gender: "Female",
      contactNumber: "9876543211",
      email: "teacher@sankalp95.com",
      address: "456 Teacher Avenue, New Delhi",
      joiningDate: new Date("2020-06-15"),
      subjects: ["Physics", "Mathematics"],
      classes: ["Class 10", "Class 11"],
      salary: {
        amount: 45000,
        paymentHistory: [
          {
            month: "February",
            year: 2023,
            amount: 45000,
            paymentDate: new Date("2023-02-28"),
            status: "Paid",
          },
        ],
      },
      isActive: true,
    })

    // Create parent user
    const parentPassword = await bcrypt.hash("parent123", salt)
    const parent = await User.create({
      name: "Rajesh Verma",
      email: "parent@sankalp95.com",
      password: parentPassword,
      role: "parent",
    })

    // Create parent record
    const parentRecord = await Parent.create({
      userId: parent._id,
      name: "Rajesh Verma",
      relation: "Guardian",
      contactNumber: "9876543212",
      alternateNumber: "8765432109",
      email: "parent@sankalp95.com",
      address: "789 Parent Road, New Delhi",
      occupation: "Software Engineer",
      children: [student._id],
      notifications: [
        {
          title: "Fee Payment Reminder",
          message: "Please pay the pending fees for the current month.",
          date: new Date(),
          read: false,
          type: "Fee",
        },
      ],
      isActive: true,
    })

    // Update student with parent reference
    await Student.findByIdAndUpdate(studentRecord._id, { parentId: parentRecord._id })

    // Create another admin user for testing
    const adminPassword2 = await bcrypt.hash("password123", salt)
    const admin2 = await User.create({
      name: "Admin Test",
      email: "admin@test.com",
      password: adminPassword2,
      role: "admin",
    })

    // Create admin record for second admin
    await Admin.create({
      userId: admin2._id,
      name: "Admin Test",
      employeeId: "ADM67890",
      designation: "Assistant Administrator",
      contactNumber: "9876543201",
      email: "admin@test.com",
      isActive: true,
    })

    // Check if classes already exist
    const existingClasses = await Class.countDocuments()

    if (existingClasses === 0) {
      // Create classes from 1 to 12
      const classPromises = []

      for (let i = 1; i <= 12; i++) {
        classPromises.push(
          Class.create({
            name: `Class ${i}`,
            description: `Standard ${i}`,
          }),
        )
      }

      await Promise.all(classPromises)
    }

    return NextResponse.json({
      message: "Seed data created successfully",
      users: {
        admin: admin._id,
        admin2: admin2._id,
        student: student._id,
        teacher: teacher._id,
        parent: parent._id,
      },
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
